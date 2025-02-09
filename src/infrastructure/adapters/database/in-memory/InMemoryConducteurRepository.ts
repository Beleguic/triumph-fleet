// src/infrastructure/adapters/database/in-memory/InMemoryConducteurRepository.ts

import { IConducteurRepository } from './../../../../application/ports/IConducteurRepository';
import { Conducteur } from './../../../../domain/entities/Conducteur';

/**
 * Implémentation en mémoire du repository pour l'entité Conducteur.
 */
export class InMemoryConducteurRepository implements IConducteurRepository {
  // Stock interne pour les conducteurs
  private conducteurs: Conducteur[] = [];

  /**
   * Recherche un conducteur par son identifiant.
   * @param id L'identifiant du conducteur.
   * @returns Une promesse contenant le conducteur trouvé ou null si non trouvé.
   */
  async findById(id: number): Promise<Conducteur | null> {
    const conducteur = this.conducteurs.find(c => c.id === id);
    return conducteur || null;
  }

  /**
   * Enregistre (ou met à jour) un conducteur.
   * Si le conducteur n'a pas d'identifiant, un nouvel identifiant est généré.
   * @param conducteur L'instance de Conducteur à enregistrer.
   * @returns Une promesse contenant le conducteur enregistré.
   */
  async save(conducteur: Conducteur): Promise<Conducteur> {
    if (conducteur.id === undefined) {
      // Génération d'un nouvel identifiant basé sur le maximum des identifiants existants.
      const newId =
        this.conducteurs.length > 0 ? Math.max(...this.conducteurs.map(c => c.id || 0)) + 1 : 1;
      // Pour contourner la propriété privée readonly (_id) avec un cast en any.
      (conducteur as any)._id = newId;
      this.conducteurs.push(conducteur);
      return conducteur;
    } else {
      // Si le conducteur possède déjà un identifiant, on le met à jour ou on l'ajoute s'il n'existe pas.
      const index = this.conducteurs.findIndex(c => c.id === conducteur.id);
      if (index !== -1) {
        this.conducteurs[index] = conducteur;
      } else {
        this.conducteurs.push(conducteur);
      }
      return conducteur;
    }
  }

  /**
   * Met à jour un conducteur existant.
   * @param conducteur L'instance de Conducteur à mettre à jour.
   * @returns Une promesse contenant le conducteur mis à jour.
   * @throws Une erreur si le conducteur n'existe pas.
   */
  async update(conducteur: Conducteur): Promise<Conducteur> {
    if (conducteur.id === undefined) {
      throw new Error("Le conducteur doit avoir un identifiant pour être mis à jour.");
    }
    const index = this.conducteurs.findIndex(c => c.id === conducteur.id);
    if (index === -1) {
      throw new Error(`Conducteur avec l'id ${conducteur.id} non trouvé.`);
    }
    this.conducteurs[index] = conducteur;
    return conducteur;
  }

  /**
   * Retourne la liste de tous les conducteurs enregistrés.
   * @returns Une promesse contenant un tableau de Conducteur.
   */
  async findAll(): Promise<Conducteur[]> {
    return this.conducteurs;
  }
}
