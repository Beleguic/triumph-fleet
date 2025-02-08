// src/application/ports/IEntretienRepository.ts

import { Entretien } from '../../domain/entities/Entretien';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité Entretien.
 */
export interface IEntretienRepository {
  /**
   * Recherche un entretien par son identifiant.
   * @param id L'identifiant de l'entretien.
   * @returns Une promesse contenant l'entretien trouvé ou null s'il n'existe pas.
   */
  findById(id: number): Promise<Entretien | null>;

  /**
   * Enregistre (ou met à jour) un entretien.
   * Si l'entretien n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param entretien L'instance d'Entretien à enregistrer.
   * @returns Une promesse contenant l'entretien enregistré.
   */
  save(entretien: Entretien): Promise<Entretien>;

  /**
   * Met à jour un entretien existant.
   * @param entretien L'instance d'Entretien à mettre à jour.
   * @returns Une promesse contenant l'entretien mis à jour.
   */
  update(entretien: Entretien): Promise<Entretien>;

  /**
   * Retourne la liste de tous les entretiens enregistrés.
   * @returns Une promesse contenant un tableau d'Entretien.
   */
  findAll(): Promise<Entretien[]>;
}
