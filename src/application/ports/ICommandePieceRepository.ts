import { CommandePiece } from '../../domain/entities/CommandePiece';

/**
 * Interface décrivant les méthodes à implémenter pour accéder aux données de l'entité CommandePiece.
 */
export interface ICommandePieceRepository {
  /**
   * Recherche une commande de pièce par son identifiant.
   * @param id L'identifiant de la commande.
   * @returns Une promesse contenant l'instance de CommandePiece trouvée ou null si aucune commande n'est trouvée.
   */
  findById(id: number): Promise<CommandePiece | null>;

  /**
   * Enregistre (ou met à jour) une commande de pièce.
   * Si la commande n'a pas d'identifiant, un nouvel identifiant sera généré.
   * @param commande L'instance de CommandePiece à enregistrer.
   * @returns Une promesse contenant la commande enregistrée.
   */
  save(commande: CommandePiece): Promise<CommandePiece>;

  /**
   * Met à jour une commande de pièce existante.
   * @param commande L'instance de CommandePiece à mettre à jour.
   * @returns Une promesse contenant la commande mise à jour.
   */
  update(commande: CommandePiece): Promise<CommandePiece>;

  /**
   * Retourne la liste de toutes les commandes enregistrées.
   * @returns Une promesse contenant un tableau de CommandePiece.
   */
  findAll(): Promise<CommandePiece[]>;

  /**
   * Recherche les commandes passées pour une pièce donnée.
   * @param pieceId L'identifiant de la pièce concernée.
   * @returns Une promesse contenant un tableau de CommandePiece pour cette pièce.
   */
  findByPieceId(pieceId: number): Promise<CommandePiece[]>;

  /**
   * Supprime une commande de pièce par son identifiant.
   * @param id L'identifiant de la commande à supprimer.
   * @returns Une promesse contenant `true` si la suppression a réussi, sinon `false`.
   */
  delete(id: number): Promise<boolean>;
}
