import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { WakaTimeModal } from "@/app/components/WakaTimeModal";
import { BarChart3, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";
import { api } from "@/app/api";

function PhilosophyCard({ title, text, image, index }: { title: string; text: string; image: string; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-16 mb-40 last:mb-20`}>
      <motion.div 
        style={{ y }}
        className="flex-1 w-full relative h-[400px] overflow-hidden rounded-sm group bg-card/10 backdrop-blur-sm border border-border/20 flex items-center justify-center p-4"
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain transition-transform duration-1000 ease-in-out"
        />
      </motion.div>
      <div className="flex-1 text-left space-y-6">
        <h3 className="text-4xl md:text-5xl font-light tracking-tight">{title}</h3>
        <p className="text-xl text-muted-foreground leading-relaxed font-light">
          {text}
        </p>
      </div>
    </div>
  );
}

export function HomePage() {
  const [showWakaTime, setShowWakaTime] = useState(false);
  const { role, welcomeShown, setWelcomeShown } = useUser();
  const [isCoding, setIsCoding] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const stats = await api.stats.getCurrent();
        setIsCoding(stats.isCodingNow);
      } catch (e) {
        setIsCoding(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      // Only show if explicitly set to visitor recently (could check time too, but simple for now)
      if (role === 'visitor' && !welcomeShown) {
          toast.message("Welcome", { 
             description: "Enjoy the simplified view.",
             position: 'top-center'
          });
          setWelcomeShown(true);
      }
  }, [role, welcomeShown, setWelcomeShown]);

  const techStack = {
    learning: ["Kotlin", "AWS", "PostgreSQL", "MySQL"],
    current: [
      "Java",
      "Spring Boot",
      "Python",
      "Docker",
      "Git",
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
          <div className="mb-8">
            <span className="text-sm md:text-base font-mono text-muted-foreground uppercase tracking-widest inline-flex items-center">
              Mehmet Arslanca
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="ml-1 inline-block w-2 h-5 bg-primary"
              />
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl tracking-tight mb-12 font-light leading-tight">
            I choose simple. <br />
            I build systems that work, <br />
            systems that grow. <br />
            No magic. Just logic.
          </h1>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <Button
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-sm relative overflow-hidden group"
              style={{ fontFamily: 'var(--font-mono)' }}
              asChild
            >
              <a href="https://www.linkedin.com/in/mehmet-arslanca-5618b32a6/" target="_blank" rel="noopener noreferrer">
                  {/* Inner glow effect */}
                  <div className="absolute inset-[2px] bg-gradient-to-b from-white/10 to-transparent rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <Linkedin className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">LinkedIn</span>
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 border-border hover:border-primary/50 hover:text-primary transition-all rounded-sm"
              style={{ fontFamily: 'var(--font-mono)' }}
              asChild
            >
              <a href="https://github.com/postaldudegoespostal" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
                GitHub Profile
              </a>
            </Button>
          </div>

          {/* Tech Stack Section (MOVED & CLEANED) */}
          <div className="grid md:grid-cols-2 gap-12 text-left max-w-3xl mx-auto pt-16 border-t border-border/50">
            {/* Current Stack */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                <h3 className="text-lg font-mono uppercase tracking-wider">Current Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.current.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded border border-border bg-card/50 text-sm hover:border-primary/40 transition-all font-mono"
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
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <h3 className="text-lg font-mono uppercase tracking-wider">Advancing In</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.learning.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded border border-border bg-card/50 text-sm hover:border-blue-500/40 transition-all font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <motion.section 
        className="py-32 overflow-hidden border-t border-border/20 bg-transparent"
      >
        <div className="container mx-auto px-6">
          <PhilosophyCard 
            title="Abstraction is Key."
            text="Complexity is inevitable, but chaos is a choice. I don't try to destroy complexity; I encapsulate it. By building clear abstraction layers, I turn chaotic logic into consumable, reliable interfaces."
            image="https://i.imgur.com/N6bE1xM.png"
            index={0}
          />
          <PhilosophyCard 
            title="The Efficiency Paradox."
            text="AI is an incredible power tool, but it is not the master architect. It accelerates coding, but speed without direction is just a faster crash. The market is filling with generated code that 'looks' right but breaks under pressure. I combine modern speed with deep engineering discipline."
            image="https://i.imgur.com/8ct5cHO.png"
            index={1}
          />
          <PhilosophyCard 
            title="Owning the Architecture."
            text="To avoid sliding back to the unstable software chaos, one must do more than write/prompt a code. One must possess the logic. I build the critical core manually to ensure security and stability are baked in, not guessed at. I use tools to assist, but I hold the keys."
            image="https://i.imgur.com/koeQbUX.png"
            index={2}
          />
        </div>
      </motion.section>

      {/* Quote Section */}
      <section className="container mx-auto px-6 py-32 border-t border-border/10">
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-2xl md:text-3xl text-muted-foreground italic tracking-tight font-light leading-relaxed">
            "Working does not mean tiring oneself and sweating in vain. It is essential to utilize science, technology, and every civilized invention to the fullest extent, in accordance with the requirements of the age."
          </p>
          <footer className="mt-8 text-sm text-muted-foreground uppercase tracking-[0.3em] font-mono">— Mustafa Kemal Atatürk</footer>
        </motion.blockquote>
      </section>

      {/* WakaTime Modal */}
      <WakaTimeModal isOpen={showWakaTime} onClose={() => setShowWakaTime(false)} />
    </div>
  );
}