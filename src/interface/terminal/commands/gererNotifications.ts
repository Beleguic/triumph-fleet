// src/interface/commands/gererNotifications.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { GererNotificationsUseCase } from './../../../application/use-cases/GererNotificationsUseCase';
import { InMemoryNotificationRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryNotificationRepository';

export const gererNotificationsCLI = async () => {
  console.log(chalk.green('\n📩 Gestion des notifications\n'));

  // Instanciation du repository en mémoire
  const notificationRepo = new InMemoryNotificationRepository();
  const useCase = new GererNotificationsUseCase(notificationRepo);

  // Demander l’action à effectuer
  const actionReponse = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Que souhaitez-vous faire ?',
      choices: [
        'Consulter les notifications',
        'Marquer une notification comme lue',
        'Retour'
      ]
    }
  ]);

  if (actionReponse.action === 'Retour') return;

  // Si l'utilisateur veut consulter toutes les notifications
  if (actionReponse.action === 'Consulter les notifications') {
    const result = await useCase.consulterNotifications();
    
    if (result.notifications.length === 0) {
      console.log(chalk.yellow('📭 Aucune notification enregistrée.'));
    } else {
      console.log(chalk.green(`✅ ${result.notifications.length} notification(s) trouvée(s) :\n`));
      result.notifications.forEach((notification) => {
        console.log(
          chalk.blue(`🆔 ID : ${notification.id}`),
          chalk.yellow(`👤 Destinataire : ${notification.client.nom}`),
          chalk.magenta(`📩 Message : ${notification.message}`),
          chalk.cyan(`📅 Date : ${notification.dateNotification.toDateString()}`),
          notification.estLu ? chalk.gray(`✅ Lu`) : chalk.red(`❌ Non lu`)
        );
      });
    }
    return;
  }

  // Si l'utilisateur veut marquer une notification comme lue
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'notificationId',
      message: 'Entrez l\'ID de la notification à marquer comme lue :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    }
  ]);

  try {
    const result = await useCase.marquerNotificationCommeLue({ notificationId: parseInt(reponses.notificationId) });

    console.log(chalk.green(`✅ Notification ID ${result.id} marquée comme lue !`));
    console.log(chalk.blue(`📩 Message : ${result.message}`));
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${error.message}`));
  }
};
