// src/domain/entities/CommandePiece.ts

import { Piece } from './Piece';

/**
 * Interface décrivant les propriétés nécessaires pour créer une commande de pièces.
 */
export interface CommandePieceProps {
  id?: number;               // Identifiant optionnel, généré par la base de données
  piece: Piece;              // La pièce détachée commandée
  dateCommande: Date;        // Date de la commande
  quantite: number;          // Quantité commandée (doit être supérieure à zéro)
  cout: number;              // Coût total de la commande (doit être positif ou nul)
  delaiLivraison?: number;   // Délai de livraison en jours (optionnel)
  statut: string;            // Statut de la commande (ex : "en cours", "livrée", etc.)
}

/**
 * Classe représentant l'entité CommandePiece dans le domaine.
 * 
 * Cette classe encapsule les propriétés et règles métiers associées à une commande de pièces détachées.
 */
export class CommandePiece {
  private readonly _id?: number;
  private _piece: Piece;
  private _dateCommande: Date;
  private _quantite: number;
  private _cout: number;
  private _delaiLivraison?: number; // Ajout du délai de livraison
  private _statut: string;

  constructor(props: CommandePieceProps) {
    if (!(props.dateCommande instanceof Date)) {
      throw new Error("La date de commande doit être une instance de Date.");
    }
    if (props.quantite <= 0) {
      throw new Error("La quantité commandée doit être supérieure à zéro.");
    }
    if (props.cout < 0) {
      throw new Error("Le coût de la commande ne peut pas être négatif.");
    }
    if (!props.statut.trim()) {
      throw new Error("Le statut de la commande ne peut pas être vide.");
    }
    if (props.delaiLivraison !== undefined && props.delaiLivraison < 0) {
      throw new Error("Le délai de livraison ne peut pas être négatif.");
    }

    this._id = props.id;
    this._piece = props.piece;
    this._dateCommande = props.dateCommande;
    this._quantite = props.quantite;
    this._cout = props.cout;
    this._delaiLivraison = props.delaiLivraison;
    this._statut = props.statut;
  }

  // Getter pour l'identifiant (en lecture seule)
  public get id(): number | undefined {
    return this._id;
  }

  // Getter et setter pour la pièce commandée
  public get piece(): Piece {
    return this._piece;
  }

  public set piece(value: Piece) {
    this._piece = value;
  }

  // Getter et setter pour la date de commande
  public get dateCommande(): Date {
    return this._dateCommande;
  }

  public set dateCommande(value: Date) {
    if (!(value instanceof Date)) {
      throw new Error("La date de commande doit être une instance de Date.");
    }
    this._dateCommande = value;
  }

  // Getter et setter pour la quantité commandée
  public get quantite(): number {
    return this._quantite;
  }

  public set quantite(value: number) {
    if (value <= 0) {
      throw new Error("La quantité commandée doit être supérieure à zéro.");
    }
    this._quantite = value;
  }

  // Getter et setter pour le coût de la commande
  public get cout(): number {
    return this._cout;
  }

  public set cout(value: number) {
    if (value < 0) {
      throw new Error("Le coût de la commande ne peut pas être négatif.");
    }
    this._cout = value;
  }

  // Getter et setter pour le délai de livraison
  public get delaiLivraison(): number | undefined {
    return this._delaiLivraison;
  }

  public set delaiLivraison(value: number | undefined) {
    if (value !== undefined && value < 0) {
      throw new Error("Le délai de livraison ne peut pas être négatif.");
    }
    this._delaiLivraison = value;
  }

  // Getter et setter pour le statut de la commande
  public get statut(): string {
    return this._statut;
  }

  public set statut(value: string) {
    if (!value.trim()) {
      throw new Error("Le statut de la commande ne peut pas être vide.");
    }
    this._statut = value;
  }

  /**
   * Méthode utilitaire pour convertir l'entité en objet JSON.
   */
  public toJSON() {
    return {
      id: this._id,
      piece: typeof this._piece.toJSON === 'function' ? this._piece.toJSON() : this._piece,
      dateCommande: this._dateCommande,
      quantite: this._quantite,
      cout: this._cout,
      delaiLivraison: this._delaiLivraison, // Ajout du délai de livraison dans le JSON
      statut: this._statut,
    };
  }
}
