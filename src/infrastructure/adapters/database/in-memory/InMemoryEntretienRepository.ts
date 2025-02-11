import { IEntretienRepository } from './../../../../application/ports/IEntretienRepository';
import { Entretien } from './../../../../domain/entities/Entretien';

/**
 * Implémentation en mémoire du repository pour l'entité Entretien avec un Singleton.
 */
export class InMemoryEntretienRepository implements IEntretienRepository {
  private static instance: InMemoryEntretienRepository;
  private entretiens: Map<number, Entretien> = new Map(); // Utilisation de Map pour stocker les entretiens
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryEntretienRepository {
    if (!InMemoryEntretienRepository.instance) {
      InMemoryEntretienRepository.instance = new InMemoryEntretienRepository();
    }
    return InMemoryEntretienRepository.instance;
  }

  /**
   * Recherche un entretien par son identifiant.
   * @param id Identifiant de l'entretien.
   * @returns Une promesse contenant l'entretien trouvé ou null s'il n'est pas trouvé.
   */
  async findById(id: number): Promise<Entretien | null> {
    return this.entretiens.get(id) || null;
  }

  /**
   * Enregistre (ou met à jour) un entretien dans le repository.
   * Si l'entretien n'a pas d'identifiant, un nouvel identifiant est généré.
   * @param entretien L'instance d'Entretien à enregistrer.
   * @returns L'entretien enregistré.
   */
  async save(entretien: Entretien): Promise<Entretien> {
    // Assurer que l'ID est toujours un `number`
    const id = entretien.id ?? ++this.lastId;

    // Création d'une nouvelle instance d'Entretien avec un ID toujours défini
    entretien = new Entretien({
      id, // ID garanti
      moto: entretien.moto,
      typeEntretien: entretien.typeEntretien,
      datePlanifiee: entretien.datePlanifiee,
      dateRealisee: entretien.dateRealisee,
      kilometrage: entretien.kilometrage,
      cout: entretien.cout,
      description: entretien.description,
    });

    this.entretiens.set(id, entretien); // Maintenant `id` est toujours un `number`
    return entretien;
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
    if (!this.entretiens.has(entretien.id)) {
      throw new Error(`Entretien avec l'id ${entretien.id} non trouvé.`);
    }
    this.entretiens.set(entretien.id, entretien);
    return entretien;
  }

  /**
   * Retourne la liste de tous les entretiens enregistrés.
   * @returns Un tableau d'Entretien.
   */
  async findAll(): Promise<Entretien[]> {
    return Array.from(this.entretiens.values());
  }

  /**
   * Supprime un entretien par son identifiant.
   * @param id L'identifiant de l'entretien à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  async delete(id: number): Promise<boolean> {
    if (!this.entretiens.has(id)) {
      return false;
    }
    this.entretiens.delete(id);
    return true;
  }
}
