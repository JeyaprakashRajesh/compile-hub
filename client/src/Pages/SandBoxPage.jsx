import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../styles/Sandbox.css"
import Monoco from "../components/Compiler/Monoco";
import logo from "../assets/images/logo.png"


export default function SandBoxPage() {
  const [sandboxData, setSandboxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams()
  const theme = "dark";
  const [code , setCode] = useState("")
  const [language , setLanguage] = useState("")
  const [isAnyFileSelected , setAnyFileSelected] = useState(false)

  useEffect(() => {
    const fetchSandboxDetails = async () => {
      try {
        
        const projectName = searchParams.get("projectName")

        if (!projectName) {
          alert("Project name is missing in the URL.");
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          alert("You must be logged in.");
          setLoading(false);
          return;
        }

        console.log("Sending projectName as query param:", projectName);

        const response = await axios.get(
          `http://localhost:3000/api/user/getsandbox?projectName=${encodeURIComponent(projectName)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSandboxData(response.data);
      } catch (err) {
        console.error("Error fetching sandbox details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSandboxDetails();
  }, [searchParams]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!sandboxData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sandbox-container">
      <div className="sandbox-heading-container">
        <img src={logo} alt="" />
        <span>COMPILE HUB</span>
      </div>
      <PanelGroup className="sandbox-panel-group" direction="horizontal" style={{height : "90%"}}>
  <Panel className="sandbox-file-container" minSize={12} defaultSize={12}>
  </Panel>
  <PanelResizeHandle />
  <Panel >
    <PanelGroup style={{ height : "100%" , width : "100%"}} direction="vertical" >
      <Panel defaultSize={70} >
        <PanelGroup direction="horizontal" style={{height : "100%" , width : "100%"}}>
          <Panel className="sandbox-code-container">
            <Monoco theme={theme} code={code} setCode={code} />
          </Panel>
          <PanelResizeHandle />
          <Panel className="sandbox-preview-container">

          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle />
      <Panel minSize={5} defaultSize={15} className="sandbox-terminal-container">
        awdda
      </Panel>
    </PanelGroup>
  </Panel>
</PanelGroup>

    </div>
  );
}
