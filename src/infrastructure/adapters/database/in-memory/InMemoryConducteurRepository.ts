import { IConducteurRepository } from './../../../../application/ports/IConducteurRepository';
import { Conducteur } from './../../../../domain/entities/Conducteur';

/**
 * Implémentation en mémoire du repository pour l'entité Conducteur avec un Singleton.
 */
export class InMemoryConducteurRepository implements IConducteurRepository {
  private static instance: InMemoryConducteurRepository;
  private conducteurs: Map<number, Conducteur> = new Map();
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryConducteurRepository {
    if (!InMemoryConducteurRepository.instance) {
      InMemoryConducteurRepository.instance = new InMemoryConducteurRepository();
    }
    return InMemoryConducteurRepository.instance;
  }

  /**
   * Recherche un conducteur par son identifiant.
   * @param id L'identifiant du conducteur.
   * @returns Une promesse contenant le conducteur trouvé ou null si non trouvé.
   */
  async findById(id: number): Promise<Conducteur | null> {
    return this.conducteurs.get(id) || null;
  }

  /**
   * Enregistre un nouveau conducteur ou met à jour un conducteur existant.
   * Si l'ID n'est pas défini, un nouvel ID auto-incrémenté est attribué.
   * @param conducteur L'instance de Conducteur à enregistrer.
   * @returns Une promesse contenant le conducteur enregistré.
   */
  async save(conducteur: Conducteur): Promise<Conducteur> {
    const id = conducteur.id ?? ++this.lastId; // Si l'ID est undefined, on incrémente lastId
  
    // Création d'une nouvelle instance avec un ID toujours défini
    conducteur = new Conducteur({
      id, 
      nom: conducteur.nom, 
      permis: conducteur.permis, 
      experienceAnnees: conducteur.experienceAnnees,
      contactInfo: conducteur.contactInfo // Facultatif
    });
  
    this.conducteurs.set(id, conducteur); // Maintenant, id est toujours un `number`
    return conducteur;
  }
  

  /**
   * Met à jour un conducteur existant.
   * Lève une erreur si le conducteur n'existe pas.
   * @param conducteur L'instance de Conducteur à mettre à jour.
   * @returns Une promesse contenant le conducteur mis à jour.
   */
  async update(conducteur: Conducteur): Promise<Conducteur> {
    if (!conducteur.id || !this.conducteurs.has(conducteur.id)) {
      throw new Error(`Conducteur avec l'ID ${conducteur.id} non trouvé.`);
    }
    this.conducteurs.set(conducteur.id, conducteur);
    return conducteur;
  }

  /**
   * Retourne la liste de tous les conducteurs enregistrés.
   * @returns Une promesse contenant un tableau de Conducteur.
   */
  async findAll(): Promise<Conducteur[]> {
    return Array.from(this.conducteurs.values());
  }

  /**
   * Supprime un conducteur par son identifiant.
   * @param id L'identifiant du conducteur à supprimer.
   * @returns Une promesse indiquant si la suppression a réussi (true) ou si le conducteur n'a pas été trouvé (false).
   */
  async delete(id: number): Promise<boolean> {
    if (!this.conducteurs.has(id)) {
      return false;
    }
    this.conducteurs.delete(id);
    return true;
  }
}
