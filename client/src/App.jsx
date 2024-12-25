import { createContext, useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { axiosInstance } from "./utility/axios.js";
import { Router } from "./Router.jsx";
export const UserState = createContext(); // Create a context for the user data
function App() {
  const [user, setUser] = useState({});
  const getUserData = async () => {
    try {
      const token = localStorage.getItem("EVANGADI_FORUM_2024"); // Get the token stored during login from local storage
      if (token) {
        const userData = await axiosInstance
          .get("/user/check", { headers: { Authorization: "Bearer " + token } })
          .then((response) => response.data);
        setUser(userData); // Store the user data in state so that it can be accessed by others too
      } else {
        setUser({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <UserState.Provider value={{ user, setUser }}>
      <RouterProvider router={Router} />
    </UserState.Provider>
  );
}

export default App;
