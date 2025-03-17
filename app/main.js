const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Uncomment this block to pass the first stage
// rl.question("$ ", (answer) => {
//   console.log(`${answer}: command not found`)
//   rl.close();
// });

function prompt() {
  rl.question("$ ", (answer) => {
    const exitCommand = answer.trim() === "exit" || answer.trim() === "exit 0"
    if (exitCommand) {
      rl.close();
      process.exit(0);
    }

    console.log(`${answer}: command not found`);
    prompt();
  });
}

// Run the REPL loop
prompt();

// Properly handle the Ctrl+C 
rl.on('SIGINT', () => {
  rl.close();
  process.exit(0);
});
