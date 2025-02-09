// src/interface/commands/genererAlerteStock.ts

import chalk from 'chalk';
import { GenererAlerteStockBasUseCase } from './../../../application/use-cases/GenererAlerteStockBasUseCase';
import { InMemoryStockRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryStockRepository';
import { InMemoryNotificationRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryNotificationRepository';

export const genererAlerteStockCLI = async () => {
  console.log(chalk.green('\n🚨 Vérification des niveaux de stock en cours...\n'));

  // Instanciation des repositories en mémoire
  const stockRepo = new InMemoryStockRepository();
  const notificationRepo = new InMemoryNotificationRepository();
  const useCase = new GenererAlerteStockBasUseCase(stockRepo, notificationRepo);

  try {
    // Exécuter le use case pour générer les alertes
    const result = await useCase.execute();

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
    console.log(chalk.red(`❌ Erreur: ${error.message}`));
  }
};
