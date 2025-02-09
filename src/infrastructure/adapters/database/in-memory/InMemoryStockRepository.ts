// src/infrastructure/adapters/database/in-memory/InMemoryStockRepository.ts

import { IStockRepository } from './../../../../application/ports/IStockRepository';
import { Stock } from './../../../../domain/entities/Stock';

/**
 * Implémentation en mémoire du repository pour l'entité Stock.
 */
export class InMemoryStockRepository implements IStockRepository {
  // Stock interne pour les instances de Stock
  private stocks: Stock[] = [];

  /**
   * Recherche un stock par son identifiant.
   * @param id L'identifiant du stock.
   * @returns Une promesse contenant le stock trouvé ou null s'il n'existe pas.
   */
  async findById(id: number): Promise<Stock | null> {
    const stock = this.stocks.find(s => s.id === id);
    return stock || null;
  }

  /**
   * Recherche le stock associé à une pièce via l'identifiant de la pièce.
   * @param pieceId L'identifiant de la pièce.
   * @returns Une promesse contenant le stock lié à la pièce ou null si aucun stock n'est trouvé.
   */
  async findByPieceId(pieceId: number): Promise<Stock | null> {
    const stock = this.stocks.find(s => s.piece && s.piece.id === pieceId);
    return stock || null;
  }

  /**
   * Enregistre (ou met à jour) un stock.
   * Si le stock n'a pas d'identifiant, un nouvel identifiant est généré.
   * @param stock L'instance de Stock à enregistrer.
   * @returns Une promesse contenant le stock enregistré.
   */
  async save(stock: Stock): Promise<Stock> {
    if (stock.id === undefined) {
      // Génération d'un nouvel identifiant basé sur le maximum des identifiants existants.
      const newId =
        this.stocks.length > 0 ? Math.max(...this.stocks.map(s => s.id || 0)) + 1 : 1;
      // Contournement de la propriété privée en lecture seule (_id) avec un cast en any.
      (stock as any)._id = newId;
      this.stocks.push(stock);
      return stock;
    } else {
      // Si le stock possède déjà un identifiant, on le met à jour ou on l'ajoute s'il n'existe pas.
      const index = this.stocks.findIndex(s => s.id === stock.id);
      if (index !== -1) {
        this.stocks[index] = stock;
      } else {
        this.stocks.push(stock);
      }
      return stock;
    }
  }

  /**
   * Met à jour un stock existant.
   * @param stock L'instance de Stock à mettre à jour.
   * @returns Une promesse contenant le stock mis à jour.
   * @throws Une erreur si le stock n'existe pas.
   */
  async update(stock: Stock): Promise<Stock> {
    if (stock.id === undefined) {
      throw new Error("Le stock doit avoir un identifiant pour être mis à jour.");
    }
    const index = this.stocks.findIndex(s => s.id === stock.id);
    if (index === -1) {
      throw new Error(`Stock avec l'id ${stock.id} non trouvé.`);
    }
    this.stocks[index] = stock;
    return stock;
  }

  /**
   * Retourne la liste de tous les stocks enregistrés.
   * @returns Une promesse contenant un tableau de Stock.
   */
  async findAll(): Promise<Stock[]> {
    return this.stocks;
  }
}
