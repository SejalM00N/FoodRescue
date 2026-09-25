import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("foodrescue_user");
    const token = localStorage.getItem("foodrescue_token");

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // Register without selecting a role
  const register = async (name, email, phone, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      phone,
      password,
    });

    return response.data;
  };

  // Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("foodrescue_token", token);
    localStorage.setItem("foodrescue_user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  // Update user's role
  const updateRole = async (role) => {
    const response = await api.put("/auth/role", {
      role,
    });

    const { token, user } = response.data;

    localStorage.setItem("foodrescue_token", token);
    localStorage.setItem("foodrescue_user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("foodrescue_user", JSON.stringify(updatedUser));

    setUser(updatedUser);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("foodrescue_token");
    localStorage.removeItem("foodrescue_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        updateRole,
        updateUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
