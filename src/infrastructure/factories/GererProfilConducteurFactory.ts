import { InMemoryConducteurRepository } from '../adapters/database/in-memory/InMemoryConducteurRepository';
import { GererProfilConducteurUseCase } from '../../application/use-cases/GererProfilConducteurUseCase';

// Singleton : Instanciation unique du repository Conducteur
const conducteurRepository = InMemoryConducteurRepository.getInstance();

// Injection du repository dans le Use Case
const gererProfilConducteurUseCase = new GererProfilConducteurUseCase(conducteurRepository);

export { conducteurRepository, gererProfilConducteurUseCase };
