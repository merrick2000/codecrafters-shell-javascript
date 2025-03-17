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
