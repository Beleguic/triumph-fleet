// src/infrastructure/adapters/database/in-memory/InMemoryPanneRepository.ts

import { IPanneRepository } from './../../../../application/ports/IPanneRepository';
import { Panne } from './../../../../domain/entities/Panne';

/**
 * Implémentation en mémoire du repository pour l'entité Panne.
 */
export class InMemoryPanneRepository implements IPanneRepository {
  // Stock interne pour les instances de Panne
  private pannes: Panne[] = [];

  /**
   * Recherche une panne par son identifiant.
   * @param id L'identifiant de la panne.
   * @returns Une promesse contenant la panne trouvée ou null si aucune panne n'est trouvée.
   */
  async findById(id: number): Promise<Panne | null> {
    const panne = this.pannes.find(p => p.id === id);
    return panne || null;
  }

  /**
   * Enregistre (ou met à jour) une panne.
   * Si la panne n'a pas d'identifiant, un nouvel identifiant est généré.
   * @param panne L'instance de Panne à enregistrer.
   * @returns Une promesse contenant la panne enregistrée.
   */
  async save(panne: Panne): Promise<Panne> {
    if (panne.id === undefined) {
      // Génération d'un nouvel identifiant basé sur le maximum des identifiants existants.
      const newId =
        this.pannes.length > 0 ? Math.max(...this.pannes.map(p => p.id || 0)) + 1 : 1;
      // Pour contourner la propriété privée readonly (_id), on utilise un cast en any.
      (panne as any)._id = newId;
      this.pannes.push(panne);
      return panne;
    } else {
      // Si l'entité possède déjà un identifiant, on la met à jour ou on l'ajoute si elle n'existe pas encore.
      const index = this.pannes.findIndex(p => p.id === panne.id);
      if (index !== -1) {
        this.pannes[index] = panne;
      } else {
        this.pannes.push(panne);
      }
      return panne;
    }
  }

  /**
   * Met à jour une panne existante.
   * @param panne L'instance de Panne à mettre à jour.
   * @returns Une promesse contenant la panne mise à jour.
   * @throws Une erreur si la panne n'existe pas.
   */
  async update(panne: Panne): Promise<Panne> {
    if (panne.id === undefined) {
      throw new Error("La panne doit avoir un identifiant pour être mise à jour.");
    }
    const index = this.pannes.findIndex(p => p.id === panne.id);
    if (index === -1) {
      throw new Error(`Panne avec l'id ${panne.id} non trouvée.`);
    }
    this.pannes[index] = panne;
    return panne;
  }

  /**
   * Retourne la liste de toutes les pannes enregistrées.
   * @returns Une promesse contenant un tableau de Panne.
   */
  async findAll(): Promise<Panne[]> {
    return this.pannes;
  }
}
