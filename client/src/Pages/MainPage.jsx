import { useEffect, useState } from "react";  
import "../styles/MainPage.css";
import axios from "axios";
import { BACKEND_URI } from "../utils/connectivity";
import { useNavigate } from "react-router-dom"
import Navbar from "../components/MainPage/Navbar";
import Home from "../components/MainPage/Home";
import Task from "../components/MainPage/Task";

export default function MainPage() {
  const [userData, setUserData] = useState({});
  const [page,setPage] = useState("home")
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BACKEND_URI}/api/user/getuserdata`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });
        setUserData(response.data); 
        console.log("User data: ", response.data);
      } catch (err) {
        console.error("Error fetching user data: ", err);
        localStorage.removeItem("token")
      }
    }
    fetchData();
  }, []);

  return (
    <div className="home-container">
      <Navbar page={page} setPage={setPage} />
      {page === "home" ? 
      <Home page={page} setPage={setPage} userData={userData} setUserData={setUserData}/>
      : 
      <Task />
      }
      
    </div>
  );
}
