import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    photo: "",
    isLoggedIn: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({
        name: localStorage.getItem("user_name") || "User",
        email: localStorage.getItem("user_email") || "",
        photo: localStorage.getItem("user_photo") || "",
        isLoggedIn: true,
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
