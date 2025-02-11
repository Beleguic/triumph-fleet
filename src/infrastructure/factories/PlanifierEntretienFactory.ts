import { InMemoryMotoRepository } from '../adapters/database/in-memory/InMemoryMotoRepository';
import { InMemoryEntretienRepository } from '../adapters/database/in-memory/InMemoryEntretienRepository';
import { PlanifierEntretienUseCase } from '../../application/use-cases/PlanifierEntretienUseCase';

// Singleton : Instanciation unique des repositories nécessaires
const motoRepository = InMemoryMotoRepository.getInstance();
const entretienRepository = InMemoryEntretienRepository.getInstance();

// Injection des repositories dans le Use Case
const planifierEntretienUseCase = new PlanifierEntretienUseCase(motoRepository, entretienRepository);

export { motoRepository, entretienRepository, planifierEntretienUseCase };
