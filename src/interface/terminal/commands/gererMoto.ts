// src/interface/commands/gererMoto.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { gererMotoUseCase } from '../../../infrastructure/factories/GererMotoFactory';
import { modeleMotoRepository } from '../../../infrastructure/factories/GererModeleMotoFactory';
import { clientRepository } from '../../../infrastructure/factories/GererClientFactory';

export const gererMotoCLI = async () => {
  console.log(chalk.green('\n🏍️ Gestion des motos\n'));

  // Demander l’action à effectuer
  const actionReponse = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Que souhaitez-vous faire ?',
      choices: [
        'Créer une moto',
        'Modifier une moto',
        'Supprimer une moto',
        'Consulter toutes les motos',
        'Retour'
      ]
    }
  ]);

  if (actionReponse.action === 'Retour') return;

  // ✅ Consulter toutes les motos
  if (actionReponse.action === 'Consulter toutes les motos') {
    const motos = await gererMotoUseCase.getAllMotos();
    if (motos.length === 0) {
      console.log(chalk.yellow('📭 Aucune moto enregistrée.'));
    } else {
      console.log(chalk.green(`✅ ${motos.length} moto(s) trouvée(s) :\n`));
      motos.forEach((moto) => {
        console.log(
          chalk.blue(`🆔 ID : ${moto.id}`),
          chalk.yellow(`🏍️ Modèle : ${moto.modele.nom}`),
          chalk.magenta(`🔢 Numéro de série : ${moto.numeroSerie}`),
          chalk.cyan(`📅 Date d'achat : ${moto.dateAchat.toDateString()}`),
          chalk.gray(`⚙️ Kilométrage : ${moto.kilometrageActuel} km`),
          chalk.red(`📋 Statut : ${moto.statut}`),
          moto.client ? chalk.green(`👤 Client : ${moto.client.nom}`) : chalk.gray('👤 Aucun client associé')
        );
      });
    }
    return;
  }

  // ✅ Supprimer une moto
  if (actionReponse.action === 'Supprimer une moto') {
    const reponse = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Entrez l\'ID de la moto à supprimer :',
        validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0)
          ? true
          : 'Veuillez entrer un identifiant numérique valide.'
      }
    ]);

    try {
      const success = await gererMotoUseCase.deleteMoto(parseInt(reponse.id));
      if (success) {
        console.log(chalk.green(`✅ Moto ID ${reponse.id} supprimée avec succès.`));
      } else {
        console.log(chalk.red(`❌ Impossible de supprimer la moto ID ${reponse.id}.`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
    }
    return;
  }

  // ✅ Créer ou modifier une moto
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Entrez l\'ID de la moto (laisser vide pour créer une nouvelle) :',
      when: () => actionReponse.action === 'Modifier une moto'
    },
    {
      type: 'input',
      name: 'modeleId',
      message: 'Entrez l\'ID du modèle de moto :',
      validate: async (input) => {
        const id = parseInt(input);
        if (isNaN(id) || id <= 0) return 'Veuillez entrer un identifiant numérique valide.';
        const modele = await modeleMotoRepository.findById(id);
        return modele ? true : `Modèle avec l'ID ${id} non trouvé.`;
      }
    },
    {
      type: 'input',
      name: 'clientId',
      message: 'Entrez l\'ID du client associé :',
      validate: async (input) => {
        const id = parseInt(input);
        if (isNaN(id) || id <= 0) return 'Veuillez entrer un identifiant numérique valide.';
        const client = await clientRepository.findById(id);
        return client ? true : `Client avec l'ID ${id} non trouvé.`;
      }
    },
    {
      type: 'input',
      name: 'numeroSerie',
      message: 'Entrez le numéro de série de la moto :',
      validate: (input) => input.length > 0 ? true : 'Le numéro de série ne peut pas être vide.'
    },
    {
      type: 'input',
      name: 'kilometrageActuel',
      message: 'Entrez le kilométrage actuel :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) >= 0) 
        ? true 
        : 'Veuillez entrer un kilométrage valide (nombre positif).'
    },
    {
      type: 'input',
      name: 'dateAchat',
      message: 'Entrez la date d\'achat de la moto (YYYY-MM-DD) :',
      validate: (input) => !isNaN(Date.parse(input)) 
        ? true 
        : 'Veuillez entrer une date valide au format YYYY-MM-DD.'
    },
    {
      type: 'list',
      name: 'statut',
      message: 'Sélectionnez le statut de la moto :',
      choices: ['Disponible', 'En entretien', 'Louée', 'Vendue']
    }
  ]);

  try {
    // Récupérer les instances complètes de `ModeleMoto` et `Client`
    const modele = await modeleMotoRepository.findById(parseInt(reponses.modeleId));
    const client = await clientRepository.findById(parseInt(reponses.clientId));

    if (!modele || !client) {
      throw new Error('Impossible de récupérer le modèle ou le client.');
    }

    const result = await gererMotoUseCase.execute({
      id: reponses.id ? parseInt(reponses.id) : undefined,
      modele: modele,
      client: client,
      numeroSerie: reponses.numeroSerie,
      kilometrageActuel: parseInt(reponses.kilometrageActuel),
      dateAchat: new Date(reponses.dateAchat),
      statut: reponses.statut
    });

    console.log(chalk.green(`✅ Moto ${actionReponse.action === 'Modifier une moto' ? 'modifiée' : 'créée'} avec succès !`));
    console.log(chalk.blue(`🆔 ID : ${result.id}`));
    console.log(chalk.yellow(`🏍️ Modèle : ${result.modele.nom}`));
    console.log(chalk.magenta(`🔢 Numéro de série : ${result.numeroSerie}`));
    console.log(chalk.cyan(`📅 Date d'achat : ${result.dateAchat.toDateString()}`));
    console.log(chalk.gray(`⚙️ Kilométrage : ${result.kilometrageActuel} km`));
    console.log(chalk.red(`📋 Statut : ${result.statut}`));
    console.log(
      result.client 
        ? chalk.green(`👤 Client : ${result.client.nom}`) 
        : chalk.gray('👤 Aucun client associé')
    );
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
