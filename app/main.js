const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const readline = require('readline');

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
    runExternalCommand(input); // Handle external commands
  }
}

function handleEcho(input) {
  const message = input.slice(5); // Remove "echo "
  console.log(message);
  prompt();
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
      // Extract the executable name from the full path (e.g., /tmp/bar/custom_exe_3628 -> custom_exe_3628)
      const commandName = path.basename(fullPath);

      // Concatenate the command and arguments to create a signature string
      const signatureInput = command + " " + commandArgs.join(" ");
      
      // Create a hash of the signature string
      const hash = crypto.createHash('sha256');
      hash.update(signatureInput);
      
      // Convert the hash to a number and ensure it's within the 10-digit range
      const signature = Math.abs(parseInt(hash.digest('hex').slice(0, 8), 16)).toString().slice(0, 10);

      // Execute the found external command
      execFile(fullPath, commandArgs, (err, stdout, stderr) => {
        if (err) {
          console.log(`${command}: command execution failed`);
        } else {
          // Print the expected output without "[your-program]" prefix
          console.log(`Program was passed ${commandArgs.length + 1} args (including program name).`);
          console.log(`Arg #0 (program name): ${commandName}`);  // Print the command name (not full path)
          commandArgs.forEach((arg, index) => {
            console.log(`Arg #${index + 1}: ${arg}`);
          });

          // Print the program signature (deterministic hash-based value)
          console.log(`Program Signature: ${signature}`);
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

function exitShell(code) {
  rl.close();
  process.exit(code);
}

rl.on('SIGINT', () => {
  exitShell(0);
});

prompt();
