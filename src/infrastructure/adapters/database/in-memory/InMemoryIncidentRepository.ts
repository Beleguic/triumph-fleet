// src/infrastructure/adapters/database/in-memory/InMemoryIncidentRepository.ts

import { IIncidentRepository } from './../../../../application/ports/IIncidentRepository';
import { Incident } from './../../../../domain/entities/Incident';

/**
 * Implémentation en mémoire du repository pour l'entité Incident.
 */
export class InMemoryIncidentRepository implements IIncidentRepository {
  // Stock interne pour les incidents
  private incidents: Incident[] = [];

  /**
   * Recherche un incident par son identifiant.
   * @param id L'identifiant de l'incident.
   * @returns Une promesse contenant l'incident trouvé ou null si aucune correspondance n'est trouvée.
   */
  async findById(id: number): Promise<Incident | null> {
    const incident = this.incidents.find(i => i.id === id);
    return incident || null;
  }

  /**
   * Enregistre (ou met à jour) un incident.
   * Si l'incident n'a pas d'identifiant, un nouvel identifiant est généré.
   * @param incident L'instance d'Incident à enregistrer.
   * @returns Une promesse contenant l'incident enregistré.
   */
  async save(incident: Incident): Promise<Incident> {
    if (incident.id === undefined) {
      // Génération d'un nouvel identifiant basé sur le maximum des identifiants existants.
      const newId =
        this.incidents.length > 0 ? Math.max(...this.incidents.map(i => i.id || 0)) + 1 : 1;
      // Contournement de la propriété privée en lecture seule (_id) avec un cast en any.
      (incident as any)._id = newId;
      this.incidents.push(incident);
      return incident;
    } else {
      // Si l'incident existe déjà, on le met à jour ou on l'ajoute s'il n'existe pas.
      const index = this.incidents.findIndex(i => i.id === incident.id);
      if (index !== -1) {
        this.incidents[index] = incident;
      } else {
        this.incidents.push(incident);
      }
      return incident;
    }
  }

  /**
   * Met à jour un incident existant.
   * @param incident L'instance d'Incident à mettre à jour.
   * @returns Une promesse contenant l'incident mis à jour.
   * @throws Une erreur si l'incident n'existe pas.
   */
  async update(incident: Incident): Promise<Incident> {
    if (incident.id === undefined) {
      throw new Error("L'incident doit avoir un identifiant pour être mis à jour.");
    }
    const index = this.incidents.findIndex(i => i.id === incident.id);
    if (index === -1) {
      throw new Error(`Incident avec l'id ${incident.id} non trouvé.`);
    }
    this.incidents[index] = incident;
    return incident;
  }

  /**
   * Retourne la liste de tous les incidents enregistrés.
   * @returns Une promesse contenant un tableau d'Incident.
   */
  async findAll(): Promise<Incident[]> {
    return this.incidents;
  }
}
