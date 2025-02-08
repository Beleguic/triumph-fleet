// src/domain/entities/Stock.ts

import { Piece } from './Piece';

/**
 * Interface décrivant les propriétés nécessaires pour créer un stock.
 */
export interface StockProps {
  id?: number;          // Identifiant optionnel, généré par la base de données
  piece: Piece;         // La pièce détachée associée au stock
  quantite: number;     // Quantité en stock, doit être positive ou nulle
  seuilAlerte?: number; // Seuil d'alerte pour le stock, optionnel (par défaut à 0)
}

/**
 * Classe représentant l'entité Stock dans le domaine.
 * 
 * Cette classe encapsule les informations liées au suivi de l'inventaire
 * des pièces détachées et assure la validité des données via des validations.
 */
export class Stock {
  private readonly _id?: number;
  private _piece: Piece;
  private _quantite: number;
  private _seuilAlerte: number;

  constructor(props: StockProps) {
    if (props.quantite < 0) {
      throw new Error("La quantité en stock ne peut pas être négative.");
    }
    if (props.seuilAlerte !== undefined && props.seuilAlerte < 0) {
      throw new Error("Le seuil d'alerte ne peut pas être négatif.");
    }
    this._id = props.id;
    this._piece = props.piece;
    this._quantite = props.quantite;
    this._seuilAlerte = props.seuilAlerte ?? 0; // Par défaut à 0 si non précisé
  }

  // Getter pour l'identifiant (lecture seule)
  public get id(): number | undefined {
    return this._id;
  }

  // Getter et setter pour la pièce associée
  public get piece(): Piece {
    return this._piece;
  }

  public set piece(value: Piece) {
    this._piece = value;
  }

  // Getter et setter pour la quantité en stock
  public get quantite(): number {
    return this._quantite;
  }

  public set quantite(value: number) {
    if (value < 0) {
      throw new Error("La quantité en stock ne peut pas être négative.");
    }
    this._quantite = value;
  }

  // Getter et setter pour le seuil d'alerte
  public get seuilAlerte(): number {
    return this._seuilAlerte;
  }

  public set seuilAlerte(value: number) {
    if (value < 0) {
      throw new Error("Le seuil d'alerte ne peut pas être négatif.");
    }
    this._seuilAlerte = value;
  }

  /**
   * Méthode utilitaire pour convertir l'entité en objet JSON.
   */
  public toJSON() {
    return {
      id: this._id,
      piece: typeof this._piece.toJSON === 'function' ? this._piece.toJSON() : this._piece,
      quantite: this._quantite,
      seuilAlerte: this._seuilAlerte,
    };
  }
}
