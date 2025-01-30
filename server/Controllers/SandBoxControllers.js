const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { exec } = require("child_process");
const getPort = require("get-port");

const SAND_BOX_PATH = path.resolve(__dirname, "../../sandbox");

async function handleSocketConnection(socket) {
  const { token } = socket.handshake.auth;

  if (!token) {
    socket.disconnect(true);
    return;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) { 
    console.error("Token verification failed:", err);
    socket.disconnect(true);
    return;
  }
 
  const email = decodedToken.email;

  socket.on("join-sandbox", async ({ projectName }) => {
    const userPath = path.join(SAND_BOX_PATH, email);
    const projectPath = path.join(userPath, projectName);
    fs.mkdirSync(projectPath, { recursive: true });
    const port = await getPort();
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9_.-]/g, "-");
    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9_.-]/g, "-");
    const containerName = `sandbox-${sanitizedEmail}-${sanitizedProjectName}`;
    exec(`docker ps -a -q --filter "name=${containerName}"`, (err, stdout, stderr) => {
      if (err) {
        console.error("Error checking existing container:", err);
        socket.emit("sandbox-error", { message: "Failed to check existing containers." });
        return;
      }

      if (stdout) {
        exec(`docker rm -f ${containerName}`, (err) => {
          if (err) {
            console.error(`Error removing existing container ${containerName}:`, err);
            socket.emit("sandbox-error", { message: "Failed to remove the existing container." });
            return;
          }
          console.log(`Existing container ${containerName} removed.`);
          startNewContainer(containerName, port, projectPath);
        });
      } else {
        startNewContainer(containerName, port, projectPath);
      }
    });
    async function startNewContainer(containerName, port, projectPath) {
      console.log(`Resolved project path: ${projectPath}`);
      const port5173 = await getPort();
    
      const command = `docker run -d \
      -p ${port}:8443 \
      -p ${port5173}:5173 \
      -v ${projectPath}:/config/workspace \
      -v /home/jp/Desktop/github/compile-hub/sandbox/r.jeya2005@gmail.com/settings.json:/config/settings.json \
      --name ${containerName} \
      -e CODE_SERVER_AUTH=none \
      -e SUDO_PASSWORD=user \
      code-sandbox`;
    
      console.log(`Running command: ${command}`);
    
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error("Error starting Docker container:", err);
          console.error("stderr:", stderr);
          socket.emit("sandbox-error", { message: "Failed to start the sandbox." });
        } else {
          console.log("Docker container started successfully:", stdout);
          const codeServerUrl = `http://localhost:${port}`;
          const devServerUrl = `http://localhost:${port5173}`; 
    
          socket.emit("sandbox-started", {
            containerName,
            port,
            codeServerUrl,
            port5173,
            devServerUrl, 
          });
        }
      });
    }
    

  }); 

  socket.on("leave-sandbox", (payload) => {
    console.log("leave-sandbox") 
    if (!payload || !payload.projectName) {
      console.error("Error: 'projectName' is missing in 'leave-sandbox' event.");
      return;
    } 
  
    const { projectName } = payload;
    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9_.-]/g, "-"); 
    const containerName = `sandbox-${email}-${sanitizedProjectName}`;
    
    exec(`docker rm -f ${containerName}`, (err) => {
      if (err) {
        console.error(`Error stopping Docker container ${containerName}:`, err);
      } else {
        console.log(`Docker container ${containerName} stopped and removed.`);
      }
    });
  });
  
}

module.exports = { handleSocketConnection };
