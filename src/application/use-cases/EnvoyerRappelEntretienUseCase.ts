import { Notification } from '../../domain/entities/Notification';
import { Entretien } from '../../domain/entities/Entretien';
import { IEntretienRepository } from '../ports/IEntretienRepository';
import { INotificationRepository } from '../ports/INotificationRepository';

/**
 * DTO de sortie contenant les notifications créées.
 */
export interface EnvoyerRappelEntretienOutput {
  notifications: Notification[];
}

/**
 * Use Case pour envoyer des rappels d'entretien.
 */
export class EnvoyerRappelEntretienUseCase {
  constructor(
    private readonly entretienRepository: IEntretienRepository,
    private readonly notificationRepository: INotificationRepository
  ) {}

  /**
   * Exécute le use case pour envoyer des rappels d'entretien.
   * @returns Les notifications générées pour les entretiens en retard.
   */
  public async execute(): Promise<EnvoyerRappelEntretienOutput> {
    const now = new Date();
    const allEntretiens: Entretien[] = await this.entretienRepository.findAll();
    const notificationsCreated: Notification[] = [];

    // Parcourir chaque entretien pour vérifier s'il est dû
    for (const entretien of allEntretiens) {
      if (
        entretien.datePlanifiee &&
        entretien.datePlanifiee <= now &&
        !entretien.dateRealisee
      ) {
        // Vérifier si un client est associé à la moto
        if (!entretien.moto.client) {
          continue;
        }

        // Création de la notification
        const notification = new Notification({
          entretien: entretien,
          client: entretien.moto.client,
          message: `L'entretien prévu le ${entretien.datePlanifiee.toLocaleDateString()} est dû.`,
          dateNotification: new Date(),
          estLu: false
        });

        // Sauvegarde de la notification
        const savedNotification = await this.notificationRepository.save(notification);
        notificationsCreated.push(savedNotification);
      }
    }

    return { notifications: notificationsCreated };
  }
}
