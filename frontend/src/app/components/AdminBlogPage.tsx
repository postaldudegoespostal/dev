import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { api } from "@/app/api";

export function AdminBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Create Basic Auth Header
    const authHeader = 'Basic ' + btoa(username + ':' + password);

    try {
      // We need to bypass the default api client to add custom headers for this request
      // or we can just use fetch since it's a specific admin action
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized: Check username/password");
        throw new Error(`Error: ${response.statusText}`);
      }

      setStatus("success");
      setTitle("");
      setContent("");
      // Don't clear credentials so they can add multiple posts
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to create post");
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Create a new blog post</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 border border-border rounded-lg bg-card/50">
            {/* Credentials Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/20 rounded border border-border/50">
               <div>
                  <label className="block text-xs uppercase text-muted-foreground mb-1">Username</label>
                  <Input 
                    value={username} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} 
                    placeholder="admin"
                    className="bg-background"
                  />
               </div>
               <div>
                  <label className="block text-xs uppercase text-muted-foreground mb-1">Password</label>
                  <Input 
                    type="password"
                    value={password} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
                    placeholder="******"
                    className="bg-background"
                  />
               </div>
            </div>

            <div className="h-px bg-border" />

            <div>
              <label className="block text-sm font-medium mb-2">Post Title</label>
              <Input
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="Enter an engaging title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                placeholder="Write your thoughts here..."
                required
                rows={12}
              />
            </div>

            {status === "error" && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm">
                {errorMessage}
              </div>
            )}

            {status === "success" && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded text-sm">
                Post created successfully!
              </div>
            )}

            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {status === "loading" ? "Publishing..." : "Publish Post"}
            </Button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
