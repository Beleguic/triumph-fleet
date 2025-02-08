// src/application/use-cases/PlanifierEntretienUseCase.ts

import { Moto } from '../../domain/entities/Moto';
import { Entretien } from '../../domain/entities/Entretien';
import { IMotoRepository } from '../ports/IMotoRepository';
import { IEntretienRepository } from '../ports/IEntretienRepository';

/**
 * Interface décrivant les données d'entrée pour planifier un entretien.
 */
export interface PlanifierEntretienInput {
  motoId: number;
  typeEntretien: string; // "préventif" ou "curatif"
  /**
   * Optionnel : Si fourni, la date de l'entretien sera utilisée (obligatoire pour un entretien curatif).
   */
  datePlanifiee?: Date;
  /**
   * Optionnel : Si fourni, le kilométrage prévu lors de l'entretien.
   * Pour un entretien curatif, ce champ est requis.
   */
  kilometrage?: number;
}

/**
 * Interface décrivant les données de sortie du use case.
 */
export interface PlanifierEntretienOutput {
  entretien: Entretien;
}


// src/application/use-cases/PlanifierEntretienUseCase.ts

export class PlanifierEntretienUseCase {
    constructor(
      private readonly motoRepository: IMotoRepository,
      private readonly entretienRepository: IEntretienRepository
    ) {}
  
    public async execute(input: PlanifierEntretienInput): Promise<PlanifierEntretienOutput> {
      // Récupérer la moto concernée à partir de son identifiant
      const moto: Moto | null = await this.motoRepository.findById(input.motoId);
      if (!moto) {
        throw new Error(`Moto avec l'id ${input.motoId} non trouvée.`);
      }
  
      let datePlanifiee: Date;
      let kilometrage: number;
  
      // Si l'entretien est de type curatif, la date et le kilométrage doivent être fournis manuellement.
      if (input.typeEntretien.toLowerCase() === 'curatif') {
        if (!input.datePlanifiee) {
          throw new Error("La date d'entretien est obligatoire pour un entretien curatif.");
        }
        if (input.kilometrage === undefined) {
          throw new Error("Le kilométrage est obligatoire pour un entretien curatif.");
        }
        datePlanifiee = input.datePlanifiee;
        kilometrage = input.kilometrage;
      } else {
        // Pour un entretien préventif, on peut utiliser les intervalles définis dans le modèle.
        // Si aucune date n'est fournie, on calcule la date prévue en ajoutant l'intervalle en années.
        datePlanifiee = input.datePlanifiee ?? new Date();
        if (!input.datePlanifiee) {
          datePlanifiee.setFullYear(datePlanifiee.getFullYear() + moto.modele.intervalleAnnees);
        }
        // Calcul du kilométrage prévu : actuel + intervalle défini par le modèle
        kilometrage = input.kilometrage ?? (moto.kilometrageActuel + moto.modele.intervalleKm);
      }
  
      // Création de l'entité Entretien avec les valeurs calculées.
      const entretien = new Entretien({
        moto: moto,
        typeEntretien: input.typeEntretien,
        datePlanifiee: datePlanifiee,
        // Pour une planification, le kilométrage prévu est renseigné.
        kilometrage: kilometrage,
        // Pour l'instant, le coût et la description sont initialisés par défaut
        cout: 0,
        description: 'Entretien planifié'
      });
  
      // Sauvegarder l'entretien via le repository
      const savedEntretien = await this.entretienRepository.save(entretien);
  
      return { entretien: savedEntretien };
    }
  }
  
