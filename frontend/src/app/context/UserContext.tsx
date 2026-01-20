import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "visitor" | "learner" | "master" | null;

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  hasTakenQuiz: boolean;
  welcomeShown: boolean;
  completeQuiz: (role: UserRole) => void;
  setWelcomeShown: (shown: boolean) => void;
  resetProgress: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null);
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);
  const [welcomeShown, setWelcomeShownState] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("user_role") as UserRole;
    const storedQuizStatus = localStorage.getItem("quiz_taken");
    const storedWelcomeShown = localStorage.getItem("welcome_shown");

    if (storedRole) setRoleState(storedRole);
    if (storedQuizStatus === "true") setHasTakenQuiz(true);
    if (storedWelcomeShown === "true") setWelcomeShownState(true);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem("user_role", newRole);
    } else {
      localStorage.removeItem("user_role");
    }
  };

  const setWelcomeShown = (shown: boolean) => {
    setWelcomeShownState(shown);
    if (shown) {
      localStorage.setItem("welcome_shown", "true");
    } else {
      localStorage.removeItem("welcome_shown");
    }
  };

  const completeQuiz = (newRole: UserRole) => {
    setRole(newRole);
    setHasTakenQuiz(true);
    setWelcomeShown(false); // Reset welcome shown status when quiz is taken
    localStorage.setItem("quiz_taken", "true");
  };

  const resetProgress = () => {
    setHasTakenQuiz(false);
    setRole(null);
    setWelcomeShown(false);
    localStorage.removeItem("user_role");
    localStorage.removeItem("quiz_taken");
    localStorage.removeItem("welcome_shown");
  };

  return (
    <UserContext.Provider value={{ role, setRole, hasTakenQuiz, welcomeShown, completeQuiz, setWelcomeShown, resetProgress }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
