import { Stock } from '../../domain/entities/Stock';
import { IStockRepository } from '../ports/IStockRepository';
import { IPieceRepository } from '../ports/IPieceRepository';

/**
 * DTO d'entrée pour gérer (créer ou mettre à jour) le stock d'une pièce.
 */
export interface GererStockPiecesInput {
  pieceId: number;  // Identifiant de la pièce détachée concernée.
  quantite: number;  // Quantité à enregistrer pour cette pièce.
  seuilAlerte?: number;  // Optionnel : Seuil d'alerte pour le stock.
}

/**
 * DTO de sortie renvoyant le stock mis à jour ou créé.
 */
export interface GererStockPiecesOutput {
  stock: Stock;
}

/**
 * Use Case pour gérer le stock des pièces détachées.
 */
export class GererStockPiecesUseCase {
  constructor(
    private readonly stockRepository: IStockRepository,
    private readonly pieceRepository: IPieceRepository
  ) {}

  /**
   * Exécute le use case pour créer ou mettre à jour le stock d'une pièce.
   * @param input Données d'entrée contenant les informations sur le stock.
   * @returns Le stock mis à jour ou créé.
   */
  public async execute(input: GererStockPiecesInput): Promise<GererStockPiecesOutput> {
    // Vérifier que la pièce existe
    const piece = await this.pieceRepository.findById(input.pieceId);
    if (!piece) {
      throw new Error(`La pièce avec l'id ${input.pieceId} est introuvable.`);
    }

    // Vérifier si un stock existe déjà pour cette pièce
    let stock = await this.stockRepository.findByPieceId(input.pieceId);
    
    if (stock) {
      // Mise à jour du stock existant
      stock.quantite = input.quantite;
      if (input.seuilAlerte !== undefined) {
        stock.seuilAlerte = input.seuilAlerte;
      }
      stock = await this.stockRepository.update(stock);
    } else {
      // Création d'un nouveau stock pour la pièce
      stock = new Stock({
        piece: piece,
        quantite: input.quantite,
        seuilAlerte: input.seuilAlerte !== undefined ? input.seuilAlerte : 0
      });
      stock = await this.stockRepository.save(stock);
    }

    return { stock };
  }
}
