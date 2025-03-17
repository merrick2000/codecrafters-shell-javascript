const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Main prompt loop
function prompt() {
  rl.question("$ ", (input) => {
    handleCommand(input.trim());
  });
}

// List of builtin commands
const builtins = ["echo", "exit", "type"];

// Command router
function handleCommand(input) {
  if (input === "exit 0") {
    exitShell(0);
  } else if (input.startsWith("echo ")) {
    handleEcho(input);
  } else if (input === "echo") {
    // handle "echo" with no args
    console.log("");
    prompt();
  }  else if (input.startsWith("type ")) {
    handleType(input);
  } else if (input === "type") {
    // handle "type" with no args
    console.log("type: not found");
    prompt();
  } else {
    unknownCommand(input);
  }
}

// Echo handler
function handleEcho(input) {
  const message = input.slice(5); // Remove "echo "
  console.log(message);
  prompt();
}

function handleType(input) {
  const args = input.split(" ").slice(1); // Extract argument(s) after "type"

  const cmd = args[0];

  if (!cmd) {
    console.log("type: not found");
  } else if (builtins.includes(cmd)) {
    console.log(`${cmd} is a shell builtin`);
  } else {
    console.log(`${cmd}: not found`);
  }

  prompt();
}

// Unknown command handler
function unknownCommand(input) {
  console.log(`${input}: command not found`);
  prompt();
}

// Exit handler
function exitShell(code) {
  rl.close();
  process.exit(code);
}

// Catch Ctrl+C
rl.on('SIGINT', () => {
  exitShell(0);
});

// Start the REPL
prompt();
