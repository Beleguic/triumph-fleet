// src/application/ports/INotificationRepository.ts

import { Notification } from '../../domain/entities/Notification';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité Notification.
 */
export interface INotificationRepository {
  /**
   * Recherche une notification par son identifiant.
   * @param id L'identifiant de la notification.
   * @returns Une promesse contenant la notification trouvée ou null si aucune notification n'est trouvée.
   */
  findById(id: number): Promise<Notification | null>;

  /**
   * Enregistre (ou met à jour) une notification.
   * Si la notification n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param notification L'instance de Notification à enregistrer.
   * @returns Une promesse contenant la notification enregistrée.
   */
  save(notification: Notification): Promise<Notification>;

  /**
   * Met à jour une notification existante.
   * @param notification L'instance de Notification à mettre à jour.
   * @returns Une promesse contenant la notification mise à jour.
   */
  update(notification: Notification): Promise<Notification>;

  /**
   * Retourne la liste de toutes les notifications enregistrées.
   * @returns Une promesse contenant un tableau de Notification.
   */
  findAll(): Promise<Notification[]>;
}
