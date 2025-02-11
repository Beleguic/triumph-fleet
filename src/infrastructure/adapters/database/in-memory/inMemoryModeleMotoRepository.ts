import { IModeleMotoRepository } from './../../../../application/ports/IModeleMotoRepository';
import { ModeleMoto } from './../../../../domain/entities/ModeleMoto';

/**
 * Implémentation en mémoire du repository pour l'entité ModeleMoto avec un Singleton et une `Map`.
 */
export class InMemoryModeleMotoRepository implements IModeleMotoRepository {
  private static instance: InMemoryModeleMotoRepository;
  private modeles: Map<number, ModeleMoto> = new Map(); // Utilisation de Map pour stocker les modèles de moto
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryModeleMotoRepository {
    if (!InMemoryModeleMotoRepository.instance) {
      InMemoryModeleMotoRepository.instance = new InMemoryModeleMotoRepository();
    }
    return InMemoryModeleMotoRepository.instance;
  }

  /**
   * Recherche un modèle de moto par son identifiant.
   * @param id L'identifiant du modèle.
   * @returns Une promesse contenant le modèle trouvé ou null si aucun modèle n'est trouvé.
   */
  async findById(id: number): Promise<ModeleMoto | null> {
    return this.modeles.get(id) || null;
  }

  /**
   * Enregistre (ou met à jour) un modèle de moto.
   * Si le modèle n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param modeleMoto L'instance de ModeleMoto à enregistrer.
   * @returns Une promesse contenant le modèle enregistré.
   */
  async save(modeleMoto: ModeleMoto): Promise<ModeleMoto> {
    const id = modeleMoto.id ?? ++this.lastId; // Garantir un ID unique

    modeleMoto = new ModeleMoto({
      id,
      nom: modeleMoto.nom, // Nom du modèle
      intervalleKm: modeleMoto.intervalleKm, // Intervalle en km
      intervalleAnnees: modeleMoto.intervalleAnnees, // Intervalle en années
    });

    this.modeles.set(id, modeleMoto); // Ajout ou mise à jour dans la Map
    return modeleMoto;
  }

  /**
   * Met à jour un modèle de moto existant.
   * @param modeleMoto L'instance de ModeleMoto à mettre à jour.
   * @returns Une promesse contenant le modèle mis à jour.
   * @throws Une erreur si le modèle n'existe pas.
   */
  async update(modeleMoto: ModeleMoto): Promise<ModeleMoto> {
    if (modeleMoto.id === undefined) {
      throw new Error("Le modèle de moto doit avoir un identifiant pour être mis à jour.");
    }
    if (!this.modeles.has(modeleMoto.id)) {
      throw new Error(`Modèle de moto avec l'ID ${modeleMoto.id} non trouvé.`);
    }
    this.modeles.set(modeleMoto.id, modeleMoto);
    return modeleMoto;
  }

  /**
   * Retourne la liste de tous les modèles de moto enregistrés.
   * @returns Une promesse contenant un tableau de ModeleMoto.
   */
  async findAll(): Promise<ModeleMoto[]> {
    return Array.from(this.modeles.values());
  }

  /**
   * Supprime un modèle de moto par son identifiant.
   * @param id L'identifiant du modèle à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  async delete(id: number): Promise<boolean> {
    if (!this.modeles.has(id)) {
      return false;
    }
    this.modeles.delete(id);
    return true;
  }
}
