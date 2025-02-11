import { InMemoryStockRepository } from '../adapters/database/in-memory/InMemoryStockRepository';
import { InMemoryPieceRepository } from '../adapters/database/in-memory/InMemoryPieceRepository';
import { GererStockPiecesUseCase } from '../../application/use-cases/GererStockPiecesUseCase';

// Singleton : Instanciation unique des repositories nécessaires
const stockRepository = InMemoryStockRepository.getInstance();
const pieceRepository = InMemoryPieceRepository.getInstance();

// Injection des repositories dans le Use Case
const gererStockPiecesUseCase = new GererStockPiecesUseCase(stockRepository, pieceRepository);

export { stockRepository, pieceRepository, gererStockPiecesUseCase };
