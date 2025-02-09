// src/interface/commands/gererStock.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { GererStockPiecesUseCase } from './../../../application/use-cases/GererStockPieceUseCase';
import { InMemoryStockRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryStockRepository';
import { InMemoryPieceRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryPieceRepository';

export const gererStockCLI = async () => {
  console.log(chalk.green('\n📦 Gestion du stock de pièces détachées\n'));

  // Instanciation des repositories en mémoire
  const stockRepo = new InMemoryStockRepository();
  const pieceRepo = new InMemoryPieceRepository();
  const useCase = new GererStockPiecesUseCase(stockRepo, pieceRepo);

  // Demander les informations nécessaires à l'utilisateur
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'pieceId',
      message: 'Entrez l\'ID de la pièce détachée concernée :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'input',
      name: 'quantite',
      message: 'Entrez la nouvelle quantité en stock :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) >= 0) ? true : 'Veuillez entrer une quantité valide (nombre positif).'
    },
    {
      type: 'input',
      name: 'seuilAlerte',
      message: 'Entrez le seuil d\'alerte pour cette pièce (optionnel) :',
      validate: (input) => input === '' || (!isNaN(parseInt(input)) && parseInt(input) >= 0) ? true : 'Veuillez entrer un seuil d\'alerte valide (nombre positif).'
    }
  ]);

  try {
    // Exécuter le use case avec les valeurs fournies par l'utilisateur
    const result = await useCase.execute({
      pieceId: parseInt(reponses.pieceId),
      quantite: parseInt(reponses.quantite),
      seuilAlerte: reponses.seuilAlerte ? parseInt(reponses.seuilAlerte) : undefined
    });

    console.log(chalk.green(`✅ Stock mis à jour avec succès pour la pièce ID ${result.stock.piece.id} !`));
    console.log(chalk.blue(`📦 Quantité actuelle : ${result.stock.quantite}`));
    if (result.stock.seuilAlerte !== undefined) {
      console.log(chalk.yellow(`🚨 Seuil d'alerte : ${result.stock.seuilAlerte}`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
