import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { WakaTimeModal } from "@/app/components/WakaTimeModal";
import { BarChart3, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";
import { api } from "@/app/api";
import { ArchitectureTree } from "@/app/components/ArchitectureTree";
import { useConfig } from "@/app/context/ConfigContext";

// --- Crber-Minimalism Components ---

const TerminalSimulator = () => {
  const [showCommand, setShowCommand] = useState(false);
  const [command, setCommand] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const fullCommand = "cat ~/motto.txt";
  const motto = "I choose simple. I build systems that work, systems that grow. No magic. Just logic.";

  useEffect(() => {
    // Cursor blink
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);

    // Wait 2 seconds after neofetch, then start typing
    const commandStartTimer = setTimeout(() => {
      setShowCommand(true);
    }, 2000);

    return () => {
      clearInterval(cursorInterval);
      clearTimeout(commandStartTimer);
    };
  }, []);

  useEffect(() => {
    if (!showCommand) return;

    // Type command
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex <= fullCommand.length) {
        setCommand(fullCommand.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setShowOutput(true);
        }, 300);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [showCommand]);

  const neofetchArt = `       ___
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡇⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⠟⠀⣀⣠⠄⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⢠⣶⣿⠟⠁⢠⣾⠋⠁⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠹⣿⡇⠀⠀⠸⣿⡄⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠙⠷⡀⠀⠀⢹⠗⠀⠀⠀⠀⠀⠀
      ⠀⠀⢀⣤⣴⡖⠒⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠒⢶⣄
      ⠀⠀⠈⠙⢛⣻⠿⠿⠿⠟⠛⠛⠛⠋⠉⠀⠀⠀⣸⡿
      ⠀⠀⠀⠀⠛⠿⣷⣶⣶⣶⣶⣾⠿⠗⠂⠀⢀⠴⠛⠁
      ⠀⠀⠀⠀⠀⢰⣿⣦⣤⣤⣤⣴⣶⣶⠄⠀⠀⠀⠀⠀
      ⣀⣤⡤⠄⠀⠀⠈⠉⠉⠉⠉⠉⠀⠀⠀⠀⢀⡀⠀⠀
      ⠻⣿⣦⣄⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣠⣴⠾⠃⠀⢀
      ⠀⠀⠈⠉⠛⠛⠛⠛⠛⠛⠛⠛⠋⠉⠁⠀⣀⣤⡶⠋
      ⠀⠀⠀⠀⠐⠒⠀⠠⠤⠤⠤⠶⠶⠚⠛⠛⠉⠀⠀⠀`;

  return (
    <div className="w-full max-w-5xl mx-auto mb-16">
      <div className="bg-[#0a0a0a] rounded-lg border border-zinc-800/50 shadow-2xl overflow-hidden font-mono text-sm">
        {/* Terminal Header */}
        <div className="bg-zinc-900/50 px-4 py-2 flex items-center gap-2 border-b border-zinc-800/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-zinc-500 text-xs ml-2">kitty</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 min-h-[450px]">
          {/* Neofetch display - Always visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex gap-8 mb-6"
          >
            {/* ASCII Art */}
            <pre className="text-green-400 text-xs leading-tight whitespace-pre">
{neofetchArt}
            </pre>

            {/* System Info */}
            <div className="flex-1 text-xs space-y-1">
              <div><span className="text-green-400">arslanca</span><span className="text-white">@</span><span className="text-green-400">root</span></div>
              <div className="text-zinc-500">-----------</div>
              <div><span className="text-green-400 font-bold">OS:</span> <span className="text-white">ArchLinux x86_64</span></div>
              <div><span className="text-green-400 font-bold">Host:</span> <span className="text-white">Developer Workstation</span></div>
              <div><span className="text-green-400 font-bold">Kernel:</span> <span className="text-white">6.18.8-arch</span></div>
              <div><span className="text-green-400 font-bold">Uptime:</span> <span className="text-white">∞ (always coding)</span></div>
              <div><span className="text-green-400 font-bold">Packages:</span> <span className="text-white">2048+ (npm, maven, docker)</span></div>
              <div><span className="text-green-400 font-bold">Shell:</span> <span className="text-white">zsh 5.9</span></div>
              <div><span className="text-green-400 font-bold">Terminal:</span> <span className="text-white">kitty</span></div>
              <div><span className="text-green-400 font-bold">CPU:</span> <span className="text-white">AMD Ryzen (Coffee-Powered)</span></div>
              <div><span className="text-green-400 font-bold">Memory:</span> <span className="text-white">32GB (Never Enough)</span></div>
              <div className="pt-2 flex gap-1">
                <div className="w-6 h-3 bg-zinc-700"></div>
                <div className="w-6 h-3 bg-red-500"></div>
                <div className="w-6 h-3 bg-green-500"></div>
                <div className="w-6 h-3 bg-yellow-500"></div>
                <div className="w-6 h-3 bg-blue-500"></div>
                <div className="w-6 h-3 bg-purple-500"></div>
                <div className="w-6 h-3 bg-cyan-500"></div>
                <div className="w-6 h-3 bg-white"></div>
              </div>
            </div>
          </motion.div>

          {/* Command typing - appears below neofetch */}
          {showCommand && (
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <span className="text-green-400">arslanca@root</span>
                <span className="text-zinc-500 mx-1">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-zinc-500 mx-1">$</span>
                <span className="text-zinc-300">{command}</span>
                {!showOutput && (
                  <span className={`ml-1 inline-block w-2 h-4 bg-zinc-300 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}></span>
                )}
              </div>

              {/* Output */}
              {showOutput && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-zinc-300 leading-relaxed pl-0 text-base mb-4"
                >
                  {motto}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MagneticWrapper = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({x: 0, y: 0});

    const handleMouse = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
            const middleX = clientX - (rect.left + rect.width / 2);
            const middleY = clientY - (rect.top + rect.height / 2);
            setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
        }
    };

    const reset = () => setPosition({x: 0, y: 0});

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};

// --------------------------------

function PhilosophyCard({ title, text, image, index }: { title: string; text: string; image: string; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-16 mb-40 last:mb-20 animate-fade-in-up`}>
      <motion.div
        style={{ y }}
        className="flex-1 w-full relative h-[400px] overflow-hidden rounded-sm group glass-panel flex items-center justify-center p-8 group-hover:border-primary/30 transition-colors duration-500"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-1000 ease-in-out"
        />
      </motion.div>
      <div className="flex-1 text-left space-y-6">
        <h3 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase text-gradient">{title}</h3>
        <p className="text-xl text-muted-foreground leading-relaxed font-light font-mono">
          {text}
        </p>
      </div>
    </div>
  );
}

export function HomePage() {
  const [showWakaTime, setShowWakaTime] = useState(false);
  const { role, welcomeShown, setWelcomeShown } = useUser();
  const { githubProfileUrl } = useConfig()!;
  const [isCoding, setIsCoding] = useState(false);
  const [techStack, setTechStack] = useState<{ current: string[], learning: string[] }>({
      current: [],
      learning: []
  });

  useEffect(() => {
      api.techStacks.getAll().then(data => {
          const current = data.filter(t => t.type === 'CURRENT').map(t => t.name);
          const learning = data.filter(t => t.type === 'ADVANCING').map(t => t.name);
          setTechStack({ current, learning });
      }).catch(err => console.error("Failed to fetch tech stacks", err));
  }, []);

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
      } else if (role === 'master' && !welcomeShown) {
          toast.success("Access Granted. System Internals Unlocked.", {
              duration: 5000,
              className: "bg-green-500/10 border-green-500 text-green-500 font-mono"
            });
            setWelcomeShown(true);
            const element = document.getElementById("architecture-section");
            if (element) {
                setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 1000);
            }
      }
  }, [role, welcomeShown, setWelcomeShown]);


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

          {/* Terminal Simulator */}
          <TerminalSimulator />

          <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
            <MagneticWrapper>
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
            </MagneticWrapper>

            <MagneticWrapper>
            <Button
              size="lg" 
              variant="outline" 
              className="gap-2 border-border hover:border-primary/50 hover:text-primary transition-all rounded-sm"
              style={{ fontFamily: 'var(--font-mono)' }}
              asChild
            >
              <a href={githubProfileUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5" />
                GitHub Profile
              </a>
            </Button>
            </MagneticWrapper>
          </div>

          {/* Tech Stack Section (MOVED & CLEANED) */}
          <div className="grid md:grid-cols-2 gap-12 text-left max-w-3xl mx-auto pt-16 border-t border-white/5">
            {/* Current Stack */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(255,77,77,1)]" />
                <h3 className="text-lg font-mono uppercase tracking-widest text-muted-foreground">Current Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.current.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-sm border border-white/10 bg-white/5 text-sm transition-all duration-300 font-mono text-muted-foreground hover:text-white hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(255,77,77,0.4)] cursor-default uppercase tracking-tight"
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
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]" />
                <h3 className="text-lg font-mono uppercase tracking-widest text-muted-foreground">Advancing In</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.learning.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-sm border border-white/10 bg-white/5 text-sm transition-all duration-300 font-mono text-muted-foreground hover:text-white hover:border-blue-500 hover:bg-blue-500/5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] cursor-default uppercase tracking-tight"
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

      {/* Internal Architecture Section - Only for Master */}
      {role === 'master' && (
        <section id="architecture-section" className="container mx-auto px-6 py-20 mb-20 border-t border-border/10 bg-primary/5 rounded-xl border-dashed border-2 border-primary/20">
             <div className="mb-8 text-center">
                 <h2 className="text-3xl font-mono text-primary mb-2">ACCESS GRANTED: SYSTEM INTERNALS</h2>
                 <p className="text-muted-foreground">You have proven yourself. Here is the live logical execution tree of this very system.</p>
             </div>
             <ArchitectureTree />
        </section>
      )}

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