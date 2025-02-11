import { InMemoryIncidentRepository } from '../adapters/database/in-memory/InMemoryIncidentRepository';
import { InMemoryEssaiRepository } from '../adapters/database/in-memory/InMemoryEssaiRepository';
import { InMemoryConducteurRepository } from '../adapters/database/in-memory/InMemoryConducteurRepository';
import { InMemoryMotoRepository } from '../adapters/database/in-memory/InMemoryMotoRepository';
import { EnregistrerIncidentUseCase } from '../../application/use-cases/EnregistrerIncidentUseCase';

// Singleton : Instanciation unique des repositories nécessaires
const incidentRepository = InMemoryIncidentRepository.getInstance();
const essaiRepository = InMemoryEssaiRepository.getInstance();
const conducteurRepository = InMemoryConducteurRepository.getInstance();
const motoRepository = InMemoryMotoRepository.getInstance();

// Injection des repositories dans le Use Case
const enregistrerIncidentUseCase = new EnregistrerIncidentUseCase(incidentRepository, essaiRepository, conducteurRepository, motoRepository);

export { incidentRepository, essaiRepository, conducteurRepository, motoRepository, enregistrerIncidentUseCase };
