import { InMemoryModeleMotoRepository } from '../adapters/database/in-memory/inMemoryModeleMotoRepository';
import { GererModeleMotoUseCase } from '../../application/use-cases/GererModeleMotoUseCase';

// Singleton : Instanciation unique du repository ModeleMoto
const modeleMotoRepository = InMemoryModeleMotoRepository.getInstance();

// Injection du repository dans le Use Case
const gererModeleMotoUseCase = new GererModeleMotoUseCase(modeleMotoRepository);

export { modeleMotoRepository, gererModeleMotoUseCase };
