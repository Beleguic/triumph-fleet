import { InMemoryMotoRepository } from '../adapters/database/in-memory/InMemoryMotoRepository';
import { InMemoryModeleMotoRepository } from '../adapters/database/in-memory/inMemoryModeleMotoRepository';
import { InMemoryClientRepository } from '../adapters/database/in-memory/InMemoryClientRepository';
import { GererMotoUseCase } from '../../application/use-cases/GererMotoUseCase';

// Singleton : Instanciation unique des repositories nécessaires
const motoRepository = InMemoryMotoRepository.getInstance();
const modeleMotoRepository = InMemoryModeleMotoRepository.getInstance();
const clientRepository = InMemoryClientRepository.getInstance();

// Injection des repositories dans le Use Case
const gererMotoUseCase = new GererMotoUseCase(motoRepository, modeleMotoRepository, clientRepository);

export { motoRepository, modeleMotoRepository, clientRepository, gererMotoUseCase };
