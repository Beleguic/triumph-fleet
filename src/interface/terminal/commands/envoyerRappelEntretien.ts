// src/interface/commands/envoyerRappelEntretien.ts

import chalk from 'chalk';
import { EnvoyerRappelEntretienUseCase } from '../../../application/use-cases/EnvoyerRappelEntretienUseCase';
import { InMemoryEntretienRepository } from '../../../infrastructure/adapters/database/in-memory/InMemoryEntretienRepository';
import { InMemoryNotificationRepository } from '../../../infrastructure/adapters/database/in-memory/InMemoryNotificationRepository';

export const envoyerRappelEntretienCLI = async () => {
  console.log(chalk.green('\n📢 Envoi des rappels d\'entretien en cours...\n'));

  // Instanciation des repositories en mémoire
  const entretienRepo = new InMemoryEntretienRepository();
  const notificationRepo = new InMemoryNotificationRepository();
  const useCase = new EnvoyerRappelEntretienUseCase(entretienRepo, notificationRepo);

  try {
    // Exécuter le use case pour générer les rappels d’entretien
    const result = await useCase.execute();

    if (result.notifications.length === 0) {
      console.log(chalk.yellow('🚨 Aucun entretien dû. Aucun rappel généré.'));
    } else {
      console.log(chalk.green(`✅ ${result.notifications.length} notifications de rappel envoyées !`));
      result.notifications.forEach(notification => {
        console.log(
          notification.entretien?.datePlanifiee
            ? chalk.blue(`📅 Entretien prévu : ${notification.entretien.datePlanifiee.toDateString()}`)
            : chalk.gray(`📅 Entretien prévu : Date inconnue`),
          chalk.yellow(`👤 Client : ${notification.client.nom}`),
          chalk.magenta(`📩 Message : ${notification.message}`)
        );
      });
    }
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
