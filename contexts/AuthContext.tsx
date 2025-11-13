"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Cookies } from 'typescript-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  validatePasscode: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('site_passcode'));

    const validatePasscode = async (code: string): Promise<boolean> => {
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            const data = await res.json();
            if (res.ok && data.exists) {
                Cookies.set("site_passcode", code, { expires: 365 });
                setIsAuthenticated(true);
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error("Validate passcode error:", err);
            return false;
        }
    };


  return (
    <AuthContext.Provider value={{ isAuthenticated, validatePasscode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
