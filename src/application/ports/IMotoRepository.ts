// src/application/ports/IMotoRepository.ts

import { Moto } from '../../domain/entities/Moto';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité Moto.
 */
export interface IMotoRepository {
  /**
   * Recherche une moto par son identifiant.
   * @param id L'identifiant de la moto.
   * @returns Une promesse contenant la moto trouvée ou null si aucune moto n'est trouvée.
   */
  findById(id: number): Promise<Moto | null>;

  /**
   * Enregistre (ou met à jour) une moto.
   * Si la moto n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param moto L'instance de Moto à enregistrer.
   * @returns Une promesse contenant la moto enregistrée.
   */
  save(moto: Moto): Promise<Moto>;

  /**
   * Met à jour une moto existante.
   * @param moto L'instance de Moto à mettre à jour.
   * @returns Une promesse contenant la moto mise à jour.
   */
  update(moto: Moto): Promise<Moto>;

  /**
   * Retourne la liste de toutes les motos enregistrées.
   * @returns Une promesse contenant un tableau de Moto.
   */
  findAll(): Promise<Moto[]>;
}
