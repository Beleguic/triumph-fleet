// src/interface/commands/gererProfilConducteur.ts

import inquirer from 'inquirer';
import chalk from 'chalk';
import { gererProfilConducteurUseCase } from '../../../infrastructure/factories/GererProfilConducteurFactory';

export const gererProfilConducteurCLI = async () => {
  console.log(chalk.green('\n🚗 Gestion du profil des conducteurs\n'));

  // Demander l’action à effectuer
  const actionReponse = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Que souhaitez-vous faire ?',
      choices: [
        'Créer un conducteur',
        'Modifier un conducteur',
        'Consulter tous les conducteurs',
        'Retour'
      ]
    }
  ]);

  if (actionReponse.action === 'Retour') return;

  // ✅ Appel du Use Case pour récupérer tous les conducteurs
  if (actionReponse.action === 'Consulter tous les conducteurs') {
    const conducteurs = await gererProfilConducteurUseCase.getAllConducteurs();
    if (conducteurs.length === 0) {
      console.log(chalk.yellow('📭 Aucun conducteur enregistré.'));
    } else {
      console.log(chalk.green(`✅ ${conducteurs.length} conducteur(s) trouvé(s) :\n`));
      conducteurs.forEach((conducteur) => {
        console.log(
          chalk.blue(`🆔 ID : ${conducteur.id}`),
          chalk.yellow(`👤 Nom : ${conducteur.nom}`),
          chalk.magenta(`🚗 Permis : ${conducteur.permis}`),
          chalk.cyan(`🎖️ Expérience : ${conducteur.experienceAnnees} an(s)`),
          conducteur.contactInfo ? chalk.gray(`📩 Contact : ${conducteur.contactInfo}`) : ''
        );
      });
    }
    return;
  }

  // Si l'utilisateur veut créer ou modifier un conducteur
  const reponses = await inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Entrez l\'ID du conducteur (laisser vide pour créer un nouveau) :',
      when: () => actionReponse.action === 'Modifier un conducteur'
    },
    {
      type: 'input',
      name: 'nom',
      message: 'Entrez le nom du conducteur :',
      validate: (input) => input.length > 0 ? true : 'Le nom ne peut pas être vide.'
    },
    {
      type: 'input',
      name: 'permis',
      message: 'Entrez le type ou numéro du permis :',
      validate: (input) => input.length > 0 ? true : 'Le permis ne peut pas être vide.'
    },
    {
      type: 'input',
      name: 'experienceAnnees',
      message: 'Entrez le nombre d\'années d\'expérience :',
      validate: (input) => (!isNaN(parseInt(input)) && parseInt(input) >= 0) ? true : 'Veuillez entrer un nombre valide.'
    },
    {
      type: 'input',
      name: 'contactInfo',
      message: 'Entrez les informations de contact (optionnel) :'
    }
  ]);

  try {
    // Exécuter le use case avec les valeurs fournies par l'utilisateur
    const result = await gererProfilConducteurUseCase.execute({
      id: reponses.id ? parseInt(reponses.id) : undefined,
      nom: reponses.nom,
      permis: reponses.permis,
      experienceAnnees: parseInt(reponses.experienceAnnees),
      contactInfo: reponses.contactInfo || undefined
    });

    console.log(chalk.green(`✅ Conducteur ${actionReponse.action === 'Modifier un conducteur' ? 'modifié' : 'créé'} avec succès !`));
    console.log(chalk.blue(`🆔 ID : ${result.conducteur.id}`));
    console.log(chalk.yellow(`👤 Nom : ${result.conducteur.nom}`));
    console.log(chalk.magenta(`🚗 Permis : ${result.conducteur.permis}`));
    console.log(chalk.cyan(`🎖️ Expérience : ${result.conducteur.experienceAnnees} an(s)`));
    if (result.conducteur.contactInfo) {
      console.log(chalk.gray(`📩 Contact : ${result.conducteur.contactInfo}`));
    }
  } catch (error) {
    console.log(chalk.red(`❌ Erreur: ${(error as Error).message}`));
  }
};
