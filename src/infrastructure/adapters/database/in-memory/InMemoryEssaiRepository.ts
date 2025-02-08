// src/infrastructure/adapters/database/in-memory/InMemoryEssaiRepository.ts

import { IEssaiRepository } from '../../../application/ports/IEssaiRepository';
import { Essai } from '../../../domain/entities/Essai';

/**
 * Implémentation en mémoire du repository pour l'entité Essai.
 */
export class InMemoryEssaiRepository implements IEssaiRepository {
  // Stock interne pour les essais
  private essais: Essai[] = [];

  /**
   * Recherche un essai par son identifiant.
   * @param id L'identifiant de l'essai.
   * @returns Une promesse contenant l'essai trouvé ou null si aucun essai n'est trouvé.
   */
  async findById(id: number): Promise<Essai | null> {
    const essai = this.essais.find(e => e.id === id);
    return essai || null;
  }

  /**
   * Enregistre (ou met à jour) un essai.
   * Si l'essai n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param essai L'instance d'Essai à enregistrer.
   * @returns Une promesse contenant l'essai enregistré.
   */
  async save(essai: Essai): Promise<Essai> {
    if (essai.id === undefined) {
      // Génération d'un nouvel identifiant basé sur le maximum des identifiants existants.
      const newId =
        this.essais.length > 0 ? Math.max(...this.essais.map(e => e.id || 0)) + 1 : 1;
      // Contournement de la propriété privée en lecture seule (_id) avec un cast en any.
      (essai as any)._id = newId;
      this.essais.push(essai);
      return essai;
    } else {
      // Si l'essai existe déjà, on le met à jour ou on l'ajoute si il n'existe pas
      const index = this.essais.findIndex(e => e.id === essai.id);
      if (index !== -1) {
        this.essais[index] = essai;
      } else {
        this.essais.push(essai);
      }
      return essai;
    }
  }

  /**
   * Met à jour un essai existant.
   * @param essai L'instance d'Essai à mettre à jour.
   * @returns Une promesse contenant l'essai mis à jour.
   * @throws Une erreur si l'essai n'existe pas.
   */
  async update(essai: Essai): Promise<Essai> {
    if (essai.id === undefined) {
      throw new Error("L'essai doit avoir un identifiant pour être mis à jour.");
    }
    const index = this.essais.findIndex(e => e.id === essai.id);
    if (index === -1) {
      throw new Error(`Essai avec l'id ${essai.id} non trouvé.`);
    }
    this.essais[index] = essai;
    return essai;
  }

  /**
   * Retourne la liste de tous les essais enregistrés.
   * @returns Une promesse contenant un tableau d'Essai.
   */
  async findAll(): Promise<Essai[]> {
    return this.essais;
  }
}
