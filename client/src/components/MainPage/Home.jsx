import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function Home(props) {
  const navigate = useNavigate()

  const tasks = [
    { name: "permutation", status: "incomplete", language: "c" },
    { name: "combination", status: "incomplete", language: "c" },
    { name: "longest subarray", status: "complete", language: "java" },
    { name: "unique path", status: "complete", language: "java" },
  ];
  const languages = [
    "python",
    "javascript",
    "java",
    "c",
    "cpp",
    "php",
    "ruby",
    "shell",
    "go",
    "rust",
    "kotlin",
    "dart",
  ];
  const images = {
    python: "/src/assets/images/python.png",
    javascript: "/src/assets/images/javascript.png",
    java: "/src/assets/images/java.png",
    c: "/src/assets/images/c.png",
    cpp: "/src/assets/images/cpp.png",
    php: "/src/assets/images/php.png",
    ruby: "/src/assets/images/ruby.png",
    shell: "/src/assets/images/shell.png",
    go: "/src/assets/images/go.png",
    rust: "/src/assets/images/rust.png",
    kotlin: "/src/assets/images/kotlin.png",
    dart: "/src/assets/images/dart.png",
  };

  const solvedTasks = tasks.filter((task) => task.status === "complete").length;
  const totalTasks = tasks.length;
  const remainingTasks = totalTasks - solvedTasks;
  const progressPercentage = (solvedTasks / totalTasks) * 100;


  const handleLanguagePress = (language) => {
    navigate(`/compiler/?language=${language}`);
  }
  return (
    <div className="home-content-container">
      <div className="home-content-left-container">
        <div className="home-content-heading-container">
          <div>COMPILE HUB</div>

          <div className="home-content-heading-user">
            Hello {props.userData?.username || "Ajalesh B"} 👋
          </div>

          <div className="home-content-heading-quote">
            Learn to <span style={{ color: "var(--gray)" }}>Play</span> with{" "}
            <span style={{ color: "var(--red)" }}>Code</span>
          </div>
        </div>
        <div className="home-content-languages-container">
          <div className="home-content-languages-inner-container">
            {languages.map((language, index) => (
              <button
              key={index}
              className="home-content-element-container"
              onClick={() => handleLanguagePress(language)} // Corrected here
            >
              <img
                src={images[language]}
                alt={language}
                style={{
                  width:
                    language === "cpp" || language === "php" || language === "go"
                      ? "42%"
                      : "37%",
                }}
              />
            </button>
            
            ))}
          </div>
        </div>
      </div>
      <div className="home-content-right-container">
        <div className="home-content-right-tasks-container">
          <div className="home-content-right-tasks-element">
            <div className="home-content-right-tasks-heading">TASKS</div>
            <div className="home-content-right-tasks-content-container">
              {tasks.map((task, index) => {
                return (
                  <div
                    className="home-content-right-tasks-content-element-container"
                    key={index}
                  >
                    <div className="home-content-right-tasks-content-element-status-container">
                      <div
                        style={{
                          backgroundColor:
                            task.status === "incomplete"
                              ? "var(--red)"
                              : "lightgreen",
                        }}
                      ></div>
                    </div>
                    <div className="home-content-right-tasks-content-element-name-container">
                      {task.name}
                    </div>
                    <div
                      className="home-content-right-tasks-content-element-language-container"
                      style={{
                        backgroundImage: `url(${images[task.language]})`,
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="home-content-right-tasks-element">
            <div className="home-content-right-tasks-progress-container">
              <div className="home-content-right-tasks-progress-content">
                <div className="home-content-right-tasks-progress-content-heading">
                  PROGRESS
                </div>
                <div className="home-content-right-tasks-progress-content-element">
                  Solved: {solvedTasks}
                </div>
                <div className="home-content-right-tasks-progress-content-element">
                  Remaining: {remainingTasks}
                </div>
              </div>
              <div className="home-content-right-tasks-progress-bar-container">
                <CircularProgressbar
                  value={progressPercentage}
                  text={`${Math.round(progressPercentage)}%`}
                  styles={buildStyles({
                    textSize: "15px",
                    pathColor: "lightgreen",
                    textColor: "var(--black)",
                    fontFamily: "Lexend Zetta",
                    trailColor: "var(--red)",
                    strokeLinecap: "butt",
                  })}
                  strokeWidth={15}
                />
              </div>
            </div>
            <div className="home-content-right-tasks-calender-container"></div>
          </div>
        </div>
        <div className="home-content-right-sandbox-container">
          <div className="home-content-right-sanbox-heading">SANDBOXES</div>
          <div className="home-content-right-sandbox-content-container">
            <div className="home-content-right-sandbox-content-add">
              <div className="home-content-right-sandbox-content-add-plus">
                +
              </div>
              <div>Add</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
