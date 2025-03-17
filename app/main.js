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
    // On reboucle pour attendre la prochaine commande
    prompt();
  });
}

// Démarrer la boucle REPL
prompt();

// Gérer Ctrl+C proprement
rl.on('SIGINT', () => {
  rl.close();
});
