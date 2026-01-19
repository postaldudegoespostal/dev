import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "visitor" | "learner" | "master" | null;

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  hasTakenQuiz: boolean;
  completeQuiz: (role: UserRole) => void;
  resetProgress: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(null);
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("user_role") as UserRole;
    const storedQuizStatus = localStorage.getItem("quiz_taken");

    if (storedRole) setRoleState(storedRole);
    if (storedQuizStatus === "true") setHasTakenQuiz(true);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem("user_role", newRole);
    } else {
      localStorage.removeItem("user_role");
    }
  };

  const completeQuiz = (newRole: UserRole) => {
    setRole(newRole);
    setHasTakenQuiz(true);
    localStorage.setItem("quiz_taken", "true");
  };

  const resetProgress = () => {
    setHasTakenQuiz(false);
    setRole(null);
    localStorage.removeItem("user_role");
    localStorage.removeItem("quiz_taken");
  };

  return (
    <UserContext.Provider value={{ role, setRole, hasTakenQuiz, completeQuiz, resetProgress }}>
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
