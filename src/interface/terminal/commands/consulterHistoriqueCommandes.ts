// src/interface/commands/consulterHistoriqueCommandes.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { consulterHistoriqueCommandesUseCase } from '../../../infrastructure/factories/ConsulterHistoriqueCommandesFactory';

export const consulterHistoriqueCommandesCLI = async () => {
  console.log(chalk.green('\n📜 Consultation de l\'historique des commandes de pièces\n'));

  // Demander si l'utilisateur souhaite filtrer par pièce
  const reponses = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'filtrerParPiece',
      message: 'Voulez-vous filtrer par une pièce spécifique ?'
    },
    {
      type: 'input',
      name: 'pieceId',
      message: 'Entrez l\'ID de la pièce :',
      when: (answers) => answers.filtrerParPiece,
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0) ? true : 'Veuillez entrer un identifiant numérique valide.'
    }
  ]);

  try {
    // Exécuter le use case avec le filtre éventuel
    const result = await consulterHistoriqueCommandesUseCase.execute({
      pieceId: reponses.filtrerParPiece ? parseInt(reponses.pieceId) : undefined
    });

    if (result.commandes.length === 0) {
      console.log(chalk.yellow('📭 Aucune commande trouvée.'));
    } else {
      console.log(chalk.green(`✅ ${result.commandes.length} commande(s) trouvée(s) :\n`));
      result.commandes.forEach((commande) => {
        console.log(
          chalk.blue(`📦 Pièce : ${commande.piece.nom}`),
          chalk.yellow(`📅 Date : ${commande.dateCommande.toDateString()}`),
          chalk.magenta(`🔢 Quantité : ${commande.quantite}`),
          chalk.cyan(`💰 Coût : ${commande.cout} €`),
          commande.delaiLivraison !== undefined ? chalk.green(`🚚 Livraison dans : ${commande.delaiLivraison} jours`) : '',
          chalk.gray(`📋 Statut : ${commande.statut}`)
        );
      });
    }
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
