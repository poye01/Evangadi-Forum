import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserState } from "../../App";
import { axiosInstance } from "../../utility/axios.js";

const ProtectRoute = ({ children, redirect }) => {
  const userContextData = useContext(UserState);
  const setUser = userContextData?.setUser;
  const navigate = useNavigate();
  const getUserData = async () => {
    try {
      const token = localStorage.getItem("EVANGADI_FORUM_2024"); // Get the token stored during login from local storage
      if (token) {
        const userData = await axiosInstance
          .get("/user/check", { headers: { Authorization: "Bearer " + token } })
          .then((response) => response.data);
        setUser(userData); // Store the user data in state so that it can be accessed by others too
      } else {
        navigate("/auth", { state: { redirect } });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return children;
};

export default ProtectRoute;
