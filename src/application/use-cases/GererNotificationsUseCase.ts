import { INotificationRepository } from '../ports/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';

/**
 * DTO d'entrée pour marquer une notification comme lue.
 * Ce DTO peut être utilisé pour mettre à jour le statut de lecture des notifications.
 */
export interface MarquerNotificationCommeLueInput {
  notificationId: number;  // Identifiant de la notification à marquer comme lue.
}

/**
 * DTO de sortie pour renvoyer une notification ou une liste de notifications.
 */
export interface GererNotificationsOutput {
  notifications: Notification[];
}

/**
 * Use Case pour gérer les notifications.
 */
export class GererNotificationsUseCase {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  /**
   * Exécute le use case pour récupérer toutes les notifications.
   * @returns Une promesse contenant la liste des notifications.
   */
  public async consulterNotifications(): Promise<GererNotificationsOutput> {
    const notifications = await this.notificationRepository.findAll();
    return { notifications };
  }

  /**
   * Exécute le use case pour marquer une notification comme lue.
   * @param input Identifiant de la notification à marquer comme lue.
   * @returns La notification mise à jour.
   */
  public async marquerNotificationCommeLue(input: MarquerNotificationCommeLueInput): Promise<Notification> {
    const notification = await this.notificationRepository.findById(input.notificationId);
    if (!notification) {
      throw new Error(`Notification avec l'id ${input.notificationId} non trouvée.`);
    }
    notification.estLu = true;  // Marquer la notification comme lue
    return this.notificationRepository.update(notification); // Sauvegarder la notification mise à jour
  }
}
