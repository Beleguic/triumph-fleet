// src/infrastructure/adapters/database/in-memory/InMemoryCommandePieceRepository.ts

import { ICommandePieceRepository } from '../../../application/ports/ICommandePieceRepository';
import { CommandePiece } from '../../../domain/entities/CommandePiece';

/**
 * Implémentation en mémoire du repository pour l'entité CommandePiece.
 */
export class InMemoryCommandePieceRepository implements ICommandePieceRepository {
  // Stock interne pour les commandes de pièces
  private commandes: CommandePiece[] = [];

  /**
   * Recherche une commande de pièce par son identifiant.
   * @param id L'identifiant de la commande.
   * @returns Une promesse contenant la commande trouvée ou null si aucune commande n'est trouvée.
   */
  async findById(id: number): Promise<CommandePiece | null> {
    const commande = this.commandes.find(c => c.id === id);
    return commande || null;
  }

  /**
   * Enregistre (ou met à jour) une commande de pièce.
   * Si la commande n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param commande L'instance de CommandePiece à enregistrer.
   * @returns Une promesse contenant la commande enregistrée.
   */
  async save(commande: CommandePiece): Promise<CommandePiece> {
    if (commande.id === undefined) {
      // Génération d'un nouvel identifiant basé sur le maximum des identifiants existants.
      const newId =
        this.commandes.length > 0 ? Math.max(...this.commandes.map(c => c.id || 0)) + 1 : 1;
      // Contournement de la propriété privée en lecture seule (_id) avec un cast en any.
      (commande as any)._id = newId;
      this.commandes.push(commande);
      return commande;
    } else {
      // Si la commande possède déjà un identifiant, on la met à jour ou on l'ajoute si elle n'existe pas.
      const index = this.commandes.findIndex(c => c.id === commande.id);
      if (index !== -1) {
        this.commandes[index] = commande;
      } else {
        this.commandes.push(commande);
      }
      return commande;
    }
  }

  /**
   * Met à jour une commande de pièce existante.
   * @param commande L'instance de CommandePiece à mettre à jour.
   * @returns Une promesse contenant la commande mise à jour.
   * @throws Une erreur si la commande n'existe pas.
   */
  async update(commande: CommandePiece): Promise<CommandePiece> {
    if (commande.id === undefined) {
      throw new Error("La commande doit avoir un identifiant pour être mise à jour.");
    }
    const index = this.commandes.findIndex(c => c.id === commande.id);
    if (index === -1) {
      throw new Error(`Commande de pièce avec l'id ${commande.id} non trouvée.`);
    }
    this.commandes[index] = commande;
    return commande;
  }

  /**
   * Retourne la liste de toutes les commandes de pièces enregistrées.
   * @returns Une promesse contenant un tableau de CommandePiece.
   */
  async findAll(): Promise<CommandePiece[]> {
    return this.commandes;
  }

  /**
   * Recherche les commandes passées pour une pièce donnée par son identifiant.
   * @param pieceId L'identifiant de la pièce.
   * @returns Une promesse contenant un tableau de CommandePiece pour cette pièce.
   */
  async findByPieceId(pieceId: number): Promise<CommandePiece[]> {
    return this.commandes.filter(c => c.piece.id === pieceId);
  }
}
