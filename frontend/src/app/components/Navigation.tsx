import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { WakaTimeLiveStatus } from "@/app/components/WakaTimeLiveStatus";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/me" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
    { name: "About Me", path: "/about" },
  ];

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Name with Live Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <Link
              to="/"
              className="text-xl tracking-tight text-foreground hover:text-primary transition-colors flex-shrink-0 text-left"
            >
              <span className="font-medium">arslanca</span>
              <span className="text-primary">.dev</span>
            </Link>

            {/* WakaTime Live Status - positioned below on mobile, next to it on desktop */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <WakaTimeLiveStatus isOnline={true} />
            </motion.div>
          </div>

          {/* Desktop Navigation Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-1"
          >
            {links.map((link) => {
              const isActive = currentPath === link.path || (link.path === "/me" && currentPath === "/portfolio");
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </motion.div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
             <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground active:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {links.map((link) => {
                const isActive = currentPath === link.path || (link.path === "/me" && currentPath === "/portfolio");
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-2xl font-light tracking-tight transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}