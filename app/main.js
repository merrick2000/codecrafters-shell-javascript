const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execFile } = require("child_process");  // Import execFile to run external commands

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const builtins = ["echo", "exit", "type"];

function prompt() {
  rl.question("$ ", (input) => {
    handleCommand(input.trim());
  });
}

function handleCommand(input) {
  if (input === "exit 0") {
    exitShell(0);
  } else if (input.startsWith("echo ")) {
    handleEcho(input);
  } else if (input === "echo") {
    handleEcho(input);
  } else if (input.startsWith("type ")) {
    handleType(input);
  } else if (input === "type") {
    console.log("type: not found");
    prompt();
  } else {
    // If it's not a builtin command, try running as an external command
    runExternalCommand(input);
  }
}

function handleEcho(input) {
  const message = input.slice(5); // Remove "echo "
  console.log(message);
  prompt();
}

function handleType(input) {
  const args = input.split(" ").slice(1);
  const cmd = args[0];

  if (!cmd) {
    console.log("type: not found");
    prompt();
    return;
  }

  if (builtins.includes(cmd)) {
    console.log(`${cmd} is a shell builtin`);
    prompt();
    return;
  }

  // Search for the executable in PATH 🔍
  const pathDirs = process.env.PATH ? process.env.PATH.split(":") : [];
  let found = false;

  // Loop through all directories in PATH
  for (const dir of pathDirs) {
    const fullPath = path.join(dir, cmd); // Create the full path

    if (fs.existsSync(fullPath)) {
      // Check if it's a file
      if (isExecutable(fullPath)) {
        console.log(`${cmd} is ${fullPath}`);
        found = true;
        break; // Stop once we find the file
      }
    }
  }

  if (!found) {
    console.log(`${cmd}: not found`);
  }

  prompt();
}

function isExecutable(filePath) {
  // Handle different OS-specific checks
  if (process.platform === "win32") {
    // On Windows, check if the file ends with .exe, .bat, or .cmd
    return /\.(exe|bat|cmd)$/i.test(filePath);
  } else {
    // On Linux/macOS, check for execute permissions
    try {
      fs.accessSync(filePath, fs.constants.X_OK); // Check if it's executable
      return true;
    } catch (err) {
      return false;
    }
  }
}

function runExternalCommand(input) {
  const args = input.split(" ");
  const command = args[0];
  const commandArgs = args.slice(1);

  // Search for the executable in PATH
  const pathDirs = process.env.PATH ? process.env.PATH.split(":") : [];
  let found = false;

  for (const dir of pathDirs) {
    const fullPath = path.join(dir, command);

    if (fs.existsSync(fullPath) && isExecutable(fullPath)) {
      // Execute the found external command
      execFile(fullPath, commandArgs, (err, stdout, stderr) => {
        if (err) {
          console.log(`${command}: command execution failed`);
        } else {
          console.log(stdout);  // Print the output from the external command
        }
        prompt();
      });
      found = true;
      break; // Exit once we find the executable
    }
  }

  if (!found) {
    console.log(`${command}: not found`);
    prompt();
  }
}

function unknownCommand(input) {
  console.log(`${input}: command not found`);
  prompt();
}

function exitShell(code) {
  rl.close();
  process.exit(code);
}

rl.on('SIGINT', () => {
  exitShell(0);
});

prompt();
