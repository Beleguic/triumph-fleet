import { InMemoryClientRepository } from '../adapters/database/in-memory/InMemoryClientRepository';
import { GererClientUseCase } from '../../application/use-cases/GererClientUseCase';

// Singleton : Instanciation unique du repository Client
const clientRepository = InMemoryClientRepository.getInstance();

// Injection du repository dans le Use Case
const gererClientUseCase = new GererClientUseCase(clientRepository);

export { clientRepository, gererClientUseCase };
