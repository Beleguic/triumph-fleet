// src/interface/commands/enregistrerEntretien.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { EnregistrerEntretienUseCase } from './../../../application/use-cases/EnregistrerEntretienUseCase';
import { InMemoryEntretienRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryEntretienRepository';

export const enregistrerEntretienCLI = async () => {
  console.log(chalk.green('\n🛠️ Enregistrement d\'un entretien réalisé\n'));

  // Instanciation des repositories en mémoire
  const entretienRepo = new InMemoryEntretienRepository();
  const useCase = new EnregistrerEntretienUseCase(entretienRepo);

  // Demander les informations nécessaires à l'utilisateur
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'entretienId',
      message: 'Entrez l\'ID de l\'entretien à enregistrer :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'input',
      name: 'dateRealisee',
      message: 'Entrez la date de réalisation de l\'entretien (YYYY-MM-DD) :',
      validate: (input) => !isNaN(Date.parse(input)) ? true : 'Veuillez entrer une date valide au format YYYY-MM-DD.'
    },
    {
      type: 'input',
      name: 'cout',
      message: 'Entrez le coût total de l\'entretien (€) :',
      validate: (input) => (!isNaN(parseFloat(input)) && parseFloat(input) >= 0) ? true : 'Veuillez entrer un montant valide.'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Ajoutez une description ou des recommandations (facultatif) :'
    },
    {
      type: 'input',
      name: 'kilometrage',
      message: 'Entrez le kilométrage du véhicule après l\'entretien :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) >= 0) ? true : 'Veuillez entrer un kilométrage valide (nombre positif).'
    }
  ]);

  try {
    // Exécuter le use case avec les valeurs fournies par l'utilisateur
    const result = await useCase.execute({
      entretienId: parseInt(reponses.entretienId),
      dateRealisee: new Date(reponses.dateRealisee),
      cout: parseFloat(reponses.cout),
      description: reponses.description || 'Aucune recommandation spécifique.',
      kilometrage: parseInt(reponses.kilometrage)
    });

    console.log(chalk.green(`✅ Entretien enregistré avec succès pour la moto ID ${result.entretien.moto.id} !`));
    console.log(
      result.entretien.dateRealisee
        ? chalk.blue(`📅 Date de réalisation : ${result.entretien.dateRealisee.toDateString()}`)
        : chalk.gray(`📅 Date de réalisation : Non renseignée`)
    );
    console.log(chalk.yellow(`💰 Coût : ${result.entretien.cout} €`));
    console.log(chalk.magenta(`📋 Description : ${result.entretien.description}`));
    console.log(chalk.cyan(`🏍️ Kilométrage après entretien : ${result.entretien.kilometrage} km\n`));
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
