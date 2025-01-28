import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

export default function SandBoxPage() {
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get("projectName");
  const token = localStorage.getItem("token");

  const [codeServerUrl, setCodeServerUrl] = useState("");

  useEffect(() => {
    // Initialize socket connection
    const socket = io("http://localhost:3001", {
      auth: { token },
    });

    // Notify server about the project
    socket.emit("join-sandbox", { projectName });

    // Listen for the code server URL and display it
    socket.on("sandbox-started", (data) => {
      console.log("Container started:", data);
      console.log(data.codeServerUrl)
      setCodeServerUrl(data.codeServerUrl); // Set the code-server URL received from backend
    });

    // Listen for updates from the backend
    socket.on("sandbox-output", (data) => {
      console.log("Output:", data); // Handle this in your UI
    });

    // Cleanup on unmount
    return () => {
      socket.emit("leave-sandbox");
      socket.disconnect();
    };
  }, [projectName, token]);

  return (
    <div>
      <h2>Sandbox Environment: {projectName}</h2>
      {codeServerUrl ? (
        <iframe
          src={codeServerUrl}
          width="100%"
          height="800px"
          title="Code Editor"
        />
      ) : (
        <p>Loading the sandbox environment...</p>
      )}
    </div>
  );
}
