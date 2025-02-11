import { IMotoRepository } from './../../../../application/ports/IMotoRepository';
import { Moto } from './../../../../domain/entities/Moto';

/**
 * Implémentation en mémoire du repository pour l'entité Moto avec un Singleton et une `Map`.
 */
export class InMemoryMotoRepository implements IMotoRepository {
  private static instance: InMemoryMotoRepository;
  private motos: Map<number, Moto> = new Map(); // Utilisation de Map pour stocker les motos
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryMotoRepository {
    if (!InMemoryMotoRepository.instance) {
      InMemoryMotoRepository.instance = new InMemoryMotoRepository();
    }
    return InMemoryMotoRepository.instance;
  }

  /**
   * Recherche une moto par son identifiant.
   * @param id Identifiant de la moto.
   * @returns Une promesse contenant la moto trouvée ou null si non trouvée.
   */
  async findById(id: number): Promise<Moto | null> {
    return this.motos.get(id) || null;
  }

  /**
   * Enregistre (ou met à jour) une moto dans le repository.
   * Si la moto n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param moto L'instance de Moto à enregistrer.
   * @returns La moto enregistrée.
   */
  async save(moto: Moto): Promise<Moto> {
    const id = moto.id ?? ++this.lastId; // Garantir un ID unique

    moto = new Moto({
      id,
      modele: moto.modele, // Modèle de la moto
      client: moto.client, // Client associé (optionnel)
      numeroSerie: moto.numeroSerie, // Numéro de série unique
      kilometrageActuel: moto.kilometrageActuel, // Kilométrage actuel
      dateAchat: moto.dateAchat, // Date d'achat
      statut: moto.statut, // Statut de la moto
    });

    this.motos.set(id, moto); // Ajout ou mise à jour dans la Map
    return moto;
  }

  /**
   * Met à jour une moto existante dans le repository.
   * @param moto L'instance de Moto à mettre à jour.
   * @returns La moto mise à jour.
   * @throws Erreur si la moto n'existe pas.
   */
  async update(moto: Moto): Promise<Moto> {
    if (moto.id === undefined) {
      throw new Error("La moto doit avoir un identifiant pour être mise à jour.");
    }
    if (!this.motos.has(moto.id)) {
      throw new Error(`Moto avec l'ID ${moto.id} non trouvée.`);
    }
    this.motos.set(moto.id, moto);
    return moto;
  }

  /**
   * Renvoie la liste de toutes les motos enregistrées.
   * @returns Un tableau de Moto.
   */
  async findAll(): Promise<Moto[]> {
    return Array.from(this.motos.values());
  }

  /**
   * Supprime une moto par son identifiant.
   * @param id L'identifiant de la moto à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  async delete(id: number): Promise<boolean> {
    if (!this.motos.has(id)) {
      return false;
    }
    this.motos.delete(id);
    return true;
  }
}
