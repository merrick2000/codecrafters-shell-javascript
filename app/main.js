const fs = require("fs");
const path = require("path");
const readline = require("readline");

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
    unknownCommand(input);
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

  // NOW we search in PATH 🔍
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
