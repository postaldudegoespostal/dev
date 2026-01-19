import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { WakaTimeModal } from "@/app/components/WakaTimeModal";
import { BarChart3, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";

export function HomePage() {
  const [showWakaTime, setShowWakaTime] = useState(false);
  const { role } = useUser();
  const hasWelcomedVisitor = useRef(false);

  useEffect(() => {
      // Only show if explicitly set to visitor recently (could check time too, but simple for now)
      if (role === 'visitor' && !hasWelcomedVisitor.current) {
          toast.message("Welcome", { 
             description: "Enjoy the simplified view.",
             position: 'top-center'
          });
          hasWelcomedVisitor.current = true;
      }
  }, [role]);

  const techStack = {
    learning: ["Rust", "Go", "WebAssembly", "Kubernetes"],
    current: [
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "PostgreSQL",
      "Docker",
      "AWS",
      "GraphQL",
    ],
  };

  return (
    <div className="min-h-screen pt-20 relative z-10">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-border bg-card/80 backdrop-blur-sm text-sm text-muted-foreground mb-6 md:mb-8"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            <span className="text-primary">{'>'}_</span>
            <span>Full Stack Developer</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl tracking-tight mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
            Building digital experiences
            <br />
            <span className="text-muted-foreground inline-flex items-center">
              one line at a time
              <motion.span
                className="inline-block ml-1 text-primary"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              >
                |
              </motion.span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
            A forever learner passionate about crafting elegant solutions to complex problems.
            Specializing in full-stack development with a focus on modern web technologies.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              onClick={() => setShowWakaTime(true)}
              className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-sm relative overflow-hidden group"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {/* Inner glow effect */}
              <div className="absolute inset-[2px] bg-gradient-to-b from-white/10 to-transparent rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <BarChart3 className="w-5 h-5 relative z-10" />
              <span className="relative z-10">View Coding Stats</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 border-border hover:border-primary/50 hover:text-primary transition-all rounded-sm"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              <Github className="w-5 h-5" />
              GitHub Profile
            </Button>
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 mt-12"
          >
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-muted transition-colors hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-muted transition-colors hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg hover:bg-muted transition-colors hover:text-primary"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-6 py-24 border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
              Forever Learning
            </h2>
            <p className="text-muted-foreground">
              Constantly expanding my toolkit and exploring new technologies
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Stack */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                <h3 className="text-lg">Current Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.current.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm hover:border-primary/40 hover:shadow-[0_0_12px_rgba(220,38,38,0.15)] transition-all"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Learning */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                <h3 className="text-lg">Currently Learning</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.learning.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm hover:border-blue-500/40 hover:shadow-[0_0_12px_rgba(59,130,246,0.15)] transition-all"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Quote Section */}
      <section className="container mx-auto px-6 py-24">
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-2xl md:text-3xl text-muted-foreground italic tracking-tight">
            "The beautiful thing about learning is that no one can take it away from you."
          </p>
          <footer className="mt-4 text-sm text-muted-foreground">— B.B. King</footer>
        </motion.blockquote>
      </section>

      {/* WakaTime Modal */}
      <WakaTimeModal isOpen={showWakaTime} onClose={() => setShowWakaTime(false)} />
    </div>
  );
}