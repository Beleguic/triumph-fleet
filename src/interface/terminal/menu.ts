// src/interface/menu.ts

import inquirer from 'inquirer';
import chalk from 'chalk';

// Importation des commandes CLI
import { planifierEntretienCLI } from './commands/planifierEntretien';
import { envoyerRappelEntretienCLI } from './commands/envoyerRappelEntretien';
import { enregistrerEntretienCLI } from './commands/enregistrerEntretien';
import { enregistrerPanneCLI } from './commands/enregistrerPanne';
import { gererStockCLI } from './commands/gererStock';
import { genererAlerteStockCLI } from './commands/genererAlerteStock';
import { passerCommandePieceCLI } from './commands/passerCommandePiece';
import { consulterHistoriqueCommandesCLI } from './commands/consulterHistoriqueCommandes';
import { gererProfilConducteurCLI } from './commands/gererProfilConducteur';
import { planifierEssaiMotoCLI } from './commands/planifierEssaiMoto';
import { enregistrerEssaiMotoCLI } from './commands/enregistrerEssaiMoto';
import { enregistrerIncidentCLI } from './commands/enregistrerIncident';
import { gererNotificationsCLI } from './commands/gererNotifications';

export const afficherMenuPrincipal = async () => {
  const choix = await inquirer.prompt([
    {
      type: 'list',
      name: 'menuOption',
      message: chalk.blue('Que voulez-vous faire ?'),
      choices: [
        'Planifier un entretien',
        'Envoyer un rappel d’entretien',
        'Enregistrer un entretien réalisé',
        'Enregistrer une panne / garantie',
        'Gérer le stock de pièces détachées',
        'Générer une alerte de stock bas',
        'Passer une commande de pièces détachées',
        'Consulter l\'historique des commandes de pièces',
        'Gérer le profil des conducteurs',
        'Planifier un essai moto',
        'Enregistrer un essai moto',
        'Enregistrer un incident',
        'Gérer les notifications',
        'Quitter'
      ]
    }
  ]);

  switch (choix.menuOption) {
    case 'Planifier un entretien':
      await planifierEntretienCLI();
      break;
    case 'Envoyer un rappel d’entretien':
      await envoyerRappelEntretienCLI();
      break;
    case 'Enregistrer un entretien réalisé':
      await enregistrerEntretienCLI();
      break;
    case 'Enregistrer une panne / garantie':
      await enregistrerPanneCLI();
      break;
    case 'Gérer le stock de pièces détachées':
      await gererStockCLI();
      break;
    case 'Générer une alerte de stock bas':
      await genererAlerteStockCLI();
      break;
    case 'Passer une commande de pièces détachées':
      await passerCommandePieceCLI();
      break;
    case 'Consulter l\'historique des commandes de pièces':
      await consulterHistoriqueCommandesCLI();
      break;
    case 'Gérer le profil des conducteurs':
      await gererProfilConducteurCLI();
      break;
    case 'Planifier un essai moto':
      await planifierEssaiMotoCLI();
      break;
    case 'Enregistrer un essai moto':
      await enregistrerEssaiMotoCLI();
      break;
    case 'Enregistrer un incident':
      await enregistrerIncidentCLI();
      break;
    case 'Gérer les notifications':
      await gererNotificationsCLI();
      break;
    case 'Quitter':
      console.log(chalk.red('Fermeture de Triumph CLI...'));
      process.exit();
  }

  await afficherMenuPrincipal(); // Retour au menu après chaque action
};
