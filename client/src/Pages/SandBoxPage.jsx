import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import "../styles/Sandbox.css"
import logo from "../assets/images/logo.png"
import {FourSquare} from "react-loading-indicators"

export default function SandBoxPage() {
  const [searchParams] = useSearchParams()
  const projectName = searchParams.get("projectName")
  const token = localStorage.getItem("token")
  const [islaunch , setLaunch] = useState(false)
  const [codeServerUrl, setCodeServerUrl] = useState("")
  const [devServerUrl , setDevServerUrl] = useState("")

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      auth: { token },
    });
  
    socket.emit("join-sandbox", { projectName });
  
    socket.on("sandbox-started", (data) => {
      console.log("Container started:", data);
      setCodeServerUrl(data.codeServerUrl);
      setDevServerUrl(data.devServerUrl)
    });
  
    socket.on("sandbox-output", (data) => {
      console.log("Output:", data); 
    });
  
    return () => {
      socket.emit("leave-sandbox", { projectName });
      socket.disconnect();
    };
  }, [projectName, token]);
  
  const handleViewOutput = () => {
    window.open(devServerUrl)
  }
  return (
    <div className="sandbox-container">
      <div className="sandbox-heading-container">
        <div className="sandbox-heading-content-container">
          <img src={logo}></img>
          
          <span>COMPILE HUB</span>
        </div>
        <div className="sandbox-heading-heading">
          sandbox
        </div>
        <div className="sandbox-heading-extras-container">
          <button onClick={handleViewOutput}>
            VIEW OUTPUT
          </button>
        </div>
        
      </div>
      {codeServerUrl ? (
        !islaunch ? 
        
        <div className="sandbox-content-container">
          <div>Click To Start Your Container 🚀</div>
          <button onClick={() => {setLaunch(true)}}>launch</button>
        </div>
        : 
        <iframe 
          src={codeServerUrl}
          width="100%"
          height="92%"
          title="Code Editor"
        />
        
      ) : (
        <div className="sandbox-loading-container">
          <div>initializing your container</div>
          <FourSquare color="var(--red)" size="medium" text="" textColor="" />  
        </div>
      )}
    </div>
  ); 
}
