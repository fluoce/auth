import React, { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  return (
    <ProfileContext.Provider value={values}>{children}</ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
