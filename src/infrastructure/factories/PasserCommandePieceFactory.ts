import { InMemoryPieceRepository } from '../adapters/database/in-memory/InMemoryPieceRepository';
import { InMemoryCommandePieceRepository } from '../adapters/database/in-memory/InMemoryCommandePieceRepository';
import { PasserCommandePieceUseCase } from '../../application/use-cases/PasserCommandePieceUseCase';

// Singleton : Instanciation unique des repositories nécessaires
const pieceRepository = InMemoryPieceRepository.getInstance();
const commandePieceRepository = InMemoryCommandePieceRepository.getInstance();

// Injection des repositories dans le Use Case
const passerCommandePieceUseCase = new PasserCommandePieceUseCase(pieceRepository, commandePieceRepository);

export { pieceRepository, commandePieceRepository, passerCommandePieceUseCase };
