// src/application/ports/IStockRepository.ts

import { Stock } from '../../domain/entities/Stock';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité Stock.
 */
export interface IStockRepository {
  /**
   * Recherche un stock par son identifiant.
   * @param id L'identifiant du stock.
   * @returns Une promesse contenant l'instance de Stock trouvée ou null si aucun stock n'est trouvé.
   */
  findById(id: number): Promise<Stock | null>;

  /**
   * Recherche le stock associé à une pièce via l'identifiant de la pièce.
   * @param pieceId L'identifiant de la pièce.
   * @returns Une promesse contenant l'instance de Stock liée à la pièce ou null si aucun stock n'est trouvé.
   */
  findByPieceId(pieceId: number): Promise<Stock | null>;

  /**
   * Enregistre (ou met à jour) un stock.
   * Si le stock n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param stock L'instance de Stock à enregistrer.
   * @returns Une promesse contenant le stock enregistré.
   */
  save(stock: Stock): Promise<Stock>;

  /**
   * Met à jour un stock existant.
   * @param stock L'instance de Stock à mettre à jour.
   * @returns Une promesse contenant le stock mis à jour.
   */
  update(stock: Stock): Promise<Stock>;

  /**
   * Retourne la liste de tous les stocks enregistrés.
   * @returns Une promesse contenant un tableau de Stock.
   */
  findAll(): Promise<Stock[]>;

   /**
   * Supprime un stock par son identifiant.
   * @param id L'identifiant du stock à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
   delete(id: number): Promise<boolean>;
}
