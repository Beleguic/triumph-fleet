// src/application/use-cases/EnregistrerPanneUseCase.ts

import { Panne } from '../../domain/entities/Panne';
import { IPanneRepository } from '../ports/IPanneRepository';
import { IMotoRepository } from '../ports/IMotoRepository';
import { IEntretienRepository } from '../ports/IEntretienRepository';

/**
 * DTO d'entrée pour enregistrer une panne.
 * 
 * Au moins une des associations (entretienId ou motoId) doit être fournie.
 */
export interface EnregistrerPanneInput {
  /**
   * Optionnel : L'identifiant de l'entretien associé à la panne.
   */
  entretienId?: number;
  /**
   * Optionnel : L'identifiant de la moto concernée par la panne.
   */
  motoId?: number;
  /**
   * Date de survenue de la panne.
   */
  dateEvent: Date;
  /**
   * Description de la panne (détails de la défaillance ou de la réparation à effectuer).
   */
  description: string;
  /**
   * Coût associé à la panne (réparation, pièces, etc.).
   */
  cout: number;
  /**
   * Indique si la panne est couverte par la garantie.
   */
  sousGarantie?: boolean;
}

/**
 * DTO de sortie pour renvoyer la panne enregistrée.
 */
export interface EnregistrerPanneOutput {
  panne: Panne;
}

// src/application/use-cases/EnregistrerPanneUseCase.ts



export class EnregistrerPanneUseCase {
  constructor(
    private readonly panneRepository: IPanneRepository,
    private readonly motoRepository: IMotoRepository,
    private readonly entretienRepository: IEntretienRepository
  ) {}

  public async execute(input: EnregistrerPanneInput): Promise<EnregistrerPanneOutput> {
    // Vérifier qu'au moins une association (entretien ou moto) est fournie.
    if (!input.entretienId && !input.motoId) {
      throw new Error("La panne doit être associée soit à un entretien, soit à une moto.");
    }

    let associatedEntretien = undefined;
    let associatedMoto = undefined;

    // Si un identifiant d'entretien est fourni, le récupérer depuis le repository d'entretien.
    if (input.entretienId) {
      associatedEntretien = await this.entretienRepository.findById(input.entretienId);
      if (!associatedEntretien) {
        throw new Error(`Entretien avec l'id ${input.entretienId} non trouvé.`);
      }
    }

    // Si un identifiant de moto est fourni, le récupérer depuis le repository de moto.
    if (input.motoId) {
      associatedMoto = await this.motoRepository.findById(input.motoId);
      if (!associatedMoto) {
        throw new Error(`Moto avec l'id ${input.motoId} non trouvée.`);
      }
    }

    // Création de l'entité Panne en passant l'entretien ou la moto associée.
    const panne = new Panne({
      moto: associatedMoto,
      entretien: associatedEntretien,
      dateEvent: input.dateEvent,
      description: input.description,
      cout: input.cout,
      sousGarantie: input.sousGarantie ?? false
    });

    // Sauvegarde de la panne via le repository.
    const savedPanne = await this.panneRepository.save(panne);

    return { panne: savedPanne };
  }
}

