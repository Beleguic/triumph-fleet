// src/application/use-cases/GererProfilConducteurUseCase.ts

import { IConducteurRepository } from '../ports/IConducteurRepository';
import { Conducteur } from '../../domain/entities/Conducteur';
import { GererProfilConducteurInput, GererProfilConducteurOutput } from './GererProfilConducteurUseCase';

/**
 * DTO d'entrée pour gérer le profil d'un conducteur.
 * Peut être utilisé pour la création ou la mise à jour du profil.
 */
export interface GererProfilConducteurInput {
  id?: number;             // Identifiant du conducteur, optionnel si création
  nom: string;             // Nom du conducteur
  permis: string;          // Numéro ou type de permis
  experienceAnnees: number; // Nombre d'années d'expérience
  contactInfo?: string;    // Informations de contact, optionnel
}

/**
 * DTO de sortie renvoyant le conducteur créé ou mis à jour.
 */
export interface GererProfilConducteurOutput {
  conducteur: Conducteur;
}


export class GererProfilConducteurUseCase {
  constructor(
    private readonly conducteurRepository: IConducteurRepository
  ) {}

  /**
   * Exécute le use case pour créer ou mettre à jour un conducteur.
   * @param input Données d'entrée contenant les informations sur le conducteur.
   * @returns Le conducteur créé ou mis à jour.
   */
  public async execute(input: GererProfilConducteurInput): Promise<GererProfilConducteurOutput> {
    let conducteur;

    if (input.id) {
      // Si un identifiant est fourni, on met à jour le conducteur existant
      conducteur = await this.conducteurRepository.findById(input.id);
      if (!conducteur) {
        throw new Error(`Conducteur avec l'id ${input.id} non trouvé.`);
      }
      // Mise à jour des informations du conducteur
      conducteur.nom = input.nom;
      conducteur.permis = input.permis;
      conducteur.experienceAnnees = input.experienceAnnees;
      conducteur.contactInfo = input.contactInfo;
      conducteur = await this.conducteurRepository.update(conducteur);
    } else {
      // Si aucun identifiant n'est fourni, on crée un nouveau conducteur
      conducteur = new Conducteur({
        nom: input.nom,
        permis: input.permis,
        experienceAnnees: input.experienceAnnees,
        contactInfo: input.contactInfo
      });
      conducteur = await this.conducteurRepository.save(conducteur);
    }

    return { conducteur };
  }
}
