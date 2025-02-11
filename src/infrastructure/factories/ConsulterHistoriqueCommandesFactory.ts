import { InMemoryCommandePieceRepository } from '../adapters/database/in-memory/InMemoryCommandePieceRepository';
import { ConsulterHistoriqueCommandesUseCase } from '../../application/use-cases/ConsulterHistoriqueCommandesUseCase';

// Singleton : Instanciation unique du repository CommandePiece
const commandePieceRepository = InMemoryCommandePieceRepository.getInstance();

// Injection du repository dans le Use Case
const consulterHistoriqueCommandesUseCase = new ConsulterHistoriqueCommandesUseCase(commandePieceRepository);

export { commandePieceRepository, consulterHistoriqueCommandesUseCase };
