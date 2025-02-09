// src/interface/cli.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import { afficherMenuPrincipal } from './menu';

// Fonction principale
const main = async () => {
  console.clear();
  console.log(
    chalk.green(figlet.textSync('Triumph CLI', { horizontalLayout: 'full' }))
  );

  await afficherMenuPrincipal();
};

// Exécution du programme
main();
