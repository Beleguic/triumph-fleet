// src/interface/commands/planifierEssaiMoto.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { planifierEssaiMotoUseCase } from '../../../infrastructure/factories/PlanifierEssaiMotoFactory';

export const planifierEssaiMotoCLI = async () => {
  console.log(chalk.green('\n🏍️ Planification d\'un essai moto\n'));

  // Demander les informations nécessaires à l'utilisateur
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'motoId',
      message: 'Entrez l\'ID de la moto à essayer :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) 
        ? true 
        : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'input',
      name: 'conducteurId',
      message: 'Entrez l\'ID du conducteur :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) 
        ? true 
        : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'input',
      name: 'dateDebut',
      message: 'Entrez la date de début de l\'essai (YYYY-MM-DD) :',
      validate: (input) => !isNaN(Date.parse(input)) 
        ? true 
        : 'Veuillez entrer une date valide au format YYYY-MM-DD.'
    },
    {
      type: 'input',
      name: 'dateFin',
      message: 'Entrez la date de fin de l\'essai (YYYY-MM-DD) :',
      validate: (input) => !isNaN(Date.parse(input)) 
        ? true 
        : 'Veuillez entrer une date valide au format YYYY-MM-DD.'
    },
    {
      type: 'input',
      name: 'kilometrageParcouru',
      message: 'Entrez le kilométrage prévu pour l\'essai :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) >= 0) 
        ? true 
        : 'Veuillez entrer un kilométrage valide (nombre positif).'
    }
  ]);

  try {
    // Exécuter le use case avec les valeurs fournies par l'utilisateur
    const result = await planifierEssaiMotoUseCase.execute({
      motoId: parseInt(reponses.motoId),
      conducteurId: parseInt(reponses.conducteurId),
      dateDebut: new Date(reponses.dateDebut),
      dateFin: new Date(reponses.dateFin),
      kilometrageParcouru: parseInt(reponses.kilometrageParcouru)
    });

    console.log(chalk.green(`✅ Essai planifié avec succès pour la moto ID ${result.essai.moto.id} !`));
    console.log(chalk.blue(`📅 Date de début : ${result.essai.dateDebut.toDateString()}`));
    console.log(
      result.essai.dateFin
        ? chalk.yellow(`📅 Date de fin : ${result.essai.dateFin.toDateString()}`)
        : chalk.gray(`📅 Date de fin : Non renseignée`)
    );
    console.log(chalk.magenta(`🏍️ Kilométrage prévu : ${result.essai.kilometrageParcouru} km`));
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
