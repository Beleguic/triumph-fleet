import { Conducteur } from '../../domain/entities/Conducteur';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité Conducteur.
 */
export interface IConducteurRepository {
  /**
   * Recherche un conducteur par son identifiant.
   * @param id L'identifiant du conducteur.
   * @returns Une promesse contenant l'instance de Conducteur trouvée ou null si non trouvée.
   */
  findById(id: number): Promise<Conducteur | null>;

  /**
   * Enregistre un nouveau conducteur ou met à jour un conducteur existant.
   * Si l'ID n'est pas défini, un nouvel ID auto-incrémenté est attribué.
   * @param conducteur L'instance de Conducteur à enregistrer.
   * @returns Une promesse contenant le conducteur enregistré.
   */
  save(conducteur: Conducteur): Promise<Conducteur>;

  /**
   * Met à jour un conducteur existant.
   * Lève une erreur si le conducteur n'existe pas.
   * @param conducteur L'instance de Conducteur à mettre à jour.
   * @returns Une promesse contenant le conducteur mis à jour.
   */
  update(conducteur: Conducteur): Promise<Conducteur>;

  /**
   * Retourne la liste de tous les conducteurs enregistrés.
   * @returns Une promesse contenant un tableau de Conducteur.
   */
  findAll(): Promise<Conducteur[]>;

  /**
   * Supprime un conducteur par son identifiant.
   * @param id L'identifiant du conducteur à supprimer.
   * @returns Une promesse indiquant si la suppression a réussi (true) ou si le conducteur n'a pas été trouvé (false).
   */
  delete(id: number): Promise<boolean>;
}
