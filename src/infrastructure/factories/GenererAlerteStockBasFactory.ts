import { InMemoryStockRepository } from '../adapters/database/in-memory/InMemoryStockRepository';
import { InMemoryNotificationRepository } from '../adapters/database/in-memory/InMemoryNotificationRepository';
import { GenererAlerteStockBasUseCase } from '../../application/use-cases/GenererAlerteStockBasUseCase';

// Singleton : Instanciation unique des repositories nécessaires
const stockRepository = InMemoryStockRepository.getInstance();
const notificationRepository = InMemoryNotificationRepository.getInstance();

// Injection des repositories dans le Use Case
const genererAlerteStockBasUseCase = new GenererAlerteStockBasUseCase(stockRepository, notificationRepository);

export { stockRepository, notificationRepository, genererAlerteStockBasUseCase };
