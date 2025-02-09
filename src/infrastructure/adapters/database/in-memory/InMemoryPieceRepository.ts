// src/infrastructure/adapters/database/in-memory/InMemoryPieceRepository.ts

import { IPieceRepository } from './../../../../application/ports/IPieceRepository';
import { Piece } from './../../../../domain/entities/Piece';

/**
 * Implémentation en mémoire du repository pour l'entité Piece.
 */
export class InMemoryPieceRepository implements IPieceRepository {
  // Stock interne pour les instances de Piece
  private pieces: Piece[] = [];

  /**
   * Recherche une pièce par son identifiant.
   * @param id L'identifiant de la pièce.
   * @returns Une promesse contenant la pièce trouvée ou null si aucune pièce n'est trouvée.
   */
  async findById(id: number): Promise<Piece | null> {
    const piece = this.pieces.find(p => p.id === id);
    return piece || null;
  }

  /**
   * Enregistre (ou met à jour) une pièce.
   * Si la pièce n'a pas d'identifiant, un nouvel identifiant est généré.
   * @param piece L'instance de Piece à enregistrer.
   * @returns Une promesse contenant la pièce enregistrée.
   */
  async save(piece: Piece): Promise<Piece> {
    if (piece.id === undefined) {
      // Génération d'un nouvel identifiant en se basant sur le maximum des identifiants existants
      const newId =
        this.pieces.length > 0 ? Math.max(...this.pieces.map(p => p.id || 0)) + 1 : 1;
      // Contournement de la propriété privée en lecture seule (_id) avec un cast en any
      (piece as any)._id = newId;
      this.pieces.push(piece);
      return piece;
    } else {
      // Si la pièce existe déjà, on la met à jour ou on l'ajoute si elle n'est pas trouvée
      const index = this.pieces.findIndex(p => p.id === piece.id);
      if (index !== -1) {
        this.pieces[index] = piece;
      } else {
        this.pieces.push(piece);
      }
      return piece;
    }
  }

  /**
   * Met à jour une pièce existante dans le repository.
   * @param piece L'instance de Piece à mettre à jour.
   * @returns Une promesse contenant la pièce mise à jour.
   * @throws Une erreur si la pièce n'existe pas.
   */
  async update(piece: Piece): Promise<Piece> {
    if (piece.id === undefined) {
      throw new Error("La pièce doit avoir un identifiant pour être mise à jour.");
    }
    const index = this.pieces.findIndex(p => p.id === piece.id);
    if (index === -1) {
      throw new Error(`Pièce avec l'id ${piece.id} non trouvée.`);
    }
    this.pieces[index] = piece;
    return piece;
  }

  /**
   * Retourne la liste de toutes les pièces enregistrées.
   * @returns Une promesse contenant un tableau de Piece.
   */
  async findAll(): Promise<Piece[]> {
    return this.pieces;
  }
}
