
import axios from "axios";
const api = axios.create({
     baseURL: "http://localhost:5000/", // Your API base URL
    //baseURL: "/",
withCredentials: true, // Include credentials with requests
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  });
  export default api;
