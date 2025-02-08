// src/application/use-cases/EnvoyerRappelEntretienUseCase.ts

import { IEntretienRepository } from '../ports/IEntretienRepository';
import { INotificationRepository } from '../ports/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';
import { Entretien } from '../../domain/entities/Entretien';

export interface EnvoyerRappelEntretienOutput {
  notifications: Notification[];
}

export class EnvoyerRappelEntretienUseCase {
  constructor(
    private readonly entretienRepository: IEntretienRepository,
    private readonly notificationRepository: INotificationRepository
  ) {}

  public async execute(): Promise<EnvoyerRappelEntretienOutput> {
    const now = new Date();
    const allEntretiens: Entretien[] = await this.entretienRepository.findAll();
    const notificationsCreated: Notification[] = [];

    // Parcourir chaque entretien pour vérifier s'il est dû
    for (const entretien of allEntretiens) {
      // Un entretien est considéré comme dû s'il a une date planifiée,
      // que cette date est antérieure ou égale à la date courante,
      // et qu'il n'a pas encore été réalisé (dateRealisee non définie).
      if (
        entretien.datePlanifiee &&
        entretien.datePlanifiee <= now &&
        !entretien.dateRealisee
      ) {
        // On suppose que la moto associée possède un client
        if (!entretien.moto.client) {
          // Si aucun client n'est associé, on ignore cet entretien.
          continue;
        }

        // Création de la notification avec un message explicite.
        const notification = new Notification({
          entretien: entretien,
          client: entretien.moto.client,
          message: `L'entretien prévu le ${entretien.datePlanifiee.toLocaleDateString()} est dû.`,
          dateNotification: new Date(),
          estLu: false
        });

        // Sauvegarde de la notification via le repository
        const savedNotification = await this.notificationRepository.save(notification);
        notificationsCreated.push(savedNotification);
      }
    }

    return { notifications: notificationsCreated };
  }
}
