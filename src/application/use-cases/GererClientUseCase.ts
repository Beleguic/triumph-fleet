import { IClientRepository } from '../ports/IClientRepository';
import { Client } from '../../domain/entities/Client';

/**
 * DTO d'entrée pour gérer un client.
 * Utilisé pour la création ou la mise à jour d'un client.
 */
export interface GererClientInput {
  id?: number;          // Identifiant du client (optionnel pour création)
  nom: string;          // Nom du client
  type: string;         // Type de client (ex: entreprise, concessionnaire)
  contactInfo?: string; // Informations de contact (optionnelles)
}

/**
 * DTO de sortie renvoyant le client créé ou mis à jour.
 */
export interface GererClientOutput {
  client: Client;
}

/**
 * Use Case pour la gestion des clients.
 */
export class GererClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  /**
   * Récupère la liste de tous les clients enregistrés.
   * @returns Une liste des clients.
   */
  public async getAllClients(): Promise<Client[]> {
    return await this.clientRepository.findAll();
  }

  /**
   * Supprime un client par son identifiant.
   * @param id L'identifiant du client à supprimer.
   * @returns Un booléen indiquant si la suppression a été effectuée avec succès.
   */
  public async deleteClient(id: number): Promise<boolean> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error(`Client avec l'ID ${id} non trouvé.`);
    }
    return await this.clientRepository.delete(id);
  }

  /**
   * Crée ou met à jour un client.
   * @param input Données d'entrée contenant les informations du client.
   * @returns Le client créé ou mis à jour.
   */
  public async execute(input: GererClientInput): Promise<GererClientOutput> {
    let client;

    // Vérification des entrées
    if (!input.nom.trim()) {
      throw new Error("Le nom du client ne peut pas être vide.");
    }
    if (!input.type.trim()) {
      throw new Error("Le type du client ne peut pas être vide.");
    }

    if (input.id) {
      // Si un ID est fourni, on tente de récupérer le client existant
      client = await this.clientRepository.findById(input.id);
      if (!client) {
        throw new Error(`Client avec l'ID ${input.id} non trouvé.`);
      }

      // Mise à jour des informations du client
      client.nom = input.nom;
      client.type = input.type;
      client.contactInfo = input.contactInfo;

      // Mise à jour dans le repository
      client = await this.clientRepository.update(client);
    } else {
      // Création d'un nouveau client
      client = new Client({
        nom: input.nom,
        type: input.type,
        contactInfo: input.contactInfo
      });

      client = await this.clientRepository.save(client);
    }

    return { client };
  }
}
