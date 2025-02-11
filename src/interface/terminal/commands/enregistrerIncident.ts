// src/interface/commands/enregistrerIncident.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { enregistrerIncidentUseCase } from '../../../infrastructure/factories/EnregistrerIncidentFactory';

export const enregistrerIncidentCLI = async () => {
  console.log(chalk.green('\n⚠️ Enregistrement d\'un incident\n'));

  // Demander les informations nécessaires à l'utilisateur
  const reponses = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'associerEssai',
      message: 'L\'incident est-il lié à un essai moto ?'
    },
    {
      type: 'input',
      name: 'essaiId',
      message: 'Entrez l\'ID de l\'essai concerné :',
      when: (answers) => answers.associerEssai,
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'confirm',
      name: 'associerConducteur',
      message: 'L\'incident est-il lié à un conducteur ?'
    },
    {
      type: 'input',
      name: 'conducteurId',
      message: 'Entrez l\'ID du conducteur :',
      when: (answers) => answers.associerConducteur,
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'confirm',
      name: 'associerMoto',
      message: 'L\'incident est-il lié à une moto ?'
    },
    {
      type: 'input',
      name: 'motoId',
      message: 'Entrez l\'ID de la moto :',
      when: (answers) => answers.associerMoto,
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'input',
      name: 'dateIncident',
      message: 'Entrez la date de l\'incident (YYYY-MM-DD) :',
      validate: (input) => !isNaN(Date.parse(input)) ? true : 'Veuillez entrer une date valide au format YYYY-MM-DD.'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Décrivez l\'incident (accident, infraction, etc.) :'
    },
    {
      type: 'list',
      name: 'severite',
      message: 'Sélectionnez la sévérité de l\'incident :',
      choices: ['Faible', 'Moyenne', 'Élevée']
    }
  ]);

  try {
    // Exécuter le use case avec les valeurs fournies par l'utilisateur
    const result = await enregistrerIncidentUseCase.execute({
      essaiId: reponses.associerEssai ? parseInt(reponses.essaiId) : undefined,
      conducteurId: reponses.associerConducteur ? parseInt(reponses.conducteurId) : undefined,
      motoId: reponses.associerMoto ? parseInt(reponses.motoId) : undefined,
      dateIncident: new Date(reponses.dateIncident),
      description: reponses.description,
      severite: reponses.severite
    });

    console.log(chalk.green(`✅ Incident enregistré avec succès !`));
    console.log(chalk.blue(`📅 Date : ${result.incident.dateIncident.toDateString()}`));
    console.log(chalk.magenta(`⚠️ Sévérité : ${result.incident.severite}`));
    console.log(chalk.yellow(`📋 Description : ${result.incident.description}`));
    if (result.incident.essai) {
      console.log(chalk.cyan(`🏍️ Lié à l'essai ID : ${result.incident.essai.id}`));
    }
    if (result.incident.conducteur) {
      console.log(chalk.cyan(`👤 Lié au conducteur ID : ${result.incident.conducteur.id}`));
    }
    if (result.incident.moto) {
      console.log(chalk.cyan(`🏍️ Lié à la moto ID : ${result.incident.moto.id}`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
