// src/application/use-cases/ConsulterHistoriqueCommandesUseCase.ts

import { ICommandePieceRepository } from '../ports/ICommandePieceRepository';
import { CommandePiece } from '../../domain/entities/CommandePiece';

/**
 * DTO d'entrée pour consulter l'historique des commandes de pièces.
 * Il peut inclure des paramètres optionnels comme l'identifiant d'une pièce pour filtrer par pièce.
 */
export interface ConsulterHistoriqueCommandesInput {
  pieceId?: number; // Optionnel : identifiant de la pièce pour filtrer les commandes.
}

/**
 * DTO de sortie pour renvoyer l'historique des commandes de pièces.
 */
export interface ConsulterHistoriqueCommandesOutput {
  commandes: CommandePiece[];
}

// src/application/use-cases/ConsulterHistoriqueCommandesUseCase.ts



export class ConsulterHistoriqueCommandesUseCase {
  constructor(
    private readonly commandePieceRepository: ICommandePieceRepository
  ) {}

  public async execute(input: ConsulterHistoriqueCommandesInput): Promise<ConsulterHistoriqueCommandesOutput> {
    let commandes;

    if (input.pieceId) {
      // Si un identifiant de pièce est fourni, filtrer les commandes par cette pièce
      commandes = await this.commandePieceRepository.findByPieceId(input.pieceId);
    } else {
      // Sinon, récupérer toutes les commandes
      commandes = await this.commandePieceRepository.findAll();
    }

    return { commandes };
  }
}
