import { IStockRepository } from './../../../../application/ports/IStockRepository';
import { Stock } from './../../../../domain/entities/Stock';

/**
 * Implémentation en mémoire du repository pour l'entité Stock avec un Singleton et une `Map`.
 */
export class InMemoryStockRepository implements IStockRepository {
  private static instance: InMemoryStockRepository;
  private stocks: Map<number, Stock> = new Map(); // Utilisation de Map pour stocker les stocks
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryStockRepository {
    if (!InMemoryStockRepository.instance) {
      InMemoryStockRepository.instance = new InMemoryStockRepository();
    }
    return InMemoryStockRepository.instance;
  }

  /**
   * Recherche un stock par son identifiant.
   * @param id L'identifiant du stock.
   * @returns Une promesse contenant le stock trouvé ou null s'il n'existe pas.
   */
  async findById(id: number): Promise<Stock | null> {
    return this.stocks.get(id) || null;
  }

  /**
   * Recherche le stock associé à une pièce via l'identifiant de la pièce.
   * @param pieceId L'identifiant de la pièce.
   * @returns Une promesse contenant le stock lié à la pièce ou null si aucun stock n'est trouvé.
   */
  async findByPieceId(pieceId: number): Promise<Stock | null> {
    return Array.from(this.stocks.values()).find(s => s.piece.id === pieceId) || null;
  }

  /**
   * Enregistre (ou met à jour) un stock.
   * Si le stock n'a pas d'identifiant, un nouvel identifiant est généré.
   * @param stock L'instance de Stock à enregistrer.
   * @returns Une promesse contenant le stock enregistré.
   */
  async save(stock: Stock): Promise<Stock> {
    const id = stock.id ?? ++this.lastId; // Garantir un ID unique

    stock = new Stock({
      id,
      piece: stock.piece, // La pièce détachée associée
      quantite: stock.quantite, // Quantité en stock
      seuilAlerte: stock.seuilAlerte, // Seuil d'alerte (optionnel)
    });

    this.stocks.set(id, stock); // Ajout ou mise à jour dans la Map
    return stock;
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
    if (!this.stocks.has(stock.id)) {
      throw new Error(`Stock avec l'ID ${stock.id} non trouvé.`);
    }
    this.stocks.set(stock.id, stock);
    return stock;
  }

  /**
   * Retourne la liste de tous les stocks enregistrés.
   * @returns Une promesse contenant un tableau de Stock.
   */
  async findAll(): Promise<Stock[]> {
    return Array.from(this.stocks.values());
  }

  /**
   * Supprime un stock par son identifiant.
   * @param id L'identifiant du stock à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  async delete(id: number): Promise<boolean> {
    if (!this.stocks.has(id)) {
      return false;
    }
    this.stocks.delete(id);
    return true;
  }
}
