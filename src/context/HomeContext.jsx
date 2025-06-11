"use client"
import { createContext, useState, useContext } from "react";

const ProfileContext = createContext();

export const HomeContext = ({ children }) => {
  const [updateButton, setUpdateButton] = useState();

  return (
    <ProfileContext.Provider value={{ updateButton, setUpdateButton }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useGlobalContext = () => useContext(ProfileContext);
