import { Essai } from '../../domain/entities/Essai';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité Essai.
 */
export interface IEssaiRepository {
  /**
   * Recherche un essai par son identifiant.
   * @param id L'identifiant de l'essai.
   * @returns Une promesse contenant l'essai trouvé ou null si aucun essai n'est trouvé.
   */
  findById(id: number): Promise<Essai | null>;

  /**
   * Enregistre (ou met à jour) un essai.
   * Si l'essai n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param essai L'instance d'Essai à enregistrer.
   * @returns Une promesse contenant l'essai enregistré.
   */
  save(essai: Essai): Promise<Essai>;

  /**
   * Met à jour un essai existant.
   * @param essai L'instance d'Essai à mettre à jour.
   * @returns Une promesse contenant l'essai mis à jour.
   */
  update(essai: Essai): Promise<Essai>;

  /**
   * Retourne la liste de tous les essais enregistrés.
   * @returns Une promesse contenant un tableau d'Essai.
   */
  findAll(): Promise<Essai[]>;

  /**
   * Supprime un essai par son identifiant.
   * @param id L'identifiant de l'essai à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  delete(id: number): Promise<boolean>;
}
