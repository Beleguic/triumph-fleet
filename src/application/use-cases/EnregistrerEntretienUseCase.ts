import { Entretien } from '../../domain/entities/Entretien';
import { IEntretienRepository } from '../ports/IEntretienRepository';

/**
 * DTO d'entrée pour enregistrer un entretien réalisé.
 */
export interface EnregistrerEntretienInput {
  entretienId: number;     // Identifiant de l'entretien planifié
  dateRealisee: Date;      // Date effective de réalisation de l'entretien
  cout: number;            // Coût réel de l'entretien
  description: string;     // Détails ou recommandations suite à l'entretien
  kilometrage?: number;    // Optionnel : le kilométrage relevé lors de l'entretien
}

/**
 * DTO de sortie contenant l'entretien mis à jour.
 */
export interface EnregistrerEntretienOutput {
  entretien: Entretien;
}

/**
 * Use Case pour enregistrer un entretien réalisé.
 */
export class EnregistrerEntretienUseCase {
  constructor(private readonly entretienRepository: IEntretienRepository) {}

  /**
   * Exécute le use case pour enregistrer un entretien réalisé.
   * @param input Données d'entrée contenant les détails de l'entretien.
   * @returns L'entretien mis à jour.
   */
  public async execute(input: EnregistrerEntretienInput): Promise<EnregistrerEntretienOutput> {
    // Récupération de l'entretien existant à partir de son identifiant
    const entretien = await this.entretienRepository.findById(input.entretienId);
    if (!entretien) {
      throw new Error(`Entretien avec l'id ${input.entretienId} non trouvé.`);
    }

    // Mise à jour des informations pour indiquer que l'entretien a été réalisé
    entretien.dateRealisee = input.dateRealisee;
    entretien.cout = input.cout;
    entretien.description = input.description;

    // Optionnel : mise à jour du kilométrage si une valeur est fournie
    if (input.kilometrage !== undefined) {
      entretien.kilometrage = input.kilometrage;
    }

    // Sauvegarde de l'entretien mis à jour dans le repository
    const entretienMisAJour = await this.entretienRepository.update(entretien);

    return { entretien: entretienMisAJour };
  }
}
