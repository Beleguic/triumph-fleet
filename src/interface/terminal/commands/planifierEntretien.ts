// src/interface/commands/planifierEntretien.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { PlanifierEntretienUseCase } from './../../../application/use-cases/PlanifierEntretienUseCase';
import { InMemoryMotoRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryMotoRepository';
import { InMemoryEntretienRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryEntretienRepository';

export const planifierEntretienCLI = async () => {
  console.log(chalk.green('\n🛠️ Planification d\'un entretien moto\n'));

  // Instanciation des repositories en mémoire
  const motoRepo = new InMemoryMotoRepository();
  const entretienRepo = new InMemoryEntretienRepository();
  const useCase = new PlanifierEntretienUseCase(motoRepo, entretienRepo);

  // Demander les informations nécessaires à l'utilisateur
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'motoId',
      message: 'Entrez l\'ID de la moto concernée :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'list',
      name: 'typeEntretien',
      message: 'Choisissez le type d\'entretien :',
      choices: ['préventif', 'curatif']
    },
    {
      type: 'input',
      name: 'datePlanifiee',
      message: 'Entrez la date de l\'entretien (YYYY-MM-DD) :',
      validate: (input) => !isNaN(Date.parse(input)) ? true : 'Veuillez entrer une date valide au format YYYY-MM-DD.'
    },
    {
      type: 'input',
      name: 'kilometrage',
      message: 'Entrez le kilométrage prévu pour l\'entretien :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) >= 0) ? true : 'Veuillez entrer un kilométrage valide (nombre positif).'
    }
  ]);

  try {
    // Exécuter le use case avec les valeurs fournies par l'utilisateur
    const result = await useCase.execute({
      motoId: parseInt(reponses.motoId),
      typeEntretien: reponses.typeEntretien,
      datePlanifiee: new Date(reponses.datePlanifiee),
      kilometrage: parseInt(reponses.kilometrage)
    });

    console.log(chalk.green(`✅ Entretien planifié avec succès pour la moto ID ${result.entretien.moto.id} !`));
    console.log(chalk.blue(`📅 Date de l'entretien : ${result.entretien.datePlanifiee.toDateString()}`));
    console.log(chalk.yellow(`🔧 Type d'entretien : ${result.entretien.typeEntretien}`));
    console.log(chalk.magenta(`🏍️ Kilométrage prévu : ${result.entretien.kilometrage} km\n`));
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${error.message}`));
  }
};
