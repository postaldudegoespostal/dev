import { useState, useEffect } from "react";
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
import { api, BlogPost, PinnedProject, GithubRepoResponse } from "@/app/api"; // Added PinnedProject
import { Trash2, Plus, LogOut, FileText, ChevronLeft, Edit, Layers } from "lucide-react"; // Added Layers
import { toast } from "sonner";

export function AdminBlogPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authHeader, setAuthHeader] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [activeTab, setActiveTab] = useState<"blog" | "projects">("blog"); // Added tab state

  // Blog State
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
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

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBlogs = async () => {
    try {
      const data = await api.blogs.getAll();
      setBlogs(data);
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

  // Refetch when tab changes or login status changes
  useEffect(() => {
    if (isLoggedIn) {
        if (activeTab === "blog") fetchBlogs();
        if (activeTab === "projects") {
            fetchProjects();
            fetchGithubRepos();
        }
    }
  }, [activeTab, isLoggedIn]);

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

    const header = 'Basic ' + btoa(username + ':' + password);

    try {
      await api.admin.verify(header);
      setAuthHeader(header);
      setIsLoggedIn(true);
      // Fetches are now handled by useEffect based on activeTab
      setStatus("idle");
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      if (error.response?.status === 401) {
        setErrorMessage("Kullanıcı adı veya şifre hatalı!");
      } else {
        setErrorMessage("Giriş yapılırken bir hata oluştu.");
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthHeader("");
    setUsername("");
    setPassword("");
    setEditingId(null);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      if (editingId) {
        await api.blogs.update(editingId, { title, content }, authHeader);
      } else {
        await api.blogs.add({ title, content }, authHeader);
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
              }, authHeader);
          } else {
              await api.pinnedProjects.add({
                  title: projectTitle,
                  description: projectDesc,
                  tags: tagsArray,
                  githubUrl: projectGithub || undefined
              }, authHeader);
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

  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.blogs.delete(id, authHeader);
      fetchBlogs();
      toast.success("Deleted", { description: "Blog post deleted." });
    } catch (error: any) {
      // alert("Delete failed: " + (error.response?.status === 401 ? "Unauthorized" : "Error"));
      toast.error("Delete Failed", { description: error.response?.status === 401 ? "Unauthorized" : "Server Error" });
    }
  };

  const handleDeleteProject = async (id: number) => {
      if (!confirm("Delete project?")) return;
      try {
          await api.pinnedProjects.delete(id, authHeader);
          fetchProjects();
          toast.success("Deleted", { description: "Project deleted." });
      } catch (error) {
          toast.error("Delete Failed", { description: "Could not delete project." });
      }
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
            <Button type="submit" className="w-full">Login</Button>
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
                        placeholder="Write your thoughts..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        maxLength={2000}
                        className="min-h-[300px] font-mono text-sm leading-relaxed"
                    />
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
        </>
      ) : (
        <>
        {/* PROJECTS TAB CONTENT */}
         <AnimatePresence mode="wait">
            {isAddingProject ? (
                <motion.form
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   onSubmit={handleCreateProject}
                   className="space-y-6 mb-12 bg-card border border-border p-6 rounded-lg"
                >
                    <div className="flex items-center justify-between mb-4">
                         <h2 className="text-xl font-medium">{editingProjectId ? "Edit Project" : "Pin Project"}</h2>
                        <Button type="button" variant="ghost" size="sm" onClick={() => { setIsAddingProject(false); setEditingProjectId(null); setProjectTitle(""); setProjectDesc(""); }}>
                           <ChevronLeft className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                    </div>

                    <Input
                       placeholder="Project Title"
                       value={projectTitle}
                       onChange={(e) => setProjectTitle(e.target.value)}
                       required
                    />
                    <Textarea
                       placeholder="Short description..."
                       value={projectDesc}
                       onChange={(e) => setProjectDesc(e.target.value)}
                       required
                    />
                    <Input
                       placeholder="Tags (comma separated) e.g. Java, Spring Boot"
                       value={projectTags}
                       onChange={(e) => setProjectTags(e.target.value)}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">GitHub Repository</label>
                      <Select
                        value={projectGithub}
                        onValueChange={(val) => {
                           setProjectGithub(val);
                           // Optional: Auto-fill title/desc if empty when selecting a repo
                           const repo = githubRepos.find(r => r.html_url === val);
                           if (repo && !projectTitle) setProjectTitle(repo.name);
                           if (repo && !projectDesc) setProjectDesc(repo.description || "");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a repository..." />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="manual-entry">Manual Entry (Use Input below)</SelectItem>
                           {githubRepos.map(repo => (
                             <SelectItem key={repo.html_url} value={repo.html_url}>
                               {repo.name} ({repo.language})
                             </SelectItem>
                           ))}
                        </SelectContent>
                      </Select>

                      {/* Fallback manual input or just info that it's selected */}
                      <Input
                        placeholder="Or enter GitHub URL manually"
                        value={projectGithub}
                        onChange={(e) => setProjectGithub(e.target.value)}
                        className="mt-2 text-sm"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={status === "loading"}>
                            {status === "loading" ? "Saving..." : (editingProjectId ? "Update Project" : "Pin Project")}
                        </Button>
                    </div>
                </motion.form>
            ) : (
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-8"
                >
                    <Button onClick={() => setIsAddingProject(true)} className="w-full h-16 border-dashed border-2 border-border bg-transparent hover:bg-muted/10 text-muted-foreground gap-2">
                    <Plus className="w-5 h-5" /> Pin New Project
                    </Button>
                </motion.div>
            )}
         </AnimatePresence>

          <div className="space-y-4">
               {projects.map((proj) => (
                   <motion.div
                       key={proj.id}
                       className="p-6 rounded-lg border border-border bg-card/50 flex flex-col gap-2 group relative"
                   >
                       <div className="flex justify-between items-start">
                           <div>
                               <h3 className="text-lg font-medium">{proj.title}</h3>
                               <p className="text-sm text-muted-foreground line-clamp-2">{proj.description}</p>
                           </div>
                           <div className="flex items-center gap-2">
                                <Button size="icon" variant="ghost" onClick={() => handleEditProjectClick(proj)}>
                                   <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-900" onClick={() => handleDeleteProject(proj.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                           </div>
                       </div>
                       <div className="flex gap-2 text-xs text-muted-foreground">
                           {proj.tags.map(t => <span key={t} className="bg-muted px-1 rounded">{t}</span>)}
                       </div>
                   </motion.div>
               ))}
          </div>

        </>
      )}

    </div>
  );
}
