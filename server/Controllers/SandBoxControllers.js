const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { exec } = require("child_process");
const getPort = require("get-port"); // Fetch a free port dynamically

const SAND_BOX_PATH = path.resolve(__dirname, "../../sandbox");

async function handleSocketConnection(socket) {
  const { token } = socket.handshake.auth;

  if (!token) {
    socket.disconnect(true);
    return;
  }

  // Authenticate user and extract email from token
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

    // Ensure the user's folder and project folder exist
    fs.mkdirSync(projectPath, { recursive: true });

    // Get a free port for the Docker container
    const port = await getPort();

    // Sanitize the email to create a valid Docker container name
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9_.-]/g, "-");
    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9_.-]/g, "-");
    const containerName = `sandbox-${sanitizedEmail}-${sanitizedProjectName}`;

    // Check if the container already exists and remove it if necessary
    exec(`docker ps -a -q --filter "name=${containerName}"`, (err, stdout, stderr) => {
      if (err) {
        console.error("Error checking existing container:", err);
        socket.emit("sandbox-error", { message: "Failed to check existing containers." });
        return;
      }

      if (stdout) {
        // If container exists, stop and remove it
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
        // If no container exists with that name, start a new one
        startNewContainer(containerName, port, projectPath);
      }
    });

    // Function to start a new Docker container
    function startNewContainer(containerName, port, projectPath) {
      // Command to run the Code-Server (VSCode) inside Docker with no authentication
      const command = `docker run -d -p $ {port}:8443 -v ${projectPath}:/workspace --name ${containerName} -e CODE_SERVER_AUTH=none -e SUDO_PASSWORD=user linuxserver/code-server`;
      
    
      console.log(`Running command: ${command}`);

      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error("Error starting Docker container:", err);
          console.error("stderr:", stderr);
          socket.emit("sandbox-error", { message: "Failed to start the sandbox." });
        } else {
          console.log("Docker container started successfully:", stdout);
          // Send the URL to the frontend
          const codeServerUrl = `http://localhost:${port}`;
          socket.emit("sandbox-started", { containerName, port, codeServerUrl });
        }
      });
    }

    // Stream outputs (optional, for long-running processes)
    socket.on("run-command", (command) => {
      exec(command, { cwd: projectPath }, (err, stdout, stderr) => {
        socket.emit("sandbox-output", { stdout, stderr });
      });
    });
  }); 

  // Clean up on disconnect
  socket.on("leave-sandbox", ({ projectName }) => {
    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9_.-]/g, "-"); // Sanitize the project name
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
