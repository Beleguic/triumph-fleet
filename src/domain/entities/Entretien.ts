// src/domain/entities/Entretien.ts

import { Moto } from './Moto';

/**
 * Interface décrivant les propriétés nécessaires pour créer un entretien.
 */
export interface EntretienProps {
  id?: number;              // Identifiant optionnel, généré par la base de données
  moto: Moto;               // La moto concernée par l'entretien
  typeEntretien: string;    // Type d'entretien (ex : "préventif" ou "curatif")
  datePlanifiee?: Date;     // Date prévue pour l'entretien (optionnelle)
  dateRealisee?: Date;      // Date effective de l'entretien (optionnelle)
  kilometrage: number;      // Kilométrage relevé lors de l'entretien
  cout: number;             // Coût de l'entretien
  description: string;      // Description ou observations relatives à l'entretien
}

/**
 * Classe représentant l'entité Entretien dans le domaine.
 * 
 * Cette classe encapsule les propriétés et règles métiers associées à un entretien.
 */
export class Entretien {
  private readonly _id?: number;
  private _moto: Moto;
  private _typeEntretien: string;
  private _datePlanifiee?: Date;
  private _dateRealisee?: Date;
  private _kilometrage: number;
  private _cout: number;
  private _description: string;

  constructor(props: EntretienProps) {
    if (!props.typeEntretien.trim()) {
      throw new Error("Le type d'entretien ne peut pas être vide.");
    }
    if (props.kilometrage < 0) {
      throw new Error("Le kilométrage ne peut pas être négatif.");
    }
    if (props.cout < 0) {
      throw new Error("Le coût de l'entretien ne peut pas être négatif.");
    }
    this._id = props.id;
    this._moto = props.moto;
    this._typeEntretien = props.typeEntretien;
    this._datePlanifiee = props.datePlanifiee;
    this._dateRealisee = props.dateRealisee;
    this._kilometrage = props.kilometrage;
    this._cout = props.cout;
    this._description = props.description;
  }

  // Getter pour l'identifiant (en lecture seule)
  public get id(): number | undefined {
    return this._id;
  }

  // Getter et setter pour la moto
  public get moto(): Moto {
    return this._moto;
  }

  public set moto(value: Moto) {
    this._moto = value;
  }

  // Getter et setter pour le type d'entretien
  public get typeEntretien(): string {
    return this._typeEntretien;
  }

  public set typeEntretien(value: string) {
    if (!value.trim()) {
      throw new Error("Le type d'entretien ne peut pas être vide.");
    }
    this._typeEntretien = value;
  }

  // Getter et setter pour la date planifiée
  public get datePlanifiee(): Date | undefined {
    return this._datePlanifiee;
  }

  public set datePlanifiee(value: Date | undefined) {
    this._datePlanifiee = value;
  }

  // Getter et setter pour la date réalisée
  public get dateRealisee(): Date | undefined {
    return this._dateRealisee;
  }

  public set dateRealisee(value: Date | undefined) {
    this._dateRealisee = value;
  }

  // Getter et setter pour le kilométrage
  public get kilometrage(): number {
    return this._kilometrage;
  }

  public set kilometrage(value: number) {
    if (value < 0) {
      throw new Error("Le kilométrage ne peut pas être négatif.");
    }
    this._kilometrage = value;
  }

  // Getter et setter pour le coût
  public get cout(): number {
    return this._cout;
  }

  public set cout(value: number) {
    if (value < 0) {
      throw new Error("Le coût ne peut pas être négatif.");
    }
    this._cout = value;
  }

  // Getter et setter pour la description
  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }

  /**
   * Méthode utilitaire pour convertir l'entité en objet JSON.
   */
  public toJSON() {
    return {
      id: this._id,
      moto: typeof this._moto.toJSON === 'function' ? this._moto.toJSON() : this._moto,
      typeEntretien: this._typeEntretien,
      datePlanifiee: this._datePlanifiee,
      dateRealisee: this._dateRealisee,
      kilometrage: this._kilometrage,
      cout: this._cout,
      description: this._description,
    };
  }
}
