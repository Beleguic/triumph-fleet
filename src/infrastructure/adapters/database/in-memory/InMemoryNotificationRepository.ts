import { INotificationRepository } from './../../../../application/ports/INotificationRepository';
import { Notification } from './../../../../domain/entities/Notification';

/**
 * Implémentation en mémoire du repository pour l'entité Notification avec un Singleton et une `Map`.
 */
export class InMemoryNotificationRepository implements INotificationRepository {
  private static instance: InMemoryNotificationRepository;
  private notifications: Map<number, Notification> = new Map(); // Utilisation de Map pour stocker les notifications
  private lastId: number = 0; // Auto-incrémentation des IDs

  // Constructeur privé pour empêcher l'instanciation directe
  private constructor() {}

  /**
   * Retourne l'unique instance du repository.
   */
  public static getInstance(): InMemoryNotificationRepository {
    if (!InMemoryNotificationRepository.instance) {
      InMemoryNotificationRepository.instance = new InMemoryNotificationRepository();
    }
    return InMemoryNotificationRepository.instance;
  }

  /**
   * Recherche une notification par son identifiant.
   * @param id Identifiant de la notification.
   * @returns Une promesse contenant la notification trouvée ou null si non trouvée.
   */
  async findById(id: number): Promise<Notification | null> {
    return this.notifications.get(id) || null;
  }

  /**
   * Enregistre (ou met à jour) une notification.
   * Si la notification n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param notification L'instance de Notification à enregistrer.
   * @returns Une promesse contenant la notification enregistrée.
   */
  async save(notification: Notification): Promise<Notification> {
    const id = notification.id ?? ++this.lastId; // Garantir un ID unique

    notification = new Notification({
      id,
      entretien: notification.entretien, // Entretien associé (optionnel)
      client: notification.client, // Client destinataire
      message: notification.message, // Contenu du message
      dateNotification: notification.dateNotification, // Date d'envoi
      estLu: notification.estLu, // Statut de lecture
    });

    this.notifications.set(id, notification); // Ajout ou mise à jour dans la Map
    return notification;
  }

  /**
   * Met à jour une notification existante.
   * @param notification L'instance de Notification à mettre à jour.
   * @returns Une promesse contenant la notification mise à jour.
   * @throws Une erreur si la notification n'existe pas.
   */
  async update(notification: Notification): Promise<Notification> {
    if (notification.id === undefined) {
      throw new Error("La notification doit avoir un identifiant pour être mise à jour.");
    }
    if (!this.notifications.has(notification.id)) {
      throw new Error(`Notification avec l'ID ${notification.id} non trouvée.`);
    }
    this.notifications.set(notification.id, notification);
    return notification;
  }

  /**
   * Retourne la liste de toutes les notifications enregistrées.
   * @returns Une promesse contenant un tableau de Notification.
   */
  async findAll(): Promise<Notification[]> {
    return Array.from(this.notifications.values());
  }

  /**
   * Supprime une notification par son identifiant.
   * @param id L'identifiant de la notification à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  async delete(id: number): Promise<boolean> {
    if (!this.notifications.has(id)) {
      return false;
    }
    this.notifications.delete(id);
    return true;
  }
}
