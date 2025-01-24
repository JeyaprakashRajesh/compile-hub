import { useEffect, useState } from "react";  
import "../styles/MainPage.css";
import axios from "axios";
import { BACKEND_URI } from "../utils/connectivity";
import { useNavigate } from "react-router-dom"
import Navbar from "../components/MainPage/Navbar";
import Home from "../components/MainPage/Home";

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
      } catch (err) {
        console.error("Error fetching user data: ", err);
        localStorage.removeItem("token")
        // navigate("/auth")
      }
    }
    fetchData();
  }, []);

  return (
    <div className="home-container">
      <Navbar page={page} setPage={setPage} />
      <Home page={page} setPage={setPage} userData={userData}/>
    </div>
  );
}
