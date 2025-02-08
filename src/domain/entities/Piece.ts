// src/domain/entities/Piece.ts

/**
 * Interface décrivant les propriétés d'une pièce détachée.
 */
export interface PieceProps {
    id?: number;           // Identifiant optionnel, généré par la base de données
    nom: string;           // Nom de la pièce (ex : "filtre à huile", "pneu", "frein")
    description?: string;  // Description détaillée de la pièce (optionnelle)
    prix: number;          // Prix de la pièce, doit être positif
  }
  
  /**
   * Classe représentant l'entité Piece dans le domaine.
   * 
   * Cette classe encapsule les propriétés et les règles métiers associées à une pièce détachée.
   */
  export class Piece {
    private readonly _id?: number;
    private _nom: string;
    private _description?: string;
    private _prix: number;
  
    constructor(props: PieceProps) {
      if (!props.nom.trim()) {
        throw new Error("Le nom de la pièce ne peut pas être vide.");
      }
      if (props.prix < 0) {
        throw new Error("Le prix de la pièce ne peut pas être négatif.");
      }
      this._id = props.id;
      this._nom = props.nom;
      this._description = props.description;
      this._prix = props.prix;
    }
  
    // Getter pour l'identifiant (lecture seule)
    public get id(): number | undefined {
      return this._id;
    }
  
    // Getter et setter pour le nom de la pièce
    public get nom(): string {
      return this._nom;
    }
  
    public set nom(value: string) {
      if (!value.trim()) {
        throw new Error("Le nom de la pièce ne peut pas être vide.");
      }
      this._nom = value;
    }
  
    // Getter et setter pour la description
    public get description(): string | undefined {
      return this._description;
    }
  
    public set description(value: string | undefined) {
      this._description = value;
    }
  
    // Getter et setter pour le prix
    public get prix(): number {
      return this._prix;
    }
  
    public set prix(value: number) {
      if (value < 0) {
        throw new Error("Le prix de la pièce ne peut pas être négatif.");
      }
      this._prix = value;
    }
  
    /**
     * Méthode utilitaire pour convertir l'entité en objet JSON.
     */
    public toJSON() {
      return {
        id: this._id,
        nom: this._nom,
        description: this._description,
        prix: this._prix,
      };
    }
  }
  