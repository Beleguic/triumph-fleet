// src/infrastructure/adapters/database/in-memory/InMemoryNotificationRepository.ts

import { INotificationRepository } from '../../../application/ports/INotificationRepository';
import { Notification } from '../../../domain/entities/Notification';

/**
 * Implémentation en mémoire du repository pour l'entité Notification.
 */
export class InMemoryNotificationRepository implements INotificationRepository {
  // Stock interne des notifications
  private notifications: Notification[] = [];

  /**
   * Enregistre (ou met à jour) une notification dans le repository.
   * Si la notification n'a pas d'identifiant, un nouvel identifiant est généré.
   * @param notification L'instance de Notification à enregistrer.
   * @returns La notification enregistrée.
   */
  async save(notification: Notification): Promise<Notification> {
    if (notification.id === undefined) {
      // Génération d'un nouvel identifiant
      const newId =
        this.notifications.length > 0
          ? Math.max(...this.notifications.map(n => n.id || 0)) + 1
          : 1;
      // Contournement de la propriété privée en lecture seule (pour l'in-memory)
      (notification as any)._id = newId;
      this.notifications.push(notification);
      return notification;
    } else {
      // Si la notification existe déjà, on la met à jour
      const index = this.notifications.findIndex(n => n.id === notification.id);
      if (index !== -1) {
        this.notifications[index] = notification;
      } else {
        this.notifications.push(notification);
      }
      return notification;
    }
  }

  /**
   * Recherche une notification par son identifiant.
   * @param id Identifiant de la notification.
   * @returns La notification trouvée ou null si non trouvée.
   */
  async findById(id: number): Promise<Notification | null> {
    const notification = this.notifications.find(n => n.id === id);
    return notification || null;
  }

  /**
   * Met à jour une notification existante dans le repository.
   * @param notification L'instance de Notification à mettre à jour.
   * @returns La notification mise à jour.
   * @throws Une erreur si la notification n'existe pas.
   */
  async update(notification: Notification): Promise<Notification> {
    if (notification.id === undefined) {
      throw new Error("La notification doit avoir un identifiant pour être mise à jour.");
    }
    const index = this.notifications.findIndex(n => n.id === notification.id);
    if (index === -1) {
      throw new Error(`Notification avec l'id ${notification.id} non trouvée.`);
    }
    this.notifications[index] = notification;
    return notification;
  }

  /**
   * Retourne la liste de toutes les notifications enregistrées.
   * @returns Un tableau de Notification.
   */
  async findAll(): Promise<Notification[]> {
    return this.notifications;
  }
}
