import { motion } from "motion/react";
import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { api, BlogPost as ApiBlogPost } from "@/app/api";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";

interface BlogPost extends ApiBlogPost {
  readTime: string;
  category: string;
  excerpt: string;
  date: string;
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useUser();
  const hasWelcomedLearner = useRef(false);

  useEffect(() => {
      if (role === 'learner' && !hasWelcomedLearner.current) {
          toast.message("Keep Going!", {
             description: "Learning is a journey. Here are some resources for you.",
             duration: 5000,
          });
          hasWelcomedLearner.current = true;
      }
  }, [role]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.blogs.getAll();
        setPosts(data.map(post => ({
          ...post,
          readTime: "5 min read", // Default placeholder
          category: "Technology", // Default placeholder
          excerpt: post.content ? post.content.substring(0, 150) + "..." : "No preview available",
          date: post.createdDate
        })));
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
            Writing & Thoughts
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Sharing insights, lessons learned, and perspectives on software development.
            Join me on my journey of continuous learning.
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
                className="group py-8 border-b border-border last:border-0 hover:border-primary/20 transition-colors"
              >
                {/* Category Badge */}
                <span className="inline-block px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground mb-3">
                  {post.category}
                </span>

                {/* Title */}

              <h2 className="text-2xl tracking-tight mb-3 group-hover:text-muted-foreground transition-colors">
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
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
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

        {/* Integration Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 rounded-lg border border-border bg-muted/30 max-w-4xl"
        >
          <p className="text-sm text-muted-foreground">
            💡 <strong>Content Management:</strong> Blog posts are currently hardcoded. 
            Consider integrating with a headless CMS (Sanity, Contentful, Strapi) or use 
            Markdown files with a static site generator for easy content management.
          </p>
        </motion.div>
      </section>
    </div>
  );
}