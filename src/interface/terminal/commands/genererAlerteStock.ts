// src/interface/commands/genererAlerteStock.ts

import chalk from 'chalk';
import { genererAlerteStockBasUseCase } from '../../../infrastructure/factories/GenererAlerteStockBasFactory';

export const genererAlerteStockCLI = async () => {
  console.log(chalk.green('\n🚨 Vérification des niveaux de stock en cours...\n'));

  try {
    // Exécuter le use case pour générer les alertes
    const result = await genererAlerteStockBasUseCase.execute();

    if (result.notifications.length === 0) {
      console.log(chalk.yellow('✅ Aucun stock critique détecté. Aucune alerte générée.'));
    } else {
      console.log(chalk.red(`🚨 ${result.notifications.length} alertes de stock bas générées !`));
      result.notifications.forEach(notification => {
        console.log(
          chalk.blue(`📦 Pièce concernée : ${notification.message}`),
          chalk.magenta(`📩 Notification envoyée à : ${notification.client.nom}`)
        );
      });
    }
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
