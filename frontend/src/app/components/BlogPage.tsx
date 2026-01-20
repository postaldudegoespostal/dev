import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { api, BlogPost as ApiBlogPost } from "@/app/api";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";

interface BlogPost extends ApiBlogPost {
  category: string;
  excerpt: string;
  date: string;
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { role, welcomeShown, setWelcomeShown } = useUser();

  useEffect(() => {
    if (role === "learner" && !welcomeShown) {
      toast.message("Keep Going!", {
        description: "Learning is a journey. Here are some resources for you.",
        duration: 5000,
      });
      setWelcomeShown(true);
    }
  }, [role, welcomeShown, setWelcomeShown]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.blogs.getAll();
        setPosts(
          data.map((post) => ({
            ...post,
            category: "Technology",
            excerpt: post.content
              ? post.content.substring(0, 150) + "..."
              : "No preview available",
            date: post.createdDate,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch blog posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <section className="container mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="text-3xl md:text-5xl tracking-tight mb-4">
            Kernel Panic & Solutions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Documenting the engineering process. Technical deep-dives, architectural
            decisions, and the continuous pursuit of clean code.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          /* Blog Posts List */
          <div className="max-w-4xl">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group py-8 border-b border-border last:border-0 hover:border-primary/20 transition-colors cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                {/* Category Badge */}
                <span className="inline-block px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground mb-3">
                  {post.category}
                </span>

                {/* Title */}
                <h2 className="text-2xl tracking-tight mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                {/* Meta Info & Read More */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 group-hover:gap-2 group-hover:text-primary transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {/* Fullscreen Blog Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background"
          >
            <div className="h-full overflow-y-auto w-full">
              <div className="max-w-4xl mx-auto px-6 py-24 relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="mb-12 border-b border-border pb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground mb-6 uppercase tracking-widest">
                      {selectedPost.category}
                    </span>

                    <div className="flex items-start gap-4 md:gap-6 mb-8 group">
                      <Button
                        variant="ghost"
                        className="bg-black/30 backdrop-blur-md border border-white/10 text-white hover:bg-black/50 hover:text-white rounded-full p-2 h-10 w-10 md:h-14 md:w-14 flex items-center justify-center shadow-lg transition-all duration-300 shrink-0 mt-1 md:mt-2"
                        onClick={() => setSelectedPost(null)}
                      >
                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
                      </Button>
                      <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                        {selectedPost.title}
                      </h1>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                      <Calendar className="w-4 h-4" />
                      <span>PUBLISHED ON: {selectedPost.date}</span>
                    </div>
                  </div>

                  <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-300">
                    {selectedPost.content?.split("\n").map((paragraph, i) => (
                      <p
                        key={i}
                        className="mb-6 leading-relaxed text-lg lg:text-xl font-light"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="mt-24 pt-8 border-t border-border opacity-50 flex justify-between items-center text-xs font-mono">
                    <span>END_OF_TRANSMISSION</span>
                    <span>{selectedPost.id}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
