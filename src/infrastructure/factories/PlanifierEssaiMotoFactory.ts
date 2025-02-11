import { InMemoryEssaiRepository } from '../adapters/database/in-memory/InMemoryEssaiRepository';
import { InMemoryMotoRepository } from '../adapters/database/in-memory/InMemoryMotoRepository';
import { InMemoryConducteurRepository } from '../adapters/database/in-memory/InMemoryConducteurRepository';
import { PlanifierEssaiMotoUseCase } from '../../application/use-cases/PlanifierEssaiMotoUseCase';

// Singleton : Instanciation unique des repositories nécessaires
const essaiRepository = InMemoryEssaiRepository.getInstance();
const motoRepository = InMemoryMotoRepository.getInstance();
const conducteurRepository = InMemoryConducteurRepository.getInstance();

// Injection des repositories dans le Use Case
const planifierEssaiMotoUseCase = new PlanifierEssaiMotoUseCase(essaiRepository, motoRepository, conducteurRepository);

export { essaiRepository, motoRepository, conducteurRepository, planifierEssaiMotoUseCase };
