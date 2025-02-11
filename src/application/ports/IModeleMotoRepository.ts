import { ModeleMoto } from '../../domain/entities/ModeleMoto';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité ModeleMoto.
 */
export interface IModeleMotoRepository {
  /**
   * Recherche un modèle de moto par son identifiant.
   * @param id L'identifiant du modèle.
   * @returns Une promesse contenant le modèle trouvé ou null si aucun modèle n'est trouvé.
   */
  findById(id: number): Promise<ModeleMoto | null>;

  /**
   * Enregistre (ou met à jour) un modèle de moto.
   * Si le modèle n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param modeleMoto L'instance de ModeleMoto à enregistrer.
   * @returns Une promesse contenant le modèle enregistré.
   */
  save(modeleMoto: ModeleMoto): Promise<ModeleMoto>;

  /**
   * Met à jour un modèle de moto existant.
   * @param modeleMoto L'instance de ModeleMoto à mettre à jour.
   * @returns Une promesse contenant le modèle mis à jour.
   */
  update(modeleMoto: ModeleMoto): Promise<ModeleMoto>;

  /**
   * Retourne la liste de tous les modèles de moto enregistrés.
   * @returns Une promesse contenant un tableau de ModeleMoto.
   */
  findAll(): Promise<ModeleMoto[]>;

  /**
   * Supprime un modèle de moto par son identifiant.
   * @param id L'identifiant du modèle à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  delete(id: number): Promise<boolean>;
}
