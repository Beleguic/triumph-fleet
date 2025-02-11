import { IEssaiRepository } from '../ports/IEssaiRepository';
import { IMotoRepository } from '../ports/IMotoRepository';
import { IConducteurRepository } from '../ports/IConducteurRepository';
import { Essai } from '../../domain/entities/Essai';

/**
 * DTO d'entrée pour planifier un essai de moto.
 */
export interface PlanifierEssaiMotoInput {
  motoId: number;             // Identifiant de la moto concernée
  conducteurId: number;       // Identifiant du conducteur
  dateDebut: Date;            // Date de début de l'essai
  dateFin: Date;              // Date de fin de l'essai
  kilometrageParcouru: number; // Kilométrage estimé ou à suivre pendant l'essai
}

/**
 * DTO de sortie renvoyant l'essai de moto planifié.
 */
export interface PlanifierEssaiMotoOutput {
  essai: Essai;
}

/**
 * Use Case pour planifier un essai de moto.
 */
export class PlanifierEssaiMotoUseCase {
  constructor(
    private readonly essaiRepository: IEssaiRepository,
    private readonly motoRepository: IMotoRepository,
    private readonly conducteurRepository: IConducteurRepository
  ) {}

  /**
   * Exécute le use case pour planifier un essai.
   * @param input Données d'entrée contenant les informations pour l'essai.
   * @returns L'essai planifié.
   */
  public async execute(input: PlanifierEssaiMotoInput): Promise<PlanifierEssaiMotoOutput> {
    // Vérification de l'existence de la moto
    const moto = await this.motoRepository.findById(input.motoId);
    if (!moto) {
      throw new Error(`Moto avec l'id ${input.motoId} non trouvée.`);
    }

    // Vérification de l'existence du conducteur
    const conducteur = await this.conducteurRepository.findById(input.conducteurId);
    if (!conducteur) {
      throw new Error(`Conducteur avec l'id ${input.conducteurId} non trouvé.`);
    }

    // Création de l'essai avec les informations fournies
    const essai = new Essai({
      moto: moto,
      conducteur: conducteur,
      dateDebut: input.dateDebut,
      dateFin: input.dateFin,
      kilometrageParcouru: input.kilometrageParcouru
    });

    // Sauvegarde de l'essai via le repository
    const savedEssai = await this.essaiRepository.save(essai);

    return { essai: savedEssai };
  }
}
