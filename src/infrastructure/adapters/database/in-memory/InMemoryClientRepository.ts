import { IClientRepository } from './../../../../application/ports/IClientRepository';
import { Client } from './../../../../domain/entities/Client';

/**
 * Implémentation en mémoire du repository pour l'entité Client avec un Singleton et une `Map`.
 */
export class InMemoryClientRepository implements IClientRepository {
  private static instance: InMemoryClientRepository;
  private clients: Map<number, Client> = new Map(); // Utilisation de Map pour stocker les clients
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryClientRepository {
    if (!InMemoryClientRepository.instance) {
      InMemoryClientRepository.instance = new InMemoryClientRepository();
    }
    return InMemoryClientRepository.instance;
  }

  /**
   * Recherche un client par son identifiant.
   */
  async findById(id: number): Promise<Client | null> {
    return this.clients.get(id) || null;
  }

  /**
   * Enregistre (ou met à jour) un client.
   */
  async save(client: Client): Promise<Client> {
    const id = client.id ?? ++this.lastId; // Garantir un ID unique

    client = new Client({
      id,
      nom: client.nom,
      type: client.type,
      contactInfo: client.contactInfo,
    });

    this.clients.set(id, client); // Ajout ou mise à jour dans la Map
    return client;
  }

  /**
   * Met à jour un client existant.
   */
  async update(client: Client): Promise<Client> {
    if (client.id === undefined) {
      throw new Error("Le client doit avoir un identifiant pour être mis à jour.");
    }
    if (!this.clients.has(client.id)) {
      throw new Error(`Client avec l'ID ${client.id} non trouvé.`);
    }
    this.clients.set(client.id, client);
    return client;
  }

  /**
   * Retourne la liste de tous les clients enregistrés.
   */
  async findAll(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  /**
   * Supprime un client par son identifiant.
   */
  async delete(id: number): Promise<boolean> {
    if (!this.clients.has(id)) {
      return false;
    }
    this.clients.delete(id);
    return true;
  }
}
