// src/interface/commands/passerCommandePiece.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { PasserCommandePieceUseCase } from './../../../application/use-cases/PasserCommandePieceUseCase';
import { InMemoryPieceRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryPieceRepository';
import { InMemoryCommandePieceRepository } from './../../../infrastructure/adapters/database/in-memory/InMemoryCommandePieceRepository';

export const passerCommandePieceCLI = async () => {
  console.log(chalk.green('\n🛒 Passer une commande de pièces détachées\n'));

  // Instanciation des repositories en mémoire
  const pieceRepo = new InMemoryPieceRepository();
  const commandeRepo = new InMemoryCommandePieceRepository();
  const useCase = new PasserCommandePieceUseCase(pieceRepo, commandeRepo);

  // Demander les informations nécessaires à l'utilisateur
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'pieceId',
      message: 'Entrez l\'ID de la pièce détachée à commander :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    },
    {
      type: 'input',
      name: 'quantite',
      message: 'Entrez la quantité à commander :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer une quantité valide (nombre positif).'
    },
    {
      type: 'input',
      name: 'cout',
      message: 'Entrez le coût total de la commande (€) :',
      validate: (input) => (!isNaN(parseFloat(input)) && parseFloat(input) >= 0) ? true : 'Veuillez entrer un montant valide.'
    },
    {
      type: 'input',
      name: 'delaiLivraison',
      message: 'Entrez le délai de livraison en jours (optionnel) :',
      validate: (input) => input === '' || (!isNaN(parseInt(input)) && parseInt(input) >= 0) ? true : 'Veuillez entrer un nombre de jours valide.'
    },
    {
      type: 'list',
      name: 'statut',
      message: 'Sélectionnez le statut de la commande :',
      choices: ['En attente', 'En cours', 'Livrée']
    }
  ]);

  try {
    // Exécuter le use case avec les valeurs fournies par l'utilisateur
    const result = await useCase.execute({
      pieceId: parseInt(reponses.pieceId),
      dateCommande: new Date(),
      quantite: parseInt(reponses.quantite),
      cout: parseFloat(reponses.cout),
      delaiLivraison: reponses.delaiLivraison ? parseInt(reponses.delaiLivraison) : undefined,
      statut: reponses.statut
    });

    console.log(chalk.green(`✅ Commande enregistrée avec succès pour la pièce ID ${result.commande.piece.id} !`));
    console.log(chalk.blue(`📦 Quantité commandée : ${result.commande.quantite}`));
    console.log(chalk.yellow(`💰 Coût total : ${result.commande.cout} €`));
    if (result.commande.delaiLivraison !== undefined) {
      console.log(chalk.magenta(`🚚 Délai de livraison : ${result.commande.delaiLivraison} jours`));
    }
    console.log(chalk.cyan(`📋 Statut : ${result.commande.statut}`));
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${error.message}`));
  }
};
