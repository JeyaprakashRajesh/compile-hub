import { useEffect, useState } from "react";
import Header from "../components/MainPage/Header";
import "../styles/MainPage.css";
import axios from "axios";
import { BACKEND_URI } from "../utils/connectivity";

export default function MainPage() {
  const [userData, setUserData] = useState({});

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
      }
    }
    fetchData();
  }, []);

  return (
    <div className="home-container">
      <Header userData={userData} />
    </div>
  );
}
