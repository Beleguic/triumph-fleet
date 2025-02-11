// src/application/ports/IIncidentRepository.ts

import { Incident } from '../../domain/entities/Incident';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité Incident.
 */
export interface IIncidentRepository {
  /**
   * Recherche un incident par son identifiant.
   * @param id L'identifiant de l'incident.
   * @returns Une promesse contenant l'incident trouvé ou null si non trouvé.
   */
  findById(id: number): Promise<Incident | null>;

  /**
   * Enregistre (ou met à jour) un incident.
   * @param incident L'instance d'Incident à enregistrer.
   * @returns Une promesse contenant l'incident enregistré.
   */
  save(incident: Incident): Promise<Incident>;

  /**
   * Met à jour un incident existant.
   * @param incident L'instance d'Incident à mettre à jour.
   * @returns Une promesse contenant l'incident mis à jour.
   */
  update(incident: Incident): Promise<Incident>;

  /**
   * Retourne la liste de tous les incidents enregistrés.
   * @returns Une promesse contenant un tableau d'Incident.
   */
  findAll(): Promise<Incident[]>;

   /**
   * Supprime un incident par son identifiant.
   * @param id L'identifiant de l'incident à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
   delete(id: number): Promise<boolean>;
}
