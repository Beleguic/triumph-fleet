import { IEssaiRepository } from './../../../../application/ports/IEssaiRepository';
import { Essai } from './../../../../domain/entities/Essai';

/**
 * Implémentation en mémoire du repository pour l'entité Essai avec un Singleton et une `Map`.
 */
export class InMemoryEssaiRepository implements IEssaiRepository {
  private static instance: InMemoryEssaiRepository;
  private essais: Map<number, Essai> = new Map(); // Utilisation de Map pour stocker les essais
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryEssaiRepository {
    if (!InMemoryEssaiRepository.instance) {
      InMemoryEssaiRepository.instance = new InMemoryEssaiRepository();
    }
    return InMemoryEssaiRepository.instance;
  }

  /**
   * Recherche un essai par son identifiant.
   * @param id L'identifiant de l'essai.
   * @returns Une promesse contenant l'essai trouvé ou null si aucun essai n'est trouvé.
   */
  async findById(id: number): Promise<Essai | null> {
    return this.essais.get(id) || null;
  }

  /**
   * Enregistre (ou met à jour) un essai.
   * Si l'essai n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param essai L'instance d'Essai à enregistrer.
   * @returns Une promesse contenant l'essai enregistré.
   */
  async save(essai: Essai): Promise<Essai> {
    const id = essai.id ?? ++this.lastId; // Garantir un ID unique

    essai = new Essai({
      id,
      moto: essai.moto, // Moto utilisée pour l'essai
      conducteur: essai.conducteur, // Conducteur réalisant l'essai
      dateDebut: essai.dateDebut, // Date de début de l'essai
      dateFin: essai.dateFin, // Date de fin (optionnelle)
      kilometrageParcouru: essai.kilometrageParcouru, // Kilométrage parcouru
    });

    this.essais.set(id, essai); // Ajout ou mise à jour dans la Map
    return essai;
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
    if (!this.essais.has(essai.id)) {
      throw new Error(`Essai avec l'ID ${essai.id} non trouvé.`);
    }
    this.essais.set(essai.id, essai);
    return essai;
  }

  /**
   * Retourne la liste de tous les essais enregistrés.
   * @returns Une promesse contenant un tableau d'Essai.
   */
  async findAll(): Promise<Essai[]> {
    return Array.from(this.essais.values());
  }

  /**
   * Supprime un essai par son identifiant.
   * @param id L'identifiant de l'essai à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  async delete(id: number): Promise<boolean> {
    if (!this.essais.has(id)) {
      return false;
    }
    this.essais.delete(id);
    return true;
  }
}
