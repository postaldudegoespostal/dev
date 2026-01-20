import { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState("home");

  // Simple URL handling for initial load
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/admin") setCurrentPage("admin");
    else if (path === "/me" || path === "/portfolio") setCurrentPage("me");
    else if (path === "/blog") setCurrentPage("blog");
    else if (path === "/contact") setCurrentPage("contact");
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "me":
      case "portfolio":
        return <PortfolioPage />;
      case "about":
        return <AboutPage />;
      case "blog":
        return <BlogPage />;
      case "contact":
        return <ContactPage />;
      case "admin":
        return <AdminBlogPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark relative">
      {/* Animated Tech Background */}
      <TechBackground />
      
      {/* Navigation and Content passed down */}
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="relative z-10">
          {renderPage()}
      </main>
      
      {/* Quiz Modal handles its own visibility based on context but needs to route */}
      <QuizModal onNavigate={(page) => setCurrentPage(page)} />
      
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
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}