import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "@/app/components/Navigation";
import { HomePage } from "@/app/components/HomePage";
import { PortfolioPage } from "@/app/components/PortfolioPage";
import { BlogPage } from "@/app/components/BlogPage";
import { ContactPage } from "@/app/components/ContactPage";
import { AboutPage } from "@/app/components/AboutPage";
import { AIHelperWidget } from "@/app/components/AIHelperWidget";
import { TechBackground } from "@/app/components/TechBackground";
import { AdminBlogPage } from "@/app/components/AdminBlogPage";
import { UserProvider } from "@/app/context/UserContext";
import { QuizModal } from "@/app/components/QuizModal";
import { Toaster } from "@/app/components/ui/sonner";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Map path to page name for old logic if needed, but better to use routes
  const getPageFromPath = (path: string) => {
    if (path === "/admin") return "admin";
    if (path === "/me" || path === "/portfolio") return "me";
    if (path === "/blog") return "blog";
    if (path === "/contact") return "contact";
    if (path === "/about") return "about";
    return "home";
  };

  const currentPage = getPageFromPath(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground dark relative">
      {/* Animated Tech Background */}
      <TechBackground />
      
      {/* Navigation and Content passed down */}
      <Navigation />

      <main className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/me" element={<PortfolioPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminBlogPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
      </main>
      
      {/* Quiz Modal handles its own visibility based on context but needs to route */}
      <QuizModal onNavigate={(page) => {
          if (page === "home") navigate("/");
          else navigate(`/${page}`);
      }} />

      {/* AI Helper Widget - Fixed Bottom Right */}
      <AIHelperWidget />
      
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground mr-auto">
              © 2026 Built with React & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </BrowserRouter>
  );
}