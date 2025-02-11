import { IPanneRepository } from './../../../../application/ports/IPanneRepository';
import { Panne } from './../../../../domain/entities/Panne';

/**
 * Implémentation en mémoire du repository pour l'entité Panne avec un Singleton et une `Map`.
 */
export class InMemoryPanneRepository implements IPanneRepository {
  private static instance: InMemoryPanneRepository;
  private pannes: Map<number, Panne> = new Map(); // Utilisation de Map pour stocker les pannes
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryPanneRepository {
    if (!InMemoryPanneRepository.instance) {
      InMemoryPanneRepository.instance = new InMemoryPanneRepository();
    }
    return InMemoryPanneRepository.instance;
  }

  /**
   * Recherche une panne par son identifiant.
   * @param id L'identifiant de la panne.
   * @returns Une promesse contenant la panne trouvée ou null si aucune panne n'est trouvée.
   */
  async findById(id: number): Promise<Panne | null> {
    return this.pannes.get(id) || null;
  }

  /**
   * Enregistre (ou met à jour) une panne.
   * Si la panne n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param panne L'instance de Panne à enregistrer.
   * @returns Une promesse contenant la panne enregistrée.
   */
  async save(panne: Panne): Promise<Panne> {
    const id = panne.id ?? ++this.lastId; // Garantir un ID unique

    panne = new Panne({
      id,
      moto: panne.moto, // Moto concernée (optionnelle)
      entretien: panne.entretien, // Entretien associé (optionnel)
      dateEvent: panne.dateEvent, // Date de la panne
      description: panne.description, // Description de la panne
      cout: panne.cout, // Coût de la panne
      sousGarantie: panne.sousGarantie, // Couverture sous garantie
    });

    this.pannes.set(id, panne); // Ajout ou mise à jour dans la Map
    return panne;
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
    if (!this.pannes.has(panne.id)) {
      throw new Error(`Panne avec l'ID ${panne.id} non trouvée.`);
    }
    this.pannes.set(panne.id, panne);
    return panne;
  }

  /**
   * Retourne la liste de toutes les pannes enregistrées.
   * @returns Une promesse contenant un tableau de Panne.
   */
  async findAll(): Promise<Panne[]> {
    return Array.from(this.pannes.values());
  }

  /**
   * Supprime une panne par son identifiant.
   * @param id L'identifiant de la panne à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  async delete(id: number): Promise<boolean> {
    if (!this.pannes.has(id)) {
      return false;
    }
    this.pannes.delete(id);
    return true;
  }
}
