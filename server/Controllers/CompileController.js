const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const DOCKER_CONTAINER_ID = "26158250b085";

async function CompileCode(req, res) {
    console.log("compilecode")
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ output: "Code and language are required" });
  }

  const tempDir = path.join(__dirname, "..", "..", "temp");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filePath = path.join(tempDir, `code.${language}`);
  try {
    fs.writeFileSync(filePath, code);
  } catch (error) {
    return res.status(500).json({ output: "Error saving the code file" });
  }

  let command = "";
  let containerFilePath = `/tmp/code.${language}`;

  switch (language) {
    case "javascript":
    case "js":
      command = `node ${containerFilePath}`;
      break;
    default:
      return res.status(400).json({ output: "Unsupported language for this test" });
  }

  exec(
    `docker cp ${filePath} ${DOCKER_CONTAINER_ID}:${containerFilePath}`,
    (copyError, copyStdout, copyStderr) => {
      if (copyError) {
        console.error(`Error copying file: ${copyStderr}`);
        return res.status(500).json({ output: `Error copying file: ${copyStderr}` });
      }

      exec(
        `docker exec -i ${DOCKER_CONTAINER_ID} sh -c "${command}"`,
        (execError, execStdout, execStderr) => {
          if (execError) {
            console.error(`Error executing Java code: ${execError}`);
            console.error(`Stdout: ${execStdout}`);
            console.error(`Stderr: ${execStderr}`);
            return res.status(500).json({ output: `Error: ${execStderr || execStdout}` });
          }
      
          console.log('Java Output:', execStdout);
          return res.json({ output: execStdout });
        }
      );
      
    }
  );
}

module.exports = { CompileCode };
