import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import React from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleAuthSuccess = (payload) => {
    if (!payload) return;
    
    // Store the token in localStorage if it exists
    if (payload.token) {
      localStorage.setItem("token", payload.token);
    }
    
    // Update the user state
    if (payload.user) {
      setUser({
        id: payload.user.id,
        name: payload.user.name,
        email: payload.user.email,
        role: payload.user.role
      });
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      if (data?.data) {
        handleAuthSuccess(data.data);
        return data.data; // Return the data for the component to use
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      throw new Error(errorMessage);
    }
  };

  const register = async (payload) => {  
    return api.post("/auth/register", payload); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  // Initialize auth state on mount
  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify the token and get user data
        const { data } = await api.get("/auth/me");
        if (data?.data?.user) {
          setUser({
            id: data.data.user._id,
            name: data.data.user.name,
            email: data.data.user.email,
            role: data.data.user.role
          });
        } else {
          // If no user data is returned, clear the token
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // If there's an error (like 401), clear the token
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <p className="text-lg font-semibold tracking-[0.3em] text-indigo-300">Syncing profile…</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
