import { IIncidentRepository } from './../../../../application/ports/IIncidentRepository';
import { Incident } from './../../../../domain/entities/Incident';

/**
 * Implémentation en mémoire du repository pour l'entité Incident avec un Singleton et une `Map`.
 */
export class InMemoryIncidentRepository implements IIncidentRepository {
  private static instance: InMemoryIncidentRepository;
  private incidents: Map<number, Incident> = new Map(); // Utilisation de Map pour stocker les incidents
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryIncidentRepository {
    if (!InMemoryIncidentRepository.instance) {
      InMemoryIncidentRepository.instance = new InMemoryIncidentRepository();
    }
    return InMemoryIncidentRepository.instance;
  }

  /**
   * Recherche un incident par son identifiant.
   * @param id L'identifiant de l'incident.
   * @returns Une promesse contenant l'incident trouvé ou null si aucune correspondance n'est trouvée.
   */
  async findById(id: number): Promise<Incident | null> {
    return this.incidents.get(id) || null;
  }

  /**
   * Enregistre (ou met à jour) un incident.
   * Si l'incident n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param incident L'instance d'Incident à enregistrer.
   * @returns Une promesse contenant l'incident enregistré.
   */
  async save(incident: Incident): Promise<Incident> {
    const id = incident.id ?? ++this.lastId; // Garantir un ID unique

    incident = new Incident({
      id,
      essai: incident.essai, // Essai associé (optionnel)
      conducteur: incident.conducteur, // Conducteur concerné (optionnel)
      moto: incident.moto, // Moto concernée (optionnel)
      dateIncident: incident.dateIncident, // Date de l'incident
      description: incident.description, // Description détaillée
      severite: incident.severite, // Niveau de gravité
    });

    this.incidents.set(id, incident); // Ajout ou mise à jour dans la Map
    return incident;
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
    if (!this.incidents.has(incident.id)) {
      throw new Error(`Incident avec l'ID ${incident.id} non trouvé.`);
    }
    this.incidents.set(incident.id, incident);
    return incident;
  }

  /**
   * Retourne la liste de tous les incidents enregistrés.
   * @returns Une promesse contenant un tableau d'Incident.
   */
  async findAll(): Promise<Incident[]> {
    return Array.from(this.incidents.values());
  }

  /**
   * Supprime un incident par son identifiant.
   * @param id L'identifiant de l'incident à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  async delete(id: number): Promise<boolean> {
    if (!this.incidents.has(id)) {
      return false;
    }
    this.incidents.delete(id);
    return true;
  }
}
