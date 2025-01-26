import { useSearchParams } from "react-router-dom";
import "../styles/Compiler.css";
import logo from "../assets/images/logo.png";
import play from "../assets/images/play.png";
import compilerExport from "../assets/images/compiler-export.png";
import Monoco from "../components/Compiler/Monoco";
import { useState } from "react";
import sun from "../assets/images/sun.png";
import moon from "../assets/images/moon.png";
import axios from "axios";
import { BACKEND_URI } from "../utils/connectivity";

export default function Compiler() {
  const [theme, setTheme] = useState("dark");
  const [searchParams] = useSearchParams();
  const language = searchParams.get("language");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/compile/execute`,
        {
          code,
          language,
        }
      );

      setOutput(response.data.output);
    } catch (error) {
      setOutput("Error: Could not execute the code.");
      console.error("Error executing code:", error);
    }
  };

  const formatOutput = (outputText) => {
    return outputText.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div
      className="compiler-container"
      style={{ backgroundColor: theme === "dark" ? "var(--black)" : null }}
    >
      <div
        className="compiler-left-container"
        style={{ backgroundColor: theme === "dark" ? "var(--gray)" : null }}
      >
        <img className="compiler-logo-container" src={logo}></img>
      </div>
      <div className="compiler-content-container">
        <div
          className="compiler-content-top-container"
          style={{ backgroundColor: theme === "dark" ? "var(--gray)" : null }}
        >
          <div>COMPILE HUB</div>
        </div>
        <div className="compiler-content-bottom-container">
          <div className="compiler-content-bottom-heading-container">
            <div
              className="compiler-content-bottom-heading-name"
              style={{ color: theme === "dark" ? "var(--lightRed)" : "black" }}
            >
              {language.toLocaleUpperCase()}{" "}
            </div>
            <div className="compiler-content-bottom-heading-run-container">
              <button onClick={runCode}>
                <img src={play} alt="" />
                <div>RUN</div>
              </button>
            </div>
            <div className="copiler-content-bottom-heading-additional-container">
              <button
                className="compiler-content-bottom-heading-additional-theme"
                onClick={() => {
                  theme === "dark" ? setTheme("light") : setTheme("dark");
                }}
              >
                <img src={theme === "dark" ? moon : sun} alt="theme" />
              </button>
              <button className="compiler-content-bottom-heading-additional-export">
                <img src={compilerExport} alt=""></img>
                <div>EXPORT</div>
              </button>
            </div>
          </div>
          <div className="compiler-content-bottom-content-container">
            <div className="compiler-content-bottom-content-monoco-container">
              <Monoco
                language={language}
                theme={theme}
                code={code}
                setCode={setCode}
              />
            </div>
            <div
              className="compiler-content-bottom-content-output-container"
              style={{
                backgroundColor:
                  theme === "dark" ? "var(--gray)" : "var(--lightRed)",
              }}
            >
              <div
                className="compiler-content-bottom-content-output-heading"
                style={{ color: theme === "dark" ? "white" : "var(--red)" }}
              >
                OUTPUT
              </div>
              <div
                className="compiler-content-bottom-content-output-content"
                style={{ color: theme === "dark" ? "white" : "black" }}
              >
                {formatOutput(output)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
