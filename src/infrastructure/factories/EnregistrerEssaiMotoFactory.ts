import { InMemoryEssaiRepository } from '../adapters/database/in-memory/InMemoryEssaiRepository';
import { EnregistrerEssaiMotoUseCase } from '../../application/use-cases/EnregistrerEssaiMotoUseCase';

// Singleton : Instanciation unique du repository Essai
const essaiRepository = InMemoryEssaiRepository.getInstance();

// Injection du repository dans le Use Case
const enregistrerEssaiMotoUseCase = new EnregistrerEssaiMotoUseCase(essaiRepository);

export { essaiRepository, enregistrerEssaiMotoUseCase };
