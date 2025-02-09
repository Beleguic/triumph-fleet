// src/interface/commands/enregistrerPanne.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { EnregistrerPanneUseCase } from './../../../application/use-cases/EnregistrerPanneUseCase';
import { InMemoryPanneRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryPanneRepository';
import { InMemoryMotoRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryMotoRepository';
import { InMemoryEntretienRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryEntretienRepository';

export const enregistrerPanneCLI = async () => {
  console.log(chalk.green('\n🔧 Enregistrement d\'une panne ou d\'une réparation sous garantie\n'));

  // Instanciation des repositories en mémoire
  const panneRepo = new InMemoryPanneRepository();
  const motoRepo = new InMemoryMotoRepository();
  const entretienRepo = new InMemoryEntretienRepository();
  const useCase = new EnregistrerPanneUseCase(panneRepo, motoRepo, entretienRepo);

  // Demander les informations nécessaires à l'utilisateur
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'motoId',
      message: 'Entrez l\'ID de la moto concernée par la panne :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'confirm',
      name: 'associerEntretien',
      message: 'Cette panne est-elle associée à un entretien ?'
    },
    {
      type: 'input',
      name: 'entretienId',
      message: 'Entrez l\'ID de l\'entretien associé :',
      when: (answers) => answers.associerEntretien,
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'input',
      name: 'dateEvent',
      message: 'Entrez la date de l\'incident (YYYY-MM-DD) :',
      validate: (input) => !isNaN(Date.parse(input)) ? true : 'Veuillez entrer une date valide au format YYYY-MM-DD.'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Décrivez la panne ou l\'incident technique :'
    },
    {
      type: 'input',
      name: 'cout',
      message: 'Entrez le coût estimé de la réparation (€) :',
      validate: (input) => (!isNaN(parseFloat(input)) && parseFloat(input) >= 0) ? true : 'Veuillez entrer un montant valide.'
    },
    {
      type: 'confirm',
      name: 'sousGarantie',
      message: 'La réparation est-elle couverte par la garantie ?'
    }
  ]);

  try {
    // Exécuter le use case avec les valeurs fournies par l'utilisateur
    const result = await useCase.execute({
      motoId: parseInt(reponses.motoId),
      entretienId: reponses.associerEntretien ? parseInt(reponses.entretienId) : undefined,
      dateEvent: new Date(reponses.dateEvent),
      description: reponses.description,
      cout: parseFloat(reponses.cout),
      sousGarantie: reponses.sousGarantie
    });

    console.log(
        result.panne.moto
          ? chalk.green(`✅ Panne enregistrée avec succès pour la moto ID ${result.panne.moto.id} !`)
          : chalk.gray(`✅ Panne enregistrée, mais aucune moto associée.`)
      );
      
    console.log(chalk.blue(`📅 Date de l'incident : ${result.panne.dateEvent.toDateString()}`));
    console.log(chalk.yellow(`💰 Coût : ${result.panne.cout} €`));
    console.log(chalk.magenta(`📋 Description : ${result.panne.description}`));
    console.log(chalk.cyan(`🛡️ Couvert par la garantie : ${result.panne.sousGarantie ? 'Oui' : 'Non'}`));
    if (result.panne.entretien) {
      console.log(chalk.gray(`🔧 Entretien lié : ID ${result.panne.entretien.id}`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
