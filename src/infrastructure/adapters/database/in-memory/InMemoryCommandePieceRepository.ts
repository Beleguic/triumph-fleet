import { ICommandePieceRepository } from './../../../../application/ports/ICommandePieceRepository';
import { CommandePiece } from './../../../../domain/entities/CommandePiece';

/**
 * Implémentation en mémoire du repository pour l'entité CommandePiece avec un Singleton.
 */
export class InMemoryCommandePieceRepository implements ICommandePieceRepository {
  private static instance: InMemoryCommandePieceRepository;
  private commandes: Map<number, CommandePiece> = new Map(); // Utilisation d'une Map pour performance
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryCommandePieceRepository {
    if (!InMemoryCommandePieceRepository.instance) {
      InMemoryCommandePieceRepository.instance = new InMemoryCommandePieceRepository();
    }
    return InMemoryCommandePieceRepository.instance;
  }

  /**
   * Recherche une commande de pièce par son identifiant.
   * @param id L'identifiant de la commande.
   * @returns Une promesse contenant la commande trouvée ou null si aucune commande n'est trouvée.
   */
  async findById(id: number): Promise<CommandePiece | null> {
    return this.commandes.get(id) || null;
  }

  /**
   * Enregistre (ou met à jour) une commande de pièce.
   * Si la commande n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param commande L'instance de CommandePiece à enregistrer.
   * @returns Une promesse contenant la commande enregistrée.
   */
  async save(commande: CommandePiece): Promise<CommandePiece> {
    const id = commande.id ?? ++this.lastId; // Garantir un ID unique

    commande = new CommandePiece({
      id,
      piece: commande.piece,  // La pièce commandée
      dateCommande: commande.dateCommande,  // La date de la commande
      quantite: commande.quantite,  // La quantité commandée
      cout: commande.cout,  // Le coût total de la commande
      delaiLivraison: commande.delaiLivraison,  // Le délai de livraison (optionnel)
      statut: commande.statut  // Le statut de la commande
    });

    this.commandes.set(id, commande); // Ajout ou mise à jour dans la Map
    return commande;
  }

  /**
   * Met à jour une commande de pièce existante.
   * @param commande L'instance de CommandePiece à mettre à jour.
   * @returns Une promesse contenant la commande mise à jour.
   * @throws Une erreur si la commande n'existe pas.
   */
  async update(commande: CommandePiece): Promise<CommandePiece> {
    if (commande.id === undefined || !this.commandes.has(commande.id)) {
      throw new Error(`Commande de pièce avec l'ID ${commande.id} non trouvée.`);
    }
    this.commandes.set(commande.id, commande);
    return commande;
  }

  /**
   * Retourne la liste de toutes les commandes de pièces enregistrées.
   * @returns Une promesse contenant un tableau de CommandePiece.
   */
  async findAll(): Promise<CommandePiece[]> {
    return Array.from(this.commandes.values());
  }

  /**
   * Recherche les commandes passées pour une pièce donnée par son identifiant.
   * @param pieceId L'identifiant de la pièce.
   * @returns Une promesse contenant un tableau de CommandePiece pour cette pièce.
   */
  async findByPieceId(pieceId: number): Promise<CommandePiece[]> {
    return Array.from(this.commandes.values()).filter(c => c.piece.id === pieceId);
  }

  /**
   * Supprime une commande de pièce par son identifiant.
   * @param id L'identifiant de la commande à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  async delete(id: number): Promise<boolean> {
    if (!this.commandes.has(id)) {
      return false;
    }
    this.commandes.delete(id);
    return true;
  }
}
