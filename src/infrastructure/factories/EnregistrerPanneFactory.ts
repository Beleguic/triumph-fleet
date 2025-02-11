import { InMemoryPanneRepository } from '../adapters/database/in-memory/InMemoryPanneRepository';
import { InMemoryMotoRepository } from '../adapters/database/in-memory/InMemoryMotoRepository';
import { InMemoryEntretienRepository } from '../adapters/database/in-memory/InMemoryEntretienRepository';
import { EnregistrerPanneUseCase } from '../../application/use-cases/EnregistrerPanneUseCase';

const panneRepository = InMemoryPanneRepository.getInstance();
const motoRepository = InMemoryMotoRepository.getInstance();
const entretienRepository = InMemoryEntretienRepository.getInstance();

// Injection des repositories dans le Use Case
const enregistrerPanneUseCase = new EnregistrerPanneUseCase(panneRepository, motoRepository, entretienRepository);

export { panneRepository, motoRepository, entretienRepository, enregistrerPanneUseCase };
