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
        // Use GET request with a token in the headers
        const response = await axios.get(`${BACKEND_URI}/api/user/getUserData`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass token in Authorization header
          },
        });
        setUserData(response.data); // Store fetched data in state
      } catch (err) {
        console.error("Error fetching user data: ", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="home-container">
      <Header />
      <div className="user-details">
        <h2>User Details</h2>
        {userData ? (
          <div>
            <p>Email: {userData.email}</p>
            <p>Name: {userData.name}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
}
