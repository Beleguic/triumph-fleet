import { IStockRepository } from '../ports/IStockRepository';
import { INotificationRepository } from '../ports/INotificationRepository';
import { Notification } from '../../domain/entities/Notification';
import { Stock } from '../../domain/entities/Stock';
import { Client } from '../../domain/entities/Client';

/**
 * DTO de sortie contenant les notifications créées pour les stocks bas.
 */
export interface GenererAlerteStockBasOutput {
  notifications: Notification[];
}

/**
 * Use Case pour générer des alertes de stock bas.
 */
export class GenererAlerteStockBasUseCase {
  constructor(
    private readonly stockRepository: IStockRepository,
    private readonly notificationRepository: INotificationRepository
  ) {}

  /**
   * Exécute le use case pour générer des alertes de stock bas.
   * @returns Les notifications générées pour les stocks en dessous du seuil.
   */
  public async execute(): Promise<GenererAlerteStockBasOutput> {
    const stocks: Stock[] = await this.stockRepository.findAll();
    const notificationsCreated: Notification[] = [];
    const now = new Date();

    // Client "par défaut" pour recevoir les alertes de stock bas.
    const defaultClient = new Client({
      nom: "Gestionnaire",
      type: "gestionnaire",
      contactInfo: "gestionnaire@example.com"
    });

    // Parcourir tous les stocks pour identifier ceux en dessous du seuil d'alerte.
    for (const stock of stocks) {
      if (stock.quantite <= stock.seuilAlerte) {
        const message = `Alerte Stock: La quantité de "${stock.piece.nom}" est basse (${stock.quantite}). Seuil d'alerte: ${stock.seuilAlerte}.`;
        
        // Création de la notification
        const notification = new Notification({
          entretien: undefined, // Inutile ici
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
