import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { api, BlogPost } from "@/app/api";
import { Trash2, Plus, LogOut, FileText, ChevronLeft, Edit } from "lucide-react";

export function AdminBlogPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authHeader, setAuthHeader] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const header = 'Basic ' + btoa(username + ':' + password);

    try {
      await api.admin.verify(header);
      setAuthHeader(header);
      setIsLoggedIn(true);
      fetchBlogs();
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
      setTitle("");
      setContent("");
      setEditingId(null);
      setIsAddingNew(false);
      fetchBlogs();
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.response?.status === 401 ? "Unauthorized" : "Failed to save post");
    }
  };

  const handleEditClick = (blog: BlogPost) => {
    setTitle(blog.title);
    setContent(blog.content);
    setEditingId(blog.id);
    setIsAddingNew(true);
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.blogs.delete(id, authHeader);
      fetchBlogs();
    } catch (error: any) {
      alert("Delete failed: " + (error.response?.status === 401 ? "Unauthorized" : "Error"));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
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
    <div className="min-h-screen pt-20">
      <section className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="w-8 h-8 text-primary" />
              Blog Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your blog content</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingNew(!isAddingNew);
                if (isAddingNew) {
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                }
              }}
              className="gap-2"
            >
              {isAddingNew ? <ChevronLeft className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isAddingNew ? "Back to List" : "New Post"}
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isAddingNew ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <form onSubmit={handleCreatePost} className="space-y-6 p-8 border border-border rounded-xl bg-card/50">
                <h2 className="text-xl font-semibold">{editingId ? "Edit Post" : "Create New Post"}</h2>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write content..."
                    required
                    rows={12}
                  />
                </div>
                {status === "error" && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm">
                    {errorMessage}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? "Saving..." : editingId ? "Update Post" : "Publish Post"}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4"
            >
              {blogs.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">No blog posts found.</p>
                </div>
              ) : (
                blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="p-6 border border-border rounded-xl bg-card/30 hover:bg-card/50 transition-colors flex justify-between items-center group"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{blog.title}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(blog.createdDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(blog)}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePost(blog.id)}
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
