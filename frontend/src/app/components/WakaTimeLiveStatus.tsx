import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code2, Clock, FileCode } from "lucide-react";
import { api, StatsResponse } from "@/app/api";

interface WakaTimeLiveStatusProps {
  isOnline?: boolean;
}

export function WakaTimeLiveStatus({ }: WakaTimeLiveStatusProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.stats.getCurrent();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch wakatime stats", error);
        // Fallback or mock data could go here
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Poll every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine if online based on API response
  const isOnline = stats?.isCodingNow ?? false;

  if (loading || !isOnline || !stats) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-card/50" style={{ fontFamily: 'var(--font-mono)' }}>
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-sm text-muted-foreground">Currently Offline</span>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Main Status Bar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 px-3 py-1.5 rounded border border-border bg-card/50 hover:border-primary/30 transition-all cursor-pointer group"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {/* Pulsing Active Indicator */}
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary/30 animate-ping" />
        </motion.div>

        {/* Project Info - Hidden on mobile, shown on tablet/desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{stats.projectName}</span>
        </div>

        {/* Divider - Hidden on mobile */}
        <div className="hidden sm:block w-px h-4 bg-border" />

        {/* Session Time */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{stats.totalSpentOnCurrentProject}</span>
        </div>

        {/* Gradient Glow on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      </motion.div>

      {/* Hover Tooltip with Detailed Stats */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 z-50 w-72"
          >
            <div className="rounded-lg border border-border bg-card shadow-2xl overflow-hidden">
              {/* Tooltip Header */}
              <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="font-medium text-sm">Live Coding Session</span>
                </div>
              </div>

              {/* Tooltip Content */}
              <div className="p-4 space-y-3">
                {/* Currently Editing */}
                <div className="flex items-start gap-3">
                  <FileCode className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">Currently Editing</p>
                    <p className="text-sm font-medium truncate" title={stats.currentlyEditingFile}>
                      {stats.currentlyEditingFile}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      in {stats.ideName}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Time Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Session</p>
                    <p className="text-lg font-mono">{stats.totalSpentOnCurrentProject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Total (Today)</p>
                    <p className="text-lg font-mono">{stats.totalSpentOnAllProjects}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}