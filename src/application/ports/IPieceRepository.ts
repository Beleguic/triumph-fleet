// src/application/ports/IPieceRepository.ts

import { Piece } from '../../domain/entities/Piece';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité Piece.
 */
export interface IPieceRepository {
  /**
   * Recherche une pièce par son identifiant.
   * @param id L'identifiant de la pièce.
   * @returns Une promesse contenant l'instance de Piece trouvée ou null si aucune pièce n'est trouvée.
   */
  findById(id: number): Promise<Piece | null>;

  /**
   * Enregistre (ou met à jour) une pièce.
   * Si la pièce n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param piece L'instance de Piece à enregistrer.
   * @returns Une promesse contenant la pièce enregistrée.
   */
  save(piece: Piece): Promise<Piece>;

  /**
   * Met à jour une pièce existante.
   * @param piece L'instance de Piece à mettre à jour.
   * @returns Une promesse contenant la pièce mise à jour.
   */
  update(piece: Piece): Promise<Piece>;

  /**
   * Retourne la liste de toutes les pièces enregistrées.
   * @returns Une promesse contenant un tableau de Piece.
   */
  findAll(): Promise<Piece[]>;
}
