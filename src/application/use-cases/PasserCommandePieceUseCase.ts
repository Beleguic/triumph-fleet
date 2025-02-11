import { ICommandePieceRepository } from '../ports/ICommandePieceRepository';
import { IPieceRepository } from '../ports/IPieceRepository';
import { CommandePiece } from '../../domain/entities/CommandePiece';

/**
 * DTO d'entrée pour passer une commande de pièces détachées.
 */
export interface PasserCommandePieceInput {
  pieceId: number;         // Identifiant de la pièce commandée
  dateCommande: Date;      // Date à laquelle la commande est passée
  quantite: number;        // Quantité commandée
  cout: number;            // Coût total de la commande
  delaiLivraison?: number; // Délai de livraison en jours (optionnel)
  statut: string;          // Statut de la commande (ex. "en cours", "livrée")
}

/**
 * DTO de sortie renvoyant la commande passée.
 */
export interface PasserCommandePieceOutput {
  commande: CommandePiece;
}

/**
 * Use Case pour passer une commande de pièces détachées.
 */
export class PasserCommandePieceUseCase {
  constructor(
    private readonly pieceRepository: IPieceRepository,
    private readonly commandePieceRepository: ICommandePieceRepository
  ) {}

  /**
   * Exécute le use case pour passer une commande de pièce.
   * @param input Données d'entrée contenant les informations de la commande.
   * @returns La commande enregistrée.
   */
  public async execute(input: PasserCommandePieceInput): Promise<PasserCommandePieceOutput> {
    // Récupération de la pièce commandée
    const piece = await this.pieceRepository.findById(input.pieceId);
    if (!piece) {
      throw new Error(`Pièce avec l'id ${input.pieceId} non trouvée.`);
    }

    // Création d'une nouvelle commande en utilisant les données d'entrée
    const commande = new CommandePiece({
      piece: piece,
      dateCommande: input.dateCommande,
      quantite: input.quantite,
      cout: input.cout,
      delaiLivraison: input.delaiLivraison, // Peut être undefined si non renseigné
      statut: input.statut
    });

    // Sauvegarde de la commande via le repository dédié
    const savedCommande = await this.commandePieceRepository.save(commande);

    return { commande: savedCommande };
  }
}
