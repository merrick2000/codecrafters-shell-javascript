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
    if (answer.trim() === "exit") {
      rl.close();
      return;
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
});
