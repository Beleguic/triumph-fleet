import { IMotoRepository } from '../ports/IMotoRepository';
import { IModeleMotoRepository } from '../ports/IModeleMotoRepository';
import { IClientRepository } from '../ports/IClientRepository';
import { Moto } from '../../domain/entities/Moto';

/**
 * Use Case pour gérer les motos.
 */
export class GererMotoUseCase {
  constructor(
    private readonly motoRepository: IMotoRepository,
    private readonly modeleMotoRepository: IModeleMotoRepository,
    private readonly clientRepository: IClientRepository
  ) {}

  /**
   * Crée ou met à jour une moto.
   * Vérifie que le modèle et le client existent avant de l'affecter.
   * @param motoData Données de la moto.
   * @returns La moto enregistrée.
   */
  async execute(motoData: Partial<Moto>): Promise<Moto> {
    if (!motoData.numeroSerie?.trim()) {
      throw new Error("Le numéro de série ne peut pas être vide.");
    }
    if (motoData.kilometrageActuel !== undefined && motoData.kilometrageActuel < 0) {
      throw new Error("Le kilométrage ne peut pas être négatif.");
    }
    if (!motoData.statut?.trim()) {
      throw new Error("Le statut de la moto ne peut pas être vide.");
    }
    if (!motoData.modele || motoData.modele.id === undefined) {
      throw new Error("Une moto doit être associée à un modèle existant.");
    }
    if (!motoData.client || motoData.client.id === undefined) {
      throw new Error("Une moto doit être associée à un client existant.");
    }

    // Vérification que le modèle de moto existe
    const modeleMoto = await this.modeleMotoRepository.findById(motoData.modele.id);
    if (!modeleMoto) {
      throw new Error(`Modèle de moto avec l'ID ${motoData.modele.id} non trouvé.`);
    }

    // Vérification que le client existe
    const client = await this.clientRepository.findById(motoData.client.id);
    if (!client) {
      throw new Error(`Client avec l'ID ${motoData.client.id} non trouvé.`);
    }

    let moto: Moto | null;
    if (motoData.id !== undefined) {
      moto = await this.motoRepository.findById(motoData.id);
      if (!moto) {
        throw new Error(`Moto avec l'ID ${motoData.id} non trouvée.`);
      }
      moto.modele = modeleMoto;
      moto.client = client;
      moto.kilometrageActuel = motoData.kilometrageActuel ?? moto.kilometrageActuel;
      moto.statut = motoData.statut;
      return await this.motoRepository.update(moto);
    } else {
      moto = new Moto({
        modele: modeleMoto,
        client: client,
        numeroSerie: motoData.numeroSerie,
        kilometrageActuel: motoData.kilometrageActuel ?? 0,
        dateAchat: motoData.dateAchat ?? new Date(),
        statut: motoData.statut,
      });
      return await this.motoRepository.save(moto);
    }
  }

  /**
   * Récupère une moto par son identifiant.
   * @param id L'identifiant de la moto.
   * @returns La moto trouvée ou `null` si aucune moto n'est trouvée.
   */
  async findMotoById(id: number): Promise<Moto | null> {
    return this.motoRepository.findById(id);
  }

  /**
   * Récupère toutes les motos.
   * @returns Une liste des motos enregistrées.
   */
  async getAllMotos(): Promise<Moto[]> {
    return this.motoRepository.findAll();
  }

  /**
   * Supprime une moto.
   * @param id L'identifiant de la moto à supprimer.
   * @returns Un booléen indiquant si la suppression a réussi.
   */
  async deleteMoto(id: number): Promise<boolean> {
    const moto = await this.motoRepository.findById(id);
    if (!moto) {
      throw new Error(`Moto avec l'ID ${id} non trouvée.`);
    }
    return this.motoRepository.delete(id);
  }
}
