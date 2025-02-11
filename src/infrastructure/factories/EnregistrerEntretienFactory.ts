import { InMemoryEntretienRepository } from '../adapters/database/in-memory/InMemoryEntretienRepository';
import { EnregistrerEntretienUseCase } from '../../application/use-cases/EnregistrerEntretienUseCase';

// Singleton : Instanciation unique du repository Entretien
const entretienRepository = InMemoryEntretienRepository.getInstance();

// Injection du repository dans le Use Case
const enregistrerEntretienUseCase = new EnregistrerEntretienUseCase(entretienRepository);

export { entretienRepository, enregistrerEntretienUseCase };
