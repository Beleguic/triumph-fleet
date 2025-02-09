// src/infrastructure/adapters/database/in-memory/InMemoryMotoRepository.ts

import { IMotoRepository } from './../../../../application/ports/IMotoRepository';
import { Moto } from './../../../../domain/entities/Moto';

/**
 * Implémentation en mémoire du repository pour l'entité Moto.
 */
export class InMemoryMotoRepository implements IMotoRepository {
  // Stock interne des motos
  private motos: Moto[] = [];

  /**
   * Recherche une moto par son identifiant.
   * @param id Identifiant de la moto.
   * @returns Une promesse contenant la moto trouvée ou null si non trouvée.
   */
  async findById(id: number): Promise<Moto | null> {
    const moto = this.motos.find(m => m.id === id);
    return moto || null;
  }

  /**
   * Enregistre (ou met à jour) une moto dans le repository.
   * Si la moto n'a pas d'identifiant, un nouvel identifiant est généré.
   * @param moto L'instance de Moto à enregistrer.
   * @returns La moto enregistrée.
   */
  async save(moto: Moto): Promise<Moto> {
    if (moto.id === undefined) {
      // Génération d'un nouvel identifiant
      const newId =
        this.motos.length > 0 ? Math.max(...this.motos.map(m => m.id || 0)) + 1 : 1;
      // Puisque l'attribut _id est privé et readonly,
      // nous simulons l'assignation en contournant la protection (uniquement pour l'in-memory)
      (moto as any)._id = newId;
      this.motos.push(moto);
      return moto;
    } else {
      // Si la moto existe déjà, on la met à jour
      const index = this.motos.findIndex(m => m.id === moto.id);
      if (index !== -1) {
        this.motos[index] = moto;
      } else {
        this.motos.push(moto);
      }
      return moto;
    }
  }

  /**
   * Met à jour une moto existante dans le repository.
   * @param moto L'instance de Moto à mettre à jour.
   * @returns La moto mise à jour.
   * @throws Erreur si la moto n'existe pas.
   */
  async update(moto: Moto): Promise<Moto> {
    if (moto.id === undefined) {
      throw new Error("La moto doit avoir un identifiant pour être mise à jour");
    }
    const index = this.motos.findIndex(m => m.id === moto.id);
    if (index === -1) {
      throw new Error(`Moto avec l'id ${moto.id} non trouvée`);
    }
    this.motos[index] = moto;
    return moto;
  }

  /**
   * Renvoie la liste de toutes les motos enregistrées.
   * @returns Un tableau de Moto.
   */
  async findAll(): Promise<Moto[]> {
    return this.motos;
  }
}
