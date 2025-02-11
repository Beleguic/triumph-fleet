// src/interface/commands/gererClient.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { gererClientUseCase } from '../../../infrastructure/factories/GererClientFactory';

export const gererClientCLI = async () => {
  console.log(chalk.green('\n🏢 Gestion des clients\n'));

  // Demander l’action à effectuer
  const actionReponse = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Que souhaitez-vous faire ?',
      choices: [
        'Créer un client',
        'Modifier un client',
        'Supprimer un client',
        'Consulter tous les clients',
        'Retour'
      ]
    }
  ]);

  if (actionReponse.action === 'Retour') return;

  // ✅ Consulter tous les clients
  if (actionReponse.action === 'Consulter tous les clients') {
    const clients = await gererClientUseCase.getAllClients();
    if (clients.length === 0) {
      console.log(chalk.yellow('📭 Aucun client enregistré.'));
    } else {
      console.log(chalk.green(`✅ ${clients.length} client(s) trouvé(s) :\n`));
      clients.forEach((client) => {
        console.log(
          chalk.blue(`🆔 ID : ${client.id}`),
          chalk.yellow(`🏢 Nom : ${client.nom}`),
          chalk.magenta(`📌 Type : ${client.type}`),
          client.contactInfo ? chalk.cyan(`📩 Contact : ${client.contactInfo}`) : ''
        );
      });
    }
    return;
  }

  // ✅ Supprimer un client
  if (actionReponse.action === 'Supprimer un client') {
    const reponse = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Entrez l\'ID du client à supprimer :',
        validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0)
          ? true
          : 'Veuillez entrer un identifiant numérique valide.'
      }
    ]);

    try {
      const success = await gererClientUseCase.deleteClient(parseInt(reponse.id));
      if (success) {
        console.log(chalk.green(`✅ Client ID ${reponse.id} supprimé avec succès.`));
      } else {
        console.log(chalk.red(`❌ Impossible de supprimer le client ID ${reponse.id}.`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
    }
    return;
  }

  // ✅ Créer ou modifier un client
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Entrez l\'ID du client (laisser vide pour créer un nouveau) :',
      when: () => actionReponse.action === 'Modifier un client'
    },
    {
      type: 'input',
      name: 'nom',
      message: 'Entrez le nom du client :',
      validate: (input) => input.length > 0 ? true : 'Le nom ne peut pas être vide.'
    },
    {
      type: 'input',
      name: 'type',
      message: 'Entrez le type de client (ex: entreprise, concessionnaire) :',
      validate: (input) => input.length > 0 ? true : 'Le type de client ne peut pas être vide.'
    },
    {
      type: 'input',
      name: 'contactInfo',
      message: 'Entrez les informations de contact (optionnel) :'
    }
  ]);

  try {
    const result = await gererClientUseCase.execute({
      id: reponses.id ? parseInt(reponses.id) : undefined,
      nom: reponses.nom,
      type: reponses.type,
      contactInfo: reponses.contactInfo || undefined
    });

    console.log(chalk.green(`✅ Client ${actionReponse.action === 'Modifier un client' ? 'modifié' : 'créé'} avec succès !`));
    console.log(chalk.blue(`🆔 ID : ${result.client.id}`));
    console.log(chalk.yellow(`🏢 Nom : ${result.client.nom}`));
    console.log(chalk.magenta(`📌 Type : ${result.client.type}`));
    if (result.client.contactInfo) {
      console.log(chalk.cyan(`📩 Contact : ${result.client.contactInfo}`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
