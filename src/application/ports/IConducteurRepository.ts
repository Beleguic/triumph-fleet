// src/application/ports/IConducteurRepository.ts

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
   * Enregistre (ou met à jour) un conducteur.
   * @param conducteur L'instance de Conducteur à enregistrer.
   * @returns Une promesse contenant le conducteur enregistré.
   */
  save(conducteur: Conducteur): Promise<Conducteur>;

  /**
   * Met à jour un conducteur existant.
   * @param conducteur L'instance de Conducteur à mettre à jour.
   * @returns Une promesse contenant le conducteur mis à jour.
   */
  update(conducteur: Conducteur): Promise<Conducteur>;

  /**
   * Retourne la liste de tous les conducteurs enregistrés.
   * @returns Une promesse contenant un tableau de Conducteur.
   */
  findAll(): Promise<Conducteur[]>;
}
