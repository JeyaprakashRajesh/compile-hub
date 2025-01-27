const fs = require("fs");
const path = require("path");
const User = require("../models/UserModel");
const { exec } = require("child_process");

// Function to create a new sandbox (project)
async function createSandbox(req, res) {
  const { projectName } = req.body;
  const email = req.decoded_data.email;

  try {
    if (!projectName) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const baseDir = path.join(__dirname, "../sandboxes");
    const sanitizedEmail = email.replace(/[@.]/g, "_");
    const userDir = path.join(baseDir, sanitizedEmail);
    const projectDir = path.join(userDir, projectName);

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir);
    }

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir);
    }

    if (fs.existsSync(projectDir)) {
      return res.status(400).json({ message: "Project already exists" });
    }

    fs.mkdirSync(projectDir);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $push: {
          sandboxes: {
            projectName,
            creationDate: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({
      message: "Sandbox created successfully",
      projectDir,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error creating sandbox:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Function to retrieve sandbox details
async function getSandbox(req, res) {
  console.log("Query params received:", req.query);
  const { projectName } = req.query; // Extract projectName from query
  const email = req.decoded_data.email; // Get email from token

  try {
    if (!projectName) {
      return res.status(400).json({ message: "Project name is required." });
    }

    const sanitizedEmail = email.replace(/[@.]/g, "_");
    const containerName = `${sanitizedEmail}_${projectName}`;
    const projectDir = path.join(__dirname, "../sandboxes", sanitizedEmail, projectName);

    if (!fs.existsSync(projectDir)) {
      return res.status(404).json({ message: "Project directory does not exist." });
    }

    // Check if the Docker container is already running
    exec(`docker ps -a --filter "name=${containerName}" --format "{{.Names}}"`, (err, stdout) => {
      if (err) {
        console.error("Error checking Docker containers:", err);
        return res.status(500).json({ message: "Error checking Docker containers." });
      }

      const existingContainerName = stdout.trim();

      if (existingContainerName) {
        // Container exists, stop and remove the container first
        exec(`docker ps -a --filter "name=${containerName}" --format "{{.Names}}" | grep ${containerName}`, (checkErr, checkStdout) => {
          if (checkErr) {
            console.error("Error checking if container exists:", checkErr);
            return res.status(500).json({ message: "Error checking if container exists." });
          }

          if (checkStdout.trim() === containerName) {
            // Only proceed to stop and remove if container exists
            exec(`docker stop ${existingContainerName} && docker rm ${existingContainerName}`, (removeErr, removeStdout) => {
              if (removeErr) {
                console.error("Error removing existing container:", removeErr);
                return res.status(500).json({ message: "Error removing existing container." });
              }

              console.log("Removed existing container:", removeStdout);

              // Proceed to start the new container
              setTimeout(() => {
                startContainer(containerName, projectDir, res);
              }, 2000);  // 2-second delay to ensure the container is fully removed
            });
          } else {
            console.log("Container not found, proceeding to start a new one.");
            startContainer(containerName, projectDir, res);
          }
        });
      } else {
        // No existing container, start it
        startContainer(containerName, projectDir, res);
      }
    });
  } catch (error) {
    console.error("Error retrieving sandbox details:", error);
    res.status(500).json({ message: "Server error." });
  }
}

// Function to start a new container (or restart it if removed)
async function startContainer(containerName, projectDir, res) {
  try {
    // Dynamically import get-port package
    const { default: getPort } = await import('get-port'); // Destructure the default export

    // Dynamically get a free port using get-port
    const port8080 = await getPort();
    const port3000 = await getPort();

    exec(
      `docker run -d --name ${containerName} -v ${projectDir}:/workspace -p ${port8080}:8080 -p ${port3000}:3000 sandbox-image`,
      (runErr, runStdout) => {
        if (runErr) {
          console.error("Error starting Docker container:", runErr);
          return res.status(500).json({ message: "Error starting Docker container." });
        }

        exec(`docker port ${containerName}`, (portErr, portStdout) => {
          if (portErr) {
            console.error("Error fetching dynamic ports:", portErr);
            return res.status(500).json({ message: "Error fetching dynamic ports." });
          }

          const ports = portStdout.split("\n").reduce((acc, line) => {
            const [containerPort, hostPort] = line.split("->");
            if (containerPort) {
              acc[containerPort.trim()] = hostPort.trim().split(":")[1];
            }
            return acc;
          }, {});

          return res.status(200).json({
            message: "Sandbox started successfully.",
            containerName,
            ports: ports,  // Send back dynamically assigned ports
            files: fs.readdirSync(projectDir),
            terminal: `http://localhost:${ports["3000"]}/${containerName}/terminal`,
          });
        });
      }
    );
  } catch (err) {
    console.error("Error fetching free port:", err);
    return res.status(500).json({ message: "Error fetching free port." });
  }
}

// Function to get user details
async function getUserDetails(req, res) {
  try {
    const email = req.decoded_data.email;
    const data = await User.findOne({ email: email });
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ message: "Server error." });
  }
}

// Function to update platforms (e.g., user credentials on external platforms)
async function updatePlatforms(req, res) {
  const { platform, username } = req.body;
  const email = req.decoded_data.email;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { [platform]: username },
      { new: true }
    );

    if (!updatedUser) return res.status(404).send("User not found");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating platform:", err);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getUserDetails,
  updatePlatforms,
  createSandbox,
  getSandbox,
};
