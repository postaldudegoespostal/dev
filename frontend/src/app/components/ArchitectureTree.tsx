import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Folder, FileCode, CheckCircle2, ChevronRight, ChevronDown, Lock } from "lucide-react";

interface TreeNode {
  name: string;
  type: "folder" | "file";
  children?: TreeNode[];
  desc?: string;
}

const projectStructure: TreeNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "adapters",
        type: "folder",
        desc: "Integration Adapters",
        children: [
            {
                name: "models",
                type: "folder",
                children: [
                    { name: "WakaTimeResponse.java", type: "file" },
                    { name: "WakaTimeStatsResponse.java", type: "file" }
                ]
            },
            { name: "GithubAdapter.java", type: "file" },
            { name: "WakaTimeAdapter.java", type: "file" }
        ]
      },
      {
        name: "api.controllers", // Mapped via logic path, though physically package.
        type: "folder",
        desc: "REST Endpoints",
        children: [
          { name: "BlogController.java", type: "file" },
          { name: "ContactController.java", type: "file" },
          { name: "ProjectsController.java", type: "file" },
          { name: "SimulationController.java", type: "file" },
          { name: "StatsController.java", type: "file" },
        ],
      },
      {
        name: "business",
        type: "folder",
        desc: "Business Logic Layer",
        children: [
          { name: "abstracts", type: "folder", desc: "Service Interfaces", children: [
             { name: "BlogService.java", type: "file" },
             { name: "ContactService.java", type: "file" },
             { name: "ProjectService.java", type: "file" },
             { name: "SimulationService.java", type: "file" }
          ] },
          { name: "concretes", type: "folder", desc: "Service Implementations", children: [
             { name: "BlogManager.java", type: "file" },
             { name: "ContactManager.java", type: "file" },
             { name: "ProjectManager.java", type: "file" },
             { name: "SimulationManager.java", type: "file" }
          ] },
          { name: "requests", type: "folder", children: [
             { name: "CreateBlogRequest.java", type: "file" },
             { name: "SendMailRequest.java", type: "file" },
             { name: "VerifySimulationRequest.java", type: "file" }
          ]},
          { name: "responses", type: "folder", children: [
             { name: "GithubRepoResponse.java", type: "file" },
             { name: "SimulationScenarioResponse.java", type: "file" },
             { name: "StatsResponse.java", type: "file" },
             { name: "VerificationResultResponse.java", type: "file" }
          ]},
        ],
      },
      {
        name: "core",
        type: "folder",
        desc: "Core Utilities & Config",
        children: [
          { name: "config", type: "folder", children: [
             { name: "RestClientConfig.java", type: "file" },
             { name: "SecurityConfig.java", type: "file" },
             { name: "WebConfig.java", type: "file" }
          ]},
          { name: "utilities", type: "folder", children: [
             { name: "exceptions", type: "folder", children: [
                 { name: "ExceptionHandler.java", type: "file" }
             ]},
             { name: "interceptors", type: "folder", children: [
                 { name: "ExecutionTimeInterceptor.java", type: "file" }
             ]},
             { name: "ratelimit", type: "folder", children: [
                 { name: "RateLimitService.java", type: "file" }
             ]},
             { name: "results", type: "folder", children: [
                 { name: "ErrorResult.java", type: "file" }
             ]}
          ] },
        ],
      },
      {
        name: "dataAccess.abstracts",
        type: "folder",
        desc: "JPA Repositories",
        children: [
            { name: "BlogRepository.java", type: "file" },
            { name: "SimulationOptionRepository.java", type: "file" },
            { name: "SimulationScenarioRepository.java", type: "file" }
        ],
      },
      {
        name: "entities",
        type: "folder",
        desc: "Database Models",
        children: [
            { name: "BlogPost.java", type: "file" },
            { name: "SimulationOption.java", type: "file" },
            { name: "SimulationScenario.java", type: "file" }
        ],
      },
      { name: "DevApplication.java", type: "file" }
    ],
  },
];

const TreeItem = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === "folder";

  // Auto-expand first level folders
  useEffect(() => {
    if (depth < 2) setIsOpen(true);
  }, [depth]);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.1 }}
        className={`
          flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer select-none
          hover:bg-primary/10 transition-colors
          ${depth === 0 ? "text-primary font-bold" : "text-foreground/80"}
        `}
        style={{ marginLeft: `${depth * 1.5}rem` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder ? (
            isOpen ? <ChevronDown size={14} className="text-primary" /> : <ChevronRight size={14} className="text-muted-foreground" />
        ) : <div className="w-[14px]" />}
        
        {isFolder ? (
          <Folder size={16} className={node.name === "src" ? "text-primary" : "text-blue-400"} />
        ) : (
          <FileCode size={16} className="text-yellow-500" />
        )}
        
        <span className="font-mono text-sm tracking-wide">{node.name}</span>
        
        {node.desc && (
           <span className="text-[10px] text-muted-foreground ml-auto bg-muted px-1.5 py-0.5 rounded border border-border/40">
             {node.desc}
           </span>
        )}
      </motion.div>

      {isFolder && isOpen && node.children && (
        <div className="relative">
           {/* Vertical Guide Line */}
           <motion.div 
             initial={{ height: 0 }}
             animate={{ height: "100%" }}
             className="absolute left-[calc(1.5rem_*_var(--depth)_+_9px)] top-0 w-px bg-border/40"
             style={{ "--depth": depth } as React.CSSProperties} 
           />
           <div>
             {node.children.map((child, idx) => (
                <TreeItem key={idx} node={child} depth={depth + 1} />
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export function ArchitectureTree() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-0 right-0 p-4 opacity-20">
        <Lock className="w-24 h-24 text-primary" />
      </div>

      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
         <div className="h-8 w-1 bg-primary rounded-full" />
         <div>
            <h3 className="text-xl font-bold font-mono text-primary flex items-center gap-2">
               Access Granted <CheckCircle2 size={18} />
            </h3>
            <p className="text-xs text-muted-foreground font-mono">SYSTEM_INTERNALS_UNLOCKED // v4.0.1</p>
         </div>
      </div>
      
      <div className="space-y-1 overflow-x-auto pb-2">
        {projectStructure.map((node, i) => (
          <TreeItem key={i} node={node} />
        ))}
      </div>
    </motion.div>
  );
}
