import React, { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [refUrl, setRefUrl] = useState(
    () => localStorage.getItem("refUrl") || null
  );
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    if (refUrl) {
      localStorage.setItem("refUrl", refUrl);
    }
  }, [refUrl]);

  const values = {
    user,
    setUser,
    error,
    setError,
    refUrl,
    setRefUrl,
    isLoading,
    setIsLoading,
  };

  return (
    <StateContext.Provider value={values}>{children}</StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
