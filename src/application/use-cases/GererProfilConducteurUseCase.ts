import { IConducteurRepository } from '../ports/IConducteurRepository';
import { Conducteur } from '../../domain/entities/Conducteur';

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

/**
 * Use Case pour la gestion du profil des conducteurs.
 */
export class GererProfilConducteurUseCase {
  constructor(private conducteurRepository: IConducteurRepository) {}

  /**
   * Récupère tous les conducteurs enregistrés.
   * @returns Une liste des conducteurs.
   */
  public async getAllConducteurs(): Promise<Conducteur[]> {
    return await this.conducteurRepository.findAll();
  }

  /**
   * Supprime un conducteur par son identifiant.
   * @param id L'identifiant du conducteur à supprimer.
   * @returns Un booléen indiquant si la suppression a été effectuée avec succès.
   */
  public async deleteConducteur(id: number): Promise<boolean> {
    const conducteur = await this.conducteurRepository.findById(id);
    if (!conducteur) {
      throw new Error(`Conducteur avec l'ID ${id} non trouvé.`);
    }
    return await this.conducteurRepository.delete(id);
  }

  /**
   * Crée ou met à jour un conducteur.
   * @param input Données d'entrée contenant les informations sur le conducteur.
   * @returns Le conducteur créé ou mis à jour.
   */
  public async execute(input: GererProfilConducteurInput): Promise<GererProfilConducteurOutput> {
    let conducteur;

    // Vérification des entrées pour éviter les erreurs
    if (!input.nom.trim()) {
      throw new Error("Le nom du conducteur ne peut pas être vide.");
    }
    if (!input.permis.trim()) {
      throw new Error("Le permis du conducteur ne peut pas être vide.");
    }
    if (input.experienceAnnees < 0) {
      throw new Error("L'expérience en années ne peut pas être négative.");
    }

    if (input.id) {
      // Si un ID est fourni, on tente de récupérer le conducteur existant
      conducteur = await this.conducteurRepository.findById(input.id);
      if (!conducteur) {
        throw new Error(`Conducteur avec l'ID ${input.id} non trouvé.`);
      }

      // Mise à jour des informations du conducteur
      conducteur.nom = input.nom;
      conducteur.permis = input.permis;
      conducteur.experienceAnnees = input.experienceAnnees;
      conducteur.contactInfo = input.contactInfo;

      // Mise à jour dans le repository
      conducteur = await this.conducteurRepository.update(conducteur);
    } else {
      // Création d'un nouveau conducteur
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
