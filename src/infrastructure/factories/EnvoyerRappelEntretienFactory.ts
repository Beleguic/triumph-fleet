import { InMemoryEntretienRepository } from '../adapters/database/in-memory/InMemoryEntretienRepository';
import { InMemoryNotificationRepository } from '../adapters/database/in-memory/InMemoryNotificationRepository';
import { EnvoyerRappelEntretienUseCase } from '../../application/use-cases/EnvoyerRappelEntretienUseCase';

// Singleton : Instanciation unique des repositories nécessaires
const entretienRepository = InMemoryEntretienRepository.getInstance();
const notificationRepository = InMemoryNotificationRepository.getInstance();

// Injection des repositories dans le Use Case
const envoyerRappelEntretienUseCase = new EnvoyerRappelEntretienUseCase(entretienRepository, notificationRepository);

export { entretienRepository, notificationRepository, envoyerRappelEntretienUseCase };
