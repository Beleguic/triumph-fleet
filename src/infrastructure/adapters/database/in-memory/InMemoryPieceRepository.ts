import { IPieceRepository } from './../../../../application/ports/IPieceRepository';
import { Piece } from './../../../../domain/entities/Piece';

/**
 * Implémentation en mémoire du repository pour l'entité Piece avec un Singleton et une `Map`.
 */
export class InMemoryPieceRepository implements IPieceRepository {
  private static instance: InMemoryPieceRepository;
  private pieces: Map<number, Piece> = new Map(); // Utilisation de Map pour stocker les pièces
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryPieceRepository {
    if (!InMemoryPieceRepository.instance) {
      InMemoryPieceRepository.instance = new InMemoryPieceRepository();
    }
    return InMemoryPieceRepository.instance;
  }

  /**
   * Recherche une pièce par son identifiant.
   * @param id L'identifiant de la pièce.
   * @returns Une promesse contenant la pièce trouvée ou null si aucune pièce n'est trouvée.
   */
  async findById(id: number): Promise<Piece | null> {
    return this.pieces.get(id) || null;
  }

  /**
   * Enregistre (ou met à jour) une pièce.
   * Si la pièce n'a pas d'identifiant, un nouvel identifiant est généré.
   * @param piece L'instance de Piece à enregistrer.
   * @returns Une promesse contenant la pièce enregistrée.
   */
  async save(piece: Piece): Promise<Piece> {
    const id = piece.id ?? ++this.lastId; // Garantir un ID unique

    piece = new Piece({
      id,
      nom: piece.nom,
      description: piece.description,
      prix: piece.prix,
    });

    this.pieces.set(id, piece); // Ajout ou mise à jour dans la Map
    return piece;
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
    if (!this.pieces.has(piece.id)) {
      throw new Error(`Pièce avec l'ID ${piece.id} non trouvée.`);
    }
    this.pieces.set(piece.id, piece);
    return piece;
  }

  /**
   * Retourne la liste de toutes les pièces enregistrées.
   * @returns Une promesse contenant un tableau de Piece.
   */
  async findAll(): Promise<Piece[]> {
    return Array.from(this.pieces.values());
  }

  /**
   * Supprime une pièce par son identifiant.
   * @param id L'identifiant de la pièce à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  async delete(id: number): Promise<boolean> {
    if (!this.pieces.has(id)) {
      return false;
    }
    this.pieces.delete(id);
    return true;
  }
}
