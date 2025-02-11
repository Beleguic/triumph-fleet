import { InMemoryNotificationRepository } from '../adapters/database/in-memory/InMemoryNotificationRepository';
import { GererNotificationsUseCase } from '../../application/use-cases/GererNotificationsUseCase';

// Singleton : Instanciation unique du repository Notification
const notificationRepository = InMemoryNotificationRepository.getInstance();

// Injection du repository dans le Use Case
const gererNotificationsUseCase = new GererNotificationsUseCase(notificationRepository);

export { notificationRepository, gererNotificationsUseCase };
