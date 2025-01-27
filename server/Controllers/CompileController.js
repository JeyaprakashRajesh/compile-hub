const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const DOCKER_CONTAINER_ID = "26158250b085";

async function CompileCode(req, res) {
  console.log("compilecode");
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
  const containerFilePath = `/tmp/code.${language}`;
  const compiledFilePath = `/tmp/code.class`; // For Java specifically

  switch (language) {
    case "java":
      command = `javac ${containerFilePath} 2>&1 && java -cp /tmp code`;
      break;
    case "javascript":
    case "js":
      command = `node ${containerFilePath}`;
      break;
    case "python":
    case "python3":
      command = `python3 ${containerFilePath}`; // Use python3 to run Python scripts
      break;
    case "c":
      command = `gcc ${containerFilePath} -o /tmp/code.out 2>&1 && chmod +x /tmp/code.out && /tmp/code.out`;
      break;
    case "cpp":
      command = `g++ ${containerFilePath} -o /tmp/code.out 2>&1 && chmod +x /tmp/code.out && /tmp/code.out`;
      break;
    case "php":
      command = `php ${containerFilePath}`;
      break;
    case "ruby":
      command = `ruby ${containerFilePath}`;
      break;
    case "shell":
      command = `sh ${containerFilePath}`;
      break;
    case "go":
      command = `go run ${containerFilePath}`;
      break;
    case "rust":
      command = `rustc ${containerFilePath} -o /tmp/code && /tmp/code`;
      break;
    case "kotlin":
      command = `kotlinc ${containerFilePath} -include-runtime -d /tmp/code.jar && java -jar /tmp/code.jar`;
      break;
    case "dart":
      command = `dart ${containerFilePath}`;
      break;
    default:
      return res.status(400).json({ output: "Unsupported language" });
  }

  // Step 1: Copy the file into the container
  exec(
    `docker cp ${filePath} ${DOCKER_CONTAINER_ID}:${containerFilePath}`,
    (copyError, copyStdout, copyStderr) => {
      if (copyError) {
        console.error(`Error copying file: ${copyStderr}`);
        return res.status(200).json({ output: `Error copying file: ${copyStderr}` });
      }

      // Step 2: Compile and execute the code
      exec(
        `docker exec -i ${DOCKER_CONTAINER_ID} sh -c "${command}"`,
        (execError, execStdout, execStderr) => {
          if (execError) {
            console.error(`Compilation/Execution Error: ${execError}`);
            console.error(`Stdout: ${execStdout}`);
            console.error(`Stderr: ${execStderr}`);
            return res.status(200).json({
              output: execStderr || execStdout || "Unknown error occurred.",
            });
          }

          console.log("Execution Output:", execStdout);

          // Clean up: Remove the source file and compiled artifacts
          exec(
            `docker exec -i ${DOCKER_CONTAINER_ID} rm ${containerFilePath}`,
            () => {}
          );
          if (language === "java" || language === "c" || language === "cpp" || language === "rust" || language === "kotlin") {
            exec(`docker exec -i ${DOCKER_CONTAINER_ID} rm ${compiledFilePath}`, () => {});
          }

          return res.status(200).json({ output: execStdout });
        }
      );
    }
  );
}

module.exports = { CompileCode };
