// src/interface/commands/gererModeleMoto.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { gererModeleMotoUseCase } from '../../../infrastructure/factories/GererModeleMotoFactory';

export const gererModeleMotoCLI = async () => {
  console.log(chalk.green('\n🏍️ Gestion des modèles de motos\n'));

  // Demander l’action à effectuer
  const actionReponse = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Que souhaitez-vous faire ?',
      choices: [
        'Créer un modèle de moto',
        'Modifier un modèle de moto',
        'Supprimer un modèle de moto',
        'Consulter tous les modèles de moto',
        'Retour'
      ]
    }
  ]);

  if (actionReponse.action === 'Retour') return;

  // ✅ Consulter tous les modèles de moto
  if (actionReponse.action === 'Consulter tous les modèles de moto') {
    const modeles = await gererModeleMotoUseCase.getAllModelesMoto();
    if (modeles.length === 0) {
      console.log(chalk.yellow('📭 Aucun modèle de moto enregistré.'));
    } else {
      console.log(chalk.green(`✅ ${modeles.length} modèle(s) trouvé(s) :\n`));
      modeles.forEach((modele) => {
        console.log(
          chalk.blue(`🆔 ID : ${modele.id}`),
          chalk.yellow(`🏍️ Nom : ${modele.nom}`),
          chalk.magenta(`🔧 Intervalle d'entretien : ${modele.intervalleKm} km / ${modele.intervalleAnnees} an(s)`)
        );
      });
    }
    return;
  }

  // ✅ Supprimer un modèle de moto
  if (actionReponse.action === 'Supprimer un modèle de moto') {
    const reponse = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Entrez l\'ID du modèle de moto à supprimer :',
        validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) > 0)
          ? true
          : 'Veuillez entrer un identifiant numérique valide.'
      }
    ]);

    try {
      const success = await gererModeleMotoUseCase.deleteModeleMoto(parseInt(reponse.id));
      if (success) {
        console.log(chalk.green(`✅ Modèle de moto ID ${reponse.id} supprimé avec succès.`));
      } else {
        console.log(chalk.red(`❌ Impossible de supprimer le modèle de moto ID ${reponse.id}.`));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
    }
    return;
  }

  // ✅ Créer ou modifier un modèle de moto
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Entrez l\'ID du modèle (laisser vide pour créer un nouveau) :',
      when: () => actionReponse.action === 'Modifier un modèle de moto'
    },
    {
      type: 'input',
      name: 'nom',
      message: 'Entrez le nom du modèle de moto :',
      validate: (input) => input.length > 0 ? true : 'Le nom ne peut pas être vide.'
    },
    {
      type: 'input',
      name: 'intervalleKm',
      message: 'Entrez l\'intervalle d\'entretien en kilomètres :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) >= 0) 
        ? true 
        : 'Veuillez entrer un nombre valide (nombre positif).'
    },
    {
      type: 'input',
      name: 'intervalleAnnees',
      message: 'Entrez l\'intervalle d\'entretien en années :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) >= 0) 
        ? true 
        : 'Veuillez entrer un nombre valide (nombre positif).'
    }
  ]);

  try {
    const result = await gererModeleMotoUseCase.execute({
      id: reponses.id ? parseInt(reponses.id) : undefined,
      nom: reponses.nom,
      intervalleKm: parseInt(reponses.intervalleKm),
      intervalleAnnees: parseInt(reponses.intervalleAnnees)
    });

    console.log(chalk.green(`✅ Modèle ${actionReponse.action === 'Modifier un modèle de moto' ? 'modifié' : 'créé'} avec succès !`));
    console.log(chalk.blue(`🆔 ID : ${result.id}`));
    console.log(chalk.yellow(`🏍️ Nom : ${result.nom}`));
    console.log(chalk.magenta(`🔧 Intervalle d'entretien : ${result.intervalleKm} km / ${result.intervalleAnnees} an(s)`));
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
