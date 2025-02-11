import { IModeleMotoRepository } from '../ports/IModeleMotoRepository';
import { ModeleMoto } from '../../domain/entities/ModeleMoto';

/**
 * Use Case pour gérer les modèles de moto.
 */
export class GererModeleMotoUseCase {
  constructor(private readonly modeleMotoRepository: IModeleMotoRepository) {}

  /**
   * Crée ou met à jour un modèle de moto.
   * @param modeleData Données du modèle de moto.
   * @returns Le modèle enregistré.
   */
  async execute(modeleData: Partial<ModeleMoto>): Promise<ModeleMoto> {
    if (!modeleData.nom?.trim()) {
      throw new Error("Le nom du modèle ne peut pas être vide.");
    }
    if (modeleData.intervalleKm !== undefined && modeleData.intervalleKm < 0) {
      throw new Error("L'intervalle en km ne peut pas être négatif.");
    }
    if (modeleData.intervalleAnnees !== undefined && modeleData.intervalleAnnees < 0) {
      throw new Error("L'intervalle en années ne peut pas être négatif.");
    }

    let modeleMoto: ModeleMoto | null;
    if (modeleData.id) {
      modeleMoto = await this.modeleMotoRepository.findById(modeleData.id);
      if (!modeleMoto) {
        throw new Error(`Modèle de moto avec l'ID ${modeleData.id} non trouvé.`);
      }
      modeleMoto.nom = modeleData.nom;
      modeleMoto.intervalleKm = modeleData.intervalleKm ?? modeleMoto.intervalleKm;
      modeleMoto.intervalleAnnees = modeleData.intervalleAnnees ?? modeleMoto.intervalleAnnees;
      return await this.modeleMotoRepository.update(modeleMoto);
    } else {
      modeleMoto = new ModeleMoto({
        nom: modeleData.nom,
        intervalleKm: modeleData.intervalleKm ?? 10000,
        intervalleAnnees: modeleData.intervalleAnnees ?? 1,
      });
      return await this.modeleMotoRepository.save(modeleMoto);
    }
  }

  /**
   * Récupère un modèle de moto par son identifiant.
   * @param id L'identifiant du modèle.
   * @returns Le modèle trouvé ou `null` si aucun modèle n'est trouvé.
   */
  async findModeleMotoById(id: number): Promise<ModeleMoto | null> {
    return this.modeleMotoRepository.findById(id);
  }

  /**
   * Récupère tous les modèles de moto.
   * @returns Une liste des modèles enregistrés.
   */
  async getAllModelesMoto(): Promise<ModeleMoto[]> {
    return this.modeleMotoRepository.findAll();
  }

  /**
   * Supprime un modèle de moto.
   * @param id L'identifiant du modèle à supprimer.
   * @returns Un booléen indiquant si la suppression a réussi.
   */
  async deleteModeleMoto(id: number): Promise<boolean> {
    const modeleMoto = await this.modeleMotoRepository.findById(id);
    if (!modeleMoto) {
      throw new Error(`Modèle de moto avec l'ID ${id} non trouvé.`);
    }
    return this.modeleMotoRepository.delete(id);
  }
}
