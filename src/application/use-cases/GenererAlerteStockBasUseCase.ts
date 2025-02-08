// src/application/use-cases/GenererAlerteStockBasUseCase.ts

import { IStockRepository } from '../ports/IStockRepository';
import { INotificationRepository } from '../ports/INotificationRepository';
import { GenererAlerteStockBasOutput } from './GenererAlerteStockBasUseCase';
import { Notification } from '../../domain/entities/Notification';
import { Stock } from '../../domain/entities/Stock';
import { Client } from '../../domain/entities/Client';

export interface GenererAlerteStockBasOutput {
  notifications: Notification[];
}


// src/application/use-cases/GenererAlerteStockBasUseCase.ts



export class GenererAlerteStockBasUseCase {
  constructor(
    private readonly stockRepository: IStockRepository,
    private readonly notificationRepository: INotificationRepository
  ) {}

  public async execute(): Promise<GenererAlerteStockBasOutput> {
    const stocks: Stock[] = await this.stockRepository.findAll();
    const notificationsCreated: Notification[] = [];
    const now = new Date();

    // Pour cet exemple, nous créons un client "par défaut" qui représente le gestionnaire ou le destinataire des alertes.
    const defaultClient = new Client({
      nom: "Gestionnaire",
      type: "gestionnaire",
      contactInfo: "gestionnaire@example.com"
    });

    // Parcourir tous les stocks pour identifier ceux dont la quantité est inférieure ou égale au seuil d'alerte.
    for (const stock of stocks) {
      if (stock.quantite <= stock.seuilAlerte) {
        const message = `Alerte Stock: La quantité de "${stock.piece.nom}" est basse (${stock.quantite}). Seuil d'alerte: ${stock.seuilAlerte}.`;
        
        // On crée une notification pour ce stock bas.
        // Note : Ici, le champ 'entretien' n'est pas pertinent et peut être omis.
        const notification = new Notification({
          // Pour les alertes de stock, nous considérons que le champ 'entretien' est optionnel.
          // Si nécessaire, modifiez la définition de Notification pour que 'entretien' soit facultatif.
          entretien: undefined,
          client: defaultClient,
          message,
          dateNotification: now,
          estLu: false
        });

        const savedNotification = await this.notificationRepository.save(notification);
        notificationsCreated.push(savedNotification);
      }
    }

    return { notifications: notificationsCreated };
  }
}
