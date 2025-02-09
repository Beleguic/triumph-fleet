// src/interface/commands/enregistrerEssaiMoto.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { EnregistrerEssaiMotoUseCase } from './../../../application/use-cases/EnregistrerEssaiMotoUseCase';
import { InMemoryEssaiRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryEssaiRepository';

export const enregistrerEssaiMotoCLI = async () => {
  console.log(chalk.green('\n🏍️ Enregistrement d\'un essai moto terminé\n'));

  // Instanciation du repository en mémoire
  const essaiRepo = new InMemoryEssaiRepository();
  const useCase = new EnregistrerEssaiMotoUseCase(essaiRepo);

  // Demander les informations nécessaires à l'utilisateur
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'essaiId',
      message: 'Entrez l\'ID de l\'essai à enregistrer :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'input',
      name: 'dateFin',
      message: 'Entrez la date de fin de l\'essai (YYYY-MM-DD) :',
      validate: (input) => !isNaN(Date.parse(input)) ? true : 'Veuillez entrer une date valide au format YYYY-MM-DD.'
    },
    {
      type: 'input',
      name: 'kilometrageParcouru',
      message: 'Entrez le kilométrage réellement parcouru :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) >= 0) ? true : 'Veuillez entrer un kilométrage valide (nombre positif).'
    }
  ]);

  try {
    // Exécuter le use case avec les valeurs fournies par l'utilisateur
    const result = await useCase.execute({
      essaiId: parseInt(reponses.essaiId),
      dateFin: new Date(reponses.dateFin),
      kilometrageParcouru: parseInt(reponses.kilometrageParcouru)
    });

    console.log(chalk.green(`✅ Essai enregistré avec succès pour la moto ID ${result.essai.moto.id} !`));
    console.log(
        result.essai.dateFin
          ? chalk.blue(`📅 Date de fin : ${result.essai.dateFin.toDateString()}`)
          : chalk.gray(`📅 Date de fin : Non renseignée`)
      );
    console.log(chalk.magenta(`🏍️ Kilométrage parcouru : ${result.essai.kilometrageParcouru} km`));
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
