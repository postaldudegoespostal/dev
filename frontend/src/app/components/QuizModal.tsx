import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { useUser } from "@/app/context/UserContext";
import { Terminal, ShieldAlert, Loader2 } from "lucide-react";
import { api, SimulationScenarioResponse } from "@/app/api";

interface QuizModalProps {
  onNavigate: (page: string) => void;
}

export function QuizModal({ onNavigate }: QuizModalProps) {
  const { role, hasTakenQuiz, completeQuiz } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scenario, setScenario] = useState<SimulationScenarioResponse | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchScenario = async () => {
        try {
            const data = await api.simulation.getRandom();
            setScenario(data);
        } catch (err) {
            console.log("Failed to load scenario, defaulting visitor");
            // If backend fails, fallback gracefully
            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const isProtectedPage = window.location.pathname.startsWith("/admin");
    if (!hasTakenQuiz && !role && !isProtectedPage) {
        // Fetch question before showing
        fetchScenario();
        // Delay showing until loaded or timeout
        const timer = setTimeout(() => !loading && setOpen(true), 1000);
        return () => clearTimeout(timer);
    }
  }, [hasTakenQuiz, role]);

  // Show modal once loaded
  useEffect(() => {
     if (scenario && !hasTakenQuiz && !role) {
         setOpen(true);
     }
  }, [scenario, hasTakenQuiz, role]);

  const handleOptionSelect = async (optionId: string) => {
    setSelectedOptionId(optionId);
    setVerifying(true);

    try {
        if (!scenario) return;

        const result = await api.simulation.verify({
            scenarioId: scenario.id,
            selectedOptionId: optionId
        });

        // Small delay for UI feedback
        setTimeout(() => {
            setOpen(false);
            if (result.userLevel === "SENIOR") {
                completeQuiz("master");
                onNavigate("me");
            } else if (result.userLevel === "MID" || result.userLevel === "JUNIOR") {
                completeQuiz("learner");
                onNavigate("blog");
            } else {
                completeQuiz("visitor");
                onNavigate("home");
            }
        }, 800);

    } catch (error) {
        console.error("Verification failed", error);
        setOpen(false);
        completeQuiz("visitor");
    }
  };

  const handleSkip = () => {
    setOpen(false);
    completeQuiz("visitor");
    onNavigate("home");
  };

  if(!scenario) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleSkip()}>
       <DialogContent className="sm:max-w-xl border-primary/20 bg-black/95 backdrop-blur-xl shadow-2xl shadow-primary/10">
           <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-primary font-mono tracking-tighter">
                   <Terminal className="w-5 h-5" /> SYSTEM_DIAGNOSTIC_REQUIRED
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-muted-foreground pt-2">
                   Incident Report: {scenario.title}
                </DialogDescription>
           </DialogHeader>

           <div className="py-4">
               <div className="bg-muted/10 p-3 rounded border border-border/50 mb-4 font-mono text-sm leading-relaxed text-muted-foreground">
                  {/* System State Header */}
                  <div className="flex gap-4 text-xs mb-3 text-primary/70 border-b border-border/30 pb-2">
                      <span>CPU: {scenario.systemState.cpuLoad}%</span>
                      <span>LATENCY: {scenario.systemState.latency}ms</span>
                      <span>MEM: {scenario.systemState.memoryUsage}MB</span>
                  </div>
                  {scenario.description}
               </div>

               <div className="grid gap-3">
                   {scenario.options.map((opt, i) => (
                       <Button
                           key={opt.id}
                           disabled={verifying}
                           variant={"outline"}
                           className={`justify-start h-auto py-3 px-4 font-mono text-sm border-border/50 hover:bg-primary/10 hover:text-primary transition-all text-left whitespace-normal
                               ${selectedOptionId === opt.id ? "bg-primary/20 border-primary text-primary" : ""}
                           `}
                           onClick={() => handleOptionSelect(opt.id)}
                       >
                           <span className="mr-3 opacity-50 shrink-0">OPT_0{i+1}</span>
                           <div className="flex flex-col items-start gap-1">
                               <span className="font-semibold">{opt.title}</span>
                               <span className="text-[10px] text-muted-foreground font-sans opacity-80">{opt.description}</span>
                           </div>
                           {selectedOptionId === opt.id && verifying && <Loader2 className="ml-auto w-4 h-4 animate-spin" />}
                       </Button>
                   ))}
               </div>
           </div>

           <DialogFooter className="sm:justify-between items-center sm:gap-0 gap-2">
                <div className="flex items-center text-[10px] text-muted-foreground gap-1">
                    <ShieldAlert className="w-3 h-3" /> Root Access Required
                </div>
                <Button 
                    variant="ghost" 
                    onClick={handleSkip}
                    disabled={verifying}
                    className="text-muted-foreground hover:text-foreground text-xs"
                >
                    System Override (Skip) →
                </Button>
           </DialogFooter>
       </DialogContent>
    </Dialog>
  );
}
