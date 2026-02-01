import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { api, BlogPost, PinnedProject, GithubRepoResponse, TechStackResponse } from "@/app/api"; // Added PinnedProject
import { Trash2, Plus, LogOut, FileText, ChevronLeft, Edit, Layers, ArrowRight, Code } from "lucide-react"; // Added Layers
import { toast } from "sonner";
import { ContentRenderer } from "./ContentRenderer";

export function AdminBlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const activeTab = (searchParams.get("tab") as "blog" | "projects" | "techstacks") || "blog";
  const setActiveTab = (tab: string) => setSearchParams({ tab });

  // Blog State
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<PinnedProject[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTags, setProjectTags] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [githubRepos, setGithubRepos] = useState<GithubRepoResponse[]>([]);

  // TechStacks State
  const [techStacks, setTechStacks] = useState<TechStackResponse[]>([]);
  const [techName, setTechName] = useState("");
  const [techType, setTechType] = useState<"CURRENT" | "ADVANCING">("CURRENT");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.auth.check();
        setIsLoggedIn(true);
      } catch (e) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await api.blogs.getAll(currentPage, 10);
      setBlogs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

  const fetchProjects = async () => {
      try {
          const data = await api.pinnedProjects.getAll();
          setProjects(data);
      } catch (error) {
          console.error("Failed to fetch pinned projects", error);
      }
  }

  const fetchTechStacks = async () => {
      try {
          const data = await api.techStacks.getAll();
          setTechStacks(data);
      } catch (error) {
          console.error("Failed to fetch tech stacks", error);
      }
  }

  // Refetch when tab changes or login status changes or page changes
  useEffect(() => {
    if (isLoggedIn) {
        if (activeTab === "blog") fetchBlogs();
        if (activeTab === "projects") {
            fetchProjects();
            fetchGithubRepos();
        }
        if (activeTab === "techstacks") fetchTechStacks();
    }
  }, [activeTab, isLoggedIn, currentPage]);

  const fetchGithubRepos = async () => {
    try {
      const data = await api.projects.getAll();
      setGithubRepos(data);
    } catch (error) {
      console.error("Failed to fetch github repos", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await api.auth.login({ username, password, rememberMe });

      setIsLoggedIn(true);
      setStatus("idle");
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      if (error.response?.status === 401 || error.response?.status === 403) {
        setErrorMessage("Kullanıcı adı veya şifre hatalı!");
      } else {
        setErrorMessage("Giriş yapılırken bir hata oluştu.");
      }
    }
  };

  const handleLogout = async () => {
    try {
        await api.auth.logout();
    } catch (e) {
        console.error(e);
    }
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setEditingId(null);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      if (editingId) {
        await api.blogs.update(editingId, { title, content });
      } else {
        await api.blogs.add({ title, content });
      }
      setStatus("success");
      toast.success(editingId ? "Updated!" : "Published!", { description: "Blog post saved successfully." });
      setTitle("");
      setContent("");
      setEditingId(null);
      setIsAddingNew(false);
      fetchBlogs();
    } catch (error: any) {
      setStatus("error");
      // setErrorMessage(error.response?.status === 401 ? "Unauthorized" : "Failed to save post");
      if (error.response?.status === 401) {
          toast.error("Error", { description: "Unauthorized session expired." });
      } else if (error.response?.status === 400) {
           const data = error.response.data;
           if (data.errors) {
               const msgs = Object.values(data.errors).join(", ");
               toast.error("Validation Error", { description: msgs });
           } else if (data.detail) {
               toast.error("Business Error", { description: data.detail });
           } else {
               toast.error("Error", { description: "Invalid input." });
           }
      } else {
          toast.error("Error", { description: "Failed to save post." });
      }
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      const tagsArray = projectTags.split(',').map(t => t.trim()).filter(t => t !== "");
      try {
          if (editingProjectId) {
              await api.pinnedProjects.update(editingProjectId, {
                  title: projectTitle,
                  description: projectDesc,
                  tags: tagsArray,
                  githubUrl: projectGithub || undefined
              });
          } else {
              await api.pinnedProjects.add({
                  title: projectTitle,
                  description: projectDesc,
                  tags: tagsArray,
                  githubUrl: projectGithub || undefined
              });
          }
          setStatus("success");
          toast.success(editingProjectId ? "Project updated!" : "Project pinned!", {
              description: "Changes saved successfully."
          });
          setProjectTitle("");
          setProjectDesc("");
          setProjectTags("");
          setProjectGithub("");
          setEditingProjectId(null);
          setIsAddingProject(false);
          fetchProjects();
      } catch (error: any) {
          setStatus("error");
          if (error.response?.status === 401) {
              toast.error("Error", { description: "Session expired." });
          } else if (error.response?.status === 400) {
              const data = error.response.data;
              if (data.errors) {
                  const msgs = Object.values(data.errors).join(", ");
                  toast.error("Validation Error", { description: msgs });
              } else if (data.detail) {
                  toast.error("Hata", { description: data.detail });
              } else {
                  toast.error("Hata", { description: "Girdiğiniz verileri kontrol edin." });
              }
          } else {
              toast.error("Error", { description: "Failed to save project." });
          }
      }
  }

  const handleAddTechStack = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("loading");
      try {
          await api.techStacks.add({ name: techName, type: techType });
          setStatus("success");
          toast.success("Added", { description: "Tech stack added." });
          setTechName("");
          fetchTechStacks();
      } catch (error) {
          setStatus("error");
          toast.error("Error", { description: "Failed to add tech stack." });
      }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.blogs.delete(id);
      fetchBlogs();
      toast.success("Deleted", { description: "Blog post deleted." });
    } catch (error: any) {
      toast.error("Delete Failed", { description: error.response?.status === 401 ? "Unauthorized" : "Server Error" });
    }
  };

  const handleDeleteProject = async (id: number) => {
      if (!confirm("Delete project?")) return;
      try {
          await api.pinnedProjects.delete(id);
          fetchProjects();
          toast.success("Deleted", { description: "Project deleted." });
      } catch (error) {
          toast.error("Delete Failed", { description: "Could not delete project." });
      }
  }

  const handleDeleteTechStack = async (id: number) => {
       if (!confirm("Delete tech stack?")) return;
       try {
           await api.techStacks.delete(id);
           fetchTechStacks();
           toast.success("Deleted", { description: "Tech stack deleted." });
       } catch (error) {
           toast.error("Error", { description: "Failed to delete tech stack." });
       }
  };

  const handleEditClick = (blog: BlogPost) => {
    setTitle(blog.title);
    setContent(blog.content);
    setEditingId(blog.id);
    setIsAddingNew(true);
  };

  const handleEditProjectClick = (project: PinnedProject) => {
      setProjectTitle(project.title);
      setProjectDesc(project.description);
      setProjectTags(project.tags.join(', '));
      setProjectGithub(project.githubUrl || "");
      setEditingProjectId(project.id);
      setIsAddingProject(true);
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-32 flex items-center justify-center container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 border border-border rounded-xl bg-card/50 backdrop-blur-sm"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-muted-foreground text-sm">Please enter your credentials</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <div className="flex items-center space-x-2 pb-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-background"
              />
              <label htmlFor="rememberMe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Remember me
              </label>
            </div>
            {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Logging in..." : "Login"}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 max-w-4xl">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-light tracking-tight">System Admin</h1>
        <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-red-500">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      <div className="flex gap-4 mb-8 border-b border-border/40 pb-1">
          <Button
            variant={activeTab === "blog" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("blog")}
            className="rounded-b-none"
          >
              <FileText className="w-4 h-4 mr-2" />
              Blog Posts
          </Button>
           <Button
            variant={activeTab === "projects" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("projects")}
             className="rounded-b-none"
          >
              <Layers className="w-4 h-4 mr-2" />
              Pinned Projects
          </Button>
           <Button
            variant={activeTab === "techstacks" ? "secondary" : "ghost"}
            onClick={() => setActiveTab("techstacks")}
             className="rounded-b-none"
          >
              <Code className="w-4 h-4 mr-2" />
              Tech Stacks
          </Button>
      </div>

      {activeTab === "blog" ? (
        <>
            {/* Creates/Edit Form */}
            <AnimatePresence mode="wait">
                {isAddingNew ? (
                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleCreatePost}
                    className="space-y-6 mb-12 bg-card border border-border p-6 rounded-lg"
                >
                    <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium">{editingId ? "Edit Post" : "New Post"}</h2>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setIsAddingNew(false); setEditingId(null); setTitle(""); setContent(""); }}>
                        <ChevronLeft className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                    </div>
                     <Input
                        placeholder="Post Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        minLength={5}
                        maxLength={250}
                        className="text-lg font-medium"
                    />
                    <Textarea
                        placeholder="Write your thoughts... Image URLs allow you to embed images."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        maxLength={50000}
                        className="min-h-[300px] font-mono text-sm leading-relaxed"
                    />

                     {content && (
                        <div className="mt-6 p-6 border border-border rounded-lg bg-card/50">
                            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-widest">Live Preview</h3>
                             <div className="max-h-[400px] overflow-y-auto pr-2">
                                <ContentRenderer content={content} />
                             </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={status === "loading"}>
                        {status === "loading" ? "Saving..." : (editingId ? "Update Post" : "Publish Post")}
                    </Button>
                    </div>
                </motion.form>
                ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-8"
                >
                    <Button onClick={() => setIsAddingNew(true)} className="w-full h-16 border-dashed border-2 border-border bg-transparent hover:bg-muted/10 text-muted-foreground gap-2">
                    <Plus className="w-5 h-5" /> Write New Post
                    </Button>
                </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="space-y-4">
                {blogs.map((blog) => (
                <motion.div
                    key={blog.id}
                    layoutId={`blog-${blog.id}`}
                    className="p-6 rounded-lg border border-border bg-card/50 flex items-center justify-between group"
                >
                    <div>
                    <h3 className="text-lg font-medium mb-1">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{blog.createdDate}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => handleEditClick(blog)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDeletePost(blog.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    </div>
                </motion.div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                    </Button>
                    <span className="text-sm font-mono">
                        {currentPage} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}
        </>
      ) : activeTab === "projects" ? (
          <div>
              {/* Project Form */}
              <AnimatePresence>
                  {isAddingProject && (
                      <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          onSubmit={handleCreateProject}
                          className="bg-card border border-border p-6 rounded-lg mb-8 overflow-hidden"
                      >
                          <div className="grid gap-4 mb-4">
                              <Input
                                  placeholder="Project Title"
                                  value={projectTitle}
                                  onChange={(e) => setProjectTitle(e.target.value)}
                                  required
                              />
                              <Textarea
                                  placeholder="Description..."
                                  value={projectDesc}
                                  onChange={(e) => setProjectDesc(e.target.value)}
                                  required
                              />
                               <Input
                                  placeholder="Tags (comma separated)"
                                  value={projectTags}
                                  onChange={(e) => setProjectTags(e.target.value)}
                                  required
                              />
                               <div className="space-y-2">
                                  <label className="text-sm font-medium">Link to GitHub Repo (Optional)</label>
                                  <Select
                                      value={projectGithub}
                                      onValueChange={setProjectGithub}
                                  >
                                      <SelectTrigger>
                                          <SelectValue placeholder="Select a repository..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="none">No Repository Link</SelectItem>
                                          {githubRepos.map(repo => (
                                              <SelectItem key={repo.html_url} value={repo.html_url}>
                                                  {repo.name} ({repo.language})
                                              </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                               </div>
                          </div>
                          <div className="flex justify-end gap-2">
                              <Button type="button" variant="ghost" onClick={() => setIsAddingProject(false)}>Cancel</Button>
                              <Button type="submit">{editingProjectId ? "Update" : "Pin Project"}</Button>
                          </div>
                      </motion.form>
                  )}
              </AnimatePresence>

               {!isAddingProject && (
                  <Button onClick={() => {
                      setProjectTitle(""); setProjectDesc(""); setProjectTags(""); setProjectGithub(""); setEditingProjectId(null); setIsAddingProject(true);
                  }} className="mb-8">
                       <Plus className="w-4 h-4 mr-2" /> Pin New Project
                  </Button>
              )}

              <div className="grid gap-4">
                  {projects.map(project => (
                      <div key={project.id} className="p-4 border border-border rounded-lg bg-card/50 flex justify-between items-start">
                          <div>
                              <h3 className="font-bold text-lg">{project.title}</h3>
                              <p className="text-muted-foreground text-sm mb-2">{project.description}</p>
                              <div className="flex gap-2 flex-wrap">
                                  {project.tags.map(t => (
                                      <span key={t} className="text-xs px-2 py-1 bg-primary/10 rounded text-primary">{t}</span>
                                  ))}
                              </div>
                          </div>
                           <div className="flex gap-2">
                                <Button size="icon" variant="ghost" onClick={() => handleEditProjectClick(project)}>
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleDeleteProject(project.id)} className="text-red-500 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                           </div>
                      </div>
                  ))}
              </div>
          </div>
      ) : (
          <div className="space-y-8">
            <div className="bg-card border border-border p-6 rounded-lg">
                <h2 className="text-xl font-light mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add Tech Stack
                </h2>
                <form onSubmit={handleAddTechStack} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                            value={techName}
                            onChange={(e) => setTechName(e.target.value)}
                            placeholder="e.g. Java"
                            required
                        />
                    </div>
                    <div className="w-48 space-y-2">
                        <label className="text-sm font-medium">Type</label>
                         <Select value={techType} onValueChange={(v: "CURRENT" | "ADVANCING") => setTechType(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CURRENT">Current Stack</SelectItem>
                                <SelectItem value="ADVANCING">Advancing In</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" disabled={status === "loading"}>
                        Add
                    </Button>
                </form>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                     <h3 className="text-lg font-mono font-medium text-primary border-b border-border/50 pb-2">Current Stack</h3>
                     <div className="space-y-2">
                         {techStacks.filter(t => t.type === 'CURRENT').map(tech => (
                             <motion.div
                                key={tech.id}
                                layout
                                className="flex items-center justify-between p-3 bg-card/50 border border-border rounded group"
                             >
                                 <span className="font-mono">{tech.name}</span>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteTechStack(tech.id)}
                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                     <Trash2 className="w-4 h-4" />
                                 </Button>
                             </motion.div>
                         ))}
                     </div>
                 </div>

                 <div className="space-y-4">
                     <h3 className="text-lg font-mono font-medium text-blue-500 border-b border-border/50 pb-2">Advancing In</h3>
                     <div className="space-y-2">
                         {techStacks.filter(t => t.type === 'ADVANCING').map(tech => (
                             <motion.div
                                key={tech.id}
                                layout
                                className="flex items-center justify-between p-3 bg-card/50 border border-border rounded group"
                             >
                                 <span className="font-mono">{tech.name}</span>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteTechStack(tech.id)}
                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                     <Trash2 className="w-4 h-4" />
                                 </Button>
                             </motion.div>
                         ))}
                     </div>
                 </div>
            </div>
        </div>
      )}

    </div>
  );
}
