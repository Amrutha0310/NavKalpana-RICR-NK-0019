
import React, { useEffect, useState } from "react";
import { useContext } from "react";

const AuthContext = React.createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("LearningUser")) || "",
  );
  const [isLogin, setIsLogin] = useState(!!user);

  const value = { user, setUser, isLogin, setIsLogin};

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};