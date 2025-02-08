// src/application/ports/IPanneRepository.ts

import { Panne } from '../../domain/entities/Panne';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité Panne.
 */
export interface IPanneRepository {
  /**
   * Recherche une panne par son identifiant.
   * @param id L'identifiant de la panne.
   * @returns Une promesse contenant la panne trouvée ou null si aucune panne n'est trouvée.
   */
  findById(id: number): Promise<Panne | null>;

  /**
   * Enregistre (ou met à jour) une panne.
   * Si la panne n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param panne L'instance de Panne à enregistrer.
   * @returns Une promesse contenant la panne enregistrée.
   */
  save(panne: Panne): Promise<Panne>;

  /**
   * Met à jour une panne existante.
   * @param panne L'instance de Panne à mettre à jour.
   * @returns Une promesse contenant la panne mise à jour.
   */
  update(panne: Panne): Promise<Panne>;

  /**
   * Retourne la liste de toutes les pannes enregistrées.
   * @returns Une promesse contenant un tableau de Panne.
   */
  findAll(): Promise<Panne[]>;
}
