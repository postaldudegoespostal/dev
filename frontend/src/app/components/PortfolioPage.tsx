import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Github, ExternalLink, Star, GitFork, Loader2 } from "lucide-react";
import { api, GithubRepoResponse } from "@/app/api";
import { useUser } from "@/app/context/UserContext";
import { ArchitectureTree } from "@/app/components/ArchitectureTree";
import { toast } from "sonner";

// Use the API interface, or extend it locally for UI needs
interface Project extends GithubRepoResponse {
  // Add UI specific fields if needed
  homepage?: string | null;
  forks_count?: number;
  topics?: string[];
}

export function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { role, welcomeShown, setWelcomeShown } = useUser();

  useEffect(() => {
    if (role === 'master' && !welcomeShown) {
      toast.success("Access Granted. System Internals Unlocked.", {
        duration: 5000,
        className: "bg-green-500/10 border-green-500 text-green-500 font-mono"
      });
      setWelcomeShown(true);
    }
  }, [role, welcomeShown, setWelcomeShown]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.projects.getAll();
        // Transform the data to match UI needs if necessary
        // Backend returns: name, description, html_url (as url), stargazers_count (as stars string), language
        // Frontend expects: Project interface structure
        
        const transformedProjects = data.map(repo => ({
          ...repo,
          // Map backend fields to frontend expected fields if names differ
          homepage: null, // Backend doesn't strictly provide this yet
          forks_count: 0, // Backend doesn't provide this yet
          topics: [],     // Backend doesn't provide this yet
        }));
        
        setProjects(transformedProjects);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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
            Builds & Iterations / Grind
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Building the foundation, one commit at a time. These projects document my journey from core concepts to scalable solutions.
          </p>
        </motion.div>

        {role === 'master' && (
          <div className="mb-20">
            <ArchitectureTree />
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-6 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] transition-all"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl mb-2 group-hover:text-muted-foreground transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.topics.slice(0, 4).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{project.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="w-4 h-4" />
                      <span>{project.forks_count}</span>
                    </div>
                    {project.language && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>{project.language}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1 hover:text-primary rounded-sm"
                      asChild
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      <a
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    </Button>
                    {project.homepage && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 hover:text-primary rounded-sm"
                        asChild
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        <a
                          href={project.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}