import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";

interface User {
  id: string;
  username: string;
}

interface AuthContext {
  user: User | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance
        .get(`/auth/profile/`)
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [baseURL, navigate]);

  const login = async (username: string, password: string): Promise<void> => {
    const response = await axios.post(`${baseURL}/auth/login/`, {
      username,
      password,
    });

    try {
      const { token, ...userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
    } catch (error) {
      console.log(error);
      alert("Invalid username or password");
    }
  };

  const register = async (username: string, password: string) => {
    const response = await axios.post(`${baseURL}/auth/register/`, {
      username,
      password,
    });

    try {
      const { token, ...userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again.");
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
