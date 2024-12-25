import axios from "axios";

export const axiosInstance = axios.create({
  // local endpoint reference
  // baseURL: `http://localhost:5000/api`,
  // deploy endpoint reference
  baseURL: `https://evangadi-forum-4jb0.onrender.com/api`,
});
