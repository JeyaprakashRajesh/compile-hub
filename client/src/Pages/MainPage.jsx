import { useEffect, useState } from "react";
import "../styles/MainPage.css";
import axios from "axios";
import { BACKEND_URI } from "../utils/connectivity";
import { useNavigate } from "react-router-dom"
import Navbar from "../components/MainPage/Navbar";
import Home from "../components/MainPage/Home";
import Task from "../components/MainPage/Task";
import { FourSquare } from "react-loading-indicators"

export default function MainPage() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState("home")
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await axios.get(`${BACKEND_URI}/api/user/getuserdata`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(response.data);
        console.log("User data: ", response.data);
        setLoading(false)
      } catch (err) {
        console.error("Error fetching user data: ", err);
        localStorage.removeItem("token")
      }
    }
    fetchData();
  }, []);
  if (loading) {  
    return (
      <div className="main-loading-container">
        <FourSquare color="var(--red)" size="medium" text="" textColor="" />
      </div>
    )
  }
  return (
    <div className="home-container">
      <Navbar page={page} setPage={setPage} />
      {page === "home" ?
        <Home page={page} setPage={setPage} userData={userData} setUserData={setUserData} />
        :
        <Task />
      }

    </div>
  );
}
