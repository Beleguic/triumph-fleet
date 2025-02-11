import { Client } from '../../domain/entities/Client';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité Client.
 */
export interface IClientRepository {
  /**
   * Recherche un client par son identifiant.
   * @param id L'identifiant du client.
   * @returns Une promesse contenant le client trouvé ou null si aucun client n'est trouvé.
   */
  findById(id: number): Promise<Client | null>;

  /**
   * Enregistre (ou met à jour) un client.
   * Si le client n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param client L'instance de Client à enregistrer.
   * @returns Une promesse contenant le client enregistré.
   */
  save(client: Client): Promise<Client>;

  /**
   * Met à jour un client existant.
   * @param client L'instance de Client à mettre à jour.
   * @returns Une promesse contenant le client mis à jour.
   */
  update(client: Client): Promise<Client>;

  /**
   * Retourne la liste de tous les clients enregistrés.
   * @returns Une promesse contenant un tableau de Client.
   */
  findAll(): Promise<Client[]>;

  /**
   * Supprime un client par son identifiant.
   * @param id L'identifiant du client à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  delete(id: number): Promise<boolean>;
}
