// src/application/use-cases/GererStockPiecesUseCase.ts

import { Stock } from '../../domain/entities/Stock';
import { IPieceRepository } from '../ports/IPieceRepository';
import { IStockRepository } from '../ports/IStockRepository';

/**
 * DTO d'entrée pour gérer (créer ou mettre à jour) le stock d'une pièce.
 */
export interface GererStockPiecesInput {
  /**
   * Identifiant de la pièce détachée concernée.
   */
  pieceId: number;
  /**
   * Quantité à enregistrer pour cette pièce.
   */
  quantite: number;
  /**
   * Optionnel : Seuil d'alerte pour le stock. Si non renseigné, le seuil sera fixé par défaut à 0.
   */
  seuilAlerte?: number;
}

/**
 * DTO de sortie renvoyant le stock mis à jour ou créé.
 */
export interface GererStockPiecesOutput {
  stock: Stock;
}

// src/application/use-cases/GererStockPiecesUseCase.ts



export class GererStockPiecesUseCase {
  constructor(
    private readonly stockRepository: IStockRepository,
    private readonly pieceRepository: IPieceRepository
  ) {}

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
