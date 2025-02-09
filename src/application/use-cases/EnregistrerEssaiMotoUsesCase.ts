// src/application/use-cases/EnregistrerEssaiMotoUseCase.ts

import { Essai } from '../../domain/entities/Essai';
import { IEssaiRepository } from '../ports/IEssaiRepository';

/**
 * DTO d'entrée pour enregistrer un essai terminé.
 * Ce DTO contient les données à fournir pour enregistrer les résultats de l'essai.
 */
export interface EnregistrerEssaiMotoInput {
  essaiId: number;              // Identifiant de l'essai
  dateFin: Date;                // Date de fin de l'essai
  kilometrageParcouru: number;  // Kilométrage parcouru pendant l'essai
}

/**
 * DTO de sortie renvoyant l'essai mis à jour avec les résultats enregistrés.
 */
export interface EnregistrerEssaiMotoOutput {
  essai: Essai;
}

// src/application/use-cases/EnregistrerEssaiMotoUseCase.ts



export class EnregistrerEssaiMotoUseCase {
  constructor(
    private readonly essaiRepository: IEssaiRepository
  ) {}

  /**
   * Exécute le use case pour enregistrer un essai terminé.
   * @param input Données d'entrée contenant les résultats de l'essai.
   * @returns L'essai mis à jour avec les résultats enregistrés.
   */
  public async execute(input: EnregistrerEssaiMotoInput): Promise<EnregistrerEssaiMotoOutput> {
    // Récupération de l'essai via son identifiant
    const essai = await this.essaiRepository.findById(input.essaiId);
    if (!essai) {
      throw new Error(`Essai avec l'id ${input.essaiId} non trouvé.`);
    }

    // Mise à jour de l'essai avec les données de fin et le kilométrage parcouru
    essai.dateFin = input.dateFin;
    essai.kilometrageParcouru = input.kilometrageParcouru;

    // Sauvegarde de l'essai mis à jour dans le repository
    const updatedEssai = await this.essaiRepository.update(essai);

    return { essai: updatedEssai };
  }
}
