import { IIncidentRepository } from '../ports/IIncidentRepository';
import { IEssaiRepository } from '../ports/IEssaiRepository';
import { IConducteurRepository } from '../ports/IConducteurRepository';
import { IMotoRepository } from '../ports/IMotoRepository';
import { Incident } from '../../domain/entities/Incident';

/**
 * DTO d'entrée pour enregistrer un incident.
 * Ce DTO contient les informations nécessaires pour enregistrer l'incident.
 */
export interface EnregistrerIncidentInput {
  essaiId?: number;           // Optionnel : Identifiant de l'essai associé à l'incident
  conducteurId?: number;      // Optionnel : Identifiant du conducteur concerné par l'incident
  motoId?: number;            // Optionnel : Identifiant de la moto concernée par l'incident
  dateIncident: Date;         // Date de survenue de l'incident
  description: string;        // Description de l'incident (accident, infraction, etc.)
  severite: string;           // Sévérité de l'incident (ex. "faible", "moyenne", "élevée")
}

/**
 * DTO de sortie renvoyant l'incident enregistré.
 */
export interface EnregistrerIncidentOutput {
  incident: Incident;
}

/**
 * Use Case pour enregistrer un incident.
 */
export class EnregistrerIncidentUseCase {
  constructor(
    private readonly incidentRepository: IIncidentRepository,
    private readonly essaiRepository: IEssaiRepository,
    private readonly conducteurRepository: IConducteurRepository,
    private readonly motoRepository: IMotoRepository
  ) {}

  /**
   * Exécute le use case pour enregistrer un incident.
   * @param input Données d'entrée contenant les informations de l'incident.
   * @returns L'incident enregistré.
   */
  public async execute(input: EnregistrerIncidentInput): Promise<EnregistrerIncidentOutput> {
    let associatedEssai = undefined;
    let associatedConducteur = undefined;
    let associatedMoto = undefined;

    // Vérifier si un essai est associé et le récupérer si nécessaire
    if (input.essaiId) {
      associatedEssai = await this.essaiRepository.findById(input.essaiId);
      if (!associatedEssai) {
        throw new Error(`Essai avec l'id ${input.essaiId} non trouvé.`);
      }
    }

    // Vérifier si un conducteur est associé et le récupérer si nécessaire
    if (input.conducteurId) {
      associatedConducteur = await this.conducteurRepository.findById(input.conducteurId);
      if (!associatedConducteur) {
        throw new Error(`Conducteur avec l'id ${input.conducteurId} non trouvé.`);
      }
    }

    // Vérifier si une moto est associée et la récupérer si nécessaire
    if (input.motoId) {
      associatedMoto = await this.motoRepository.findById(input.motoId);
      if (!associatedMoto) {
        throw new Error(`Moto avec l'id ${input.motoId} non trouvée.`);
      }
    }

    // Création de l'incident avec les informations fournies
    const incident = new Incident({
      essai: associatedEssai,
      conducteur: associatedConducteur,
      moto: associatedMoto,
      dateIncident: input.dateIncident,
      description: input.description,
      severite: input.severite
    });

    // Sauvegarde de l'incident via le repository
    const savedIncident = await this.incidentRepository.save(incident);

    return { incident: savedIncident };
  }
}
