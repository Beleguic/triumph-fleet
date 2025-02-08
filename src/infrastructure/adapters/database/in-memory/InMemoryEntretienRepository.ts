// src/infrastructure/adapters/database/in-memory/InMemoryEntretienRepository.ts

import { IEntretienRepository } from '../../../application/ports/IEntretienRepository';
import { Entretien } from '../../../domain/entities/Entretien';

/**
 * Implémentation en mémoire du repository pour l'entité Entretien.
 */
export class InMemoryEntretienRepository implements IEntretienRepository {
  // Stock interne des entretiens
  private entretiens: Entretien[] = [];

  /**
   * Recherche un entretien par son identifiant.
   * @param id Identifiant de l'entretien.
   * @returns Une promesse contenant l'entretien trouvé ou null s'il n'est pas trouvé.
   */
  async findById(id: number): Promise<Entretien | null> {
    const entretien = this.entretiens.find(e => e.id === id);
    return entretien || null;
  }

  /**
   * Enregistre (ou met à jour) un entretien dans le repository.
   * Si l'entretien n'a pas d'identifiant, un nouvel identifiant est généré.
   * @param entretien L'instance d'Entretien à enregistrer.
   * @returns L'entretien enregistré.
   */
  async save(entretien: Entretien): Promise<Entretien> {
    if (entretien.id === undefined) {
      // Génération d'un nouvel identifiant
      const newId =
        this.entretiens.length > 0 ? Math.max(...this.entretiens.map(e => e.id || 0)) + 1 : 1;
      // Contournement de la propriété privée en lecture seule (pour l'in-memory)
      (entretien as any)._id = newId;
      this.entretiens.push(entretien);
      return entretien;
    } else {
      // Si l'entretien existe déjà, on le met à jour
      const index = this.entretiens.findIndex(e => e.id === entretien.id);
      if (index !== -1) {
        this.entretiens[index] = entretien;
      } else {
        this.entretiens.push(entretien);
      }
      return entretien;
    }
  }

  /**
   * Met à jour un entretien existant dans le repository.
   * @param entretien L'instance d'Entretien à mettre à jour.
   * @returns L'entretien mis à jour.
   * @throws Une erreur si l'entretien n'existe pas.
   */
  async update(entretien: Entretien): Promise<Entretien> {
    if (entretien.id === undefined) {
      throw new Error("L'entretien doit avoir un identifiant pour être mis à jour.");
    }
    const index = this.entretiens.findIndex(e => e.id === entretien.id);
    if (index === -1) {
      throw new Error(`Entretien avec l'id ${entretien.id} non trouvé.`);
    }
    this.entretiens[index] = entretien;
    return entretien;
  }

  /**
   * Retourne la liste de tous les entretiens enregistrés.
   * @returns Un tableau d'Entretien.
   */
  async findAll(): Promise<Entretien[]> {
    return this.entretiens;
  }
}
