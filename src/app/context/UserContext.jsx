"use client";
import { createContext } from "react";

// Create the context
export const UserContext = createContext(null);

// Create a provider component
export const UserProvider = ({ children }) => {
  const baseUrl = "https://astrotalk-m3gl.onrender.com"; 

  return (
    <UserContext.Provider
      value={{
        baseUrl
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
