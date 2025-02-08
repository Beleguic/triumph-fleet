// src/domain/entities/Essai.ts

import { Moto } from './Moto';
import { Conducteur } from './Conducteur';

/**
 * Interface décrivant les propriétés nécessaires pour créer un essai.
 */
export interface EssaiProps {
  id?: number;                 // Identifiant optionnel, généré par la base de données
  moto: Moto;                  // La moto utilisée pour l'essai
  conducteur: Conducteur;      // Le conducteur qui réalise l'essai
  dateDebut: Date;             // Date de début de l'essai
  dateFin?: Date;              // Date de fin de l'essai (optionnelle, par exemple si l'essai est en cours)
  kilometrageParcouru: number; // Kilométrage parcouru durant l'essai
}

/**
 * Classe représentant l'entité Essai dans le domaine.
 * 
 * Cette classe encapsule les propriétés et règles métiers associées à un essai.
 */
export class Essai {
  private readonly _id?: number;
  private _moto: Moto;
  private _conducteur: Conducteur;
  private _dateDebut: Date;
  private _dateFin?: Date;
  private _kilometrageParcouru: number;

  constructor(props: EssaiProps) {
    if (!(props.dateDebut instanceof Date)) {
      throw new Error("La date de début doit être une instance de Date.");
    }
    if (props.dateFin !== undefined && !(props.dateFin instanceof Date)) {
      throw new Error("La date de fin doit être une instance de Date si elle est définie.");
    }
    if (props.kilometrageParcouru < 0) {
      throw new Error("Le kilométrage parcouru ne peut pas être négatif.");
    }

    this._id = props.id;
    this._moto = props.moto;
    this._conducteur = props.conducteur;
    this._dateDebut = props.dateDebut;
    this._dateFin = props.dateFin;
    this._kilometrageParcouru = props.kilometrageParcouru;
  }

  // Getter pour l'identifiant (lecture seule)
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

  // Getter et setter pour le conducteur
  public get conducteur(): Conducteur {
    return this._conducteur;
  }

  public set conducteur(value: Conducteur) {
    this._conducteur = value;
  }

  // Getter et setter pour la date de début
  public get dateDebut(): Date {
    return this._dateDebut;
  }

  public set dateDebut(value: Date) {
    if (!(value instanceof Date)) {
      throw new Error("La date de début doit être une instance de Date.");
    }
    this._dateDebut = value;
  }

  // Getter et setter pour la date de fin
  public get dateFin(): Date | undefined {
    return this._dateFin;
  }

  public set dateFin(value: Date | undefined) {
    if (value !== undefined && !(value instanceof Date)) {
      throw new Error("La date de fin doit être une instance de Date.");
    }
    this._dateFin = value;
  }

  // Getter et setter pour le kilométrage parcouru
  public get kilometrageParcouru(): number {
    return this._kilometrageParcouru;
  }

  public set kilometrageParcouru(value: number) {
    if (value < 0) {
      throw new Error("Le kilométrage parcouru ne peut pas être négatif.");
    }
    this._kilometrageParcouru = value;
  }

  /**
   * Méthode utilitaire pour convertir l'entité en objet JSON.
   */
  public toJSON() {
    return {
      id: this._id,
      moto: typeof this._moto.toJSON === 'function' ? this._moto.toJSON() : this._moto,
      conducteur: typeof this._conducteur.toJSON === 'function' ? this._conducteur.toJSON() : this._conducteur,
      dateDebut: this._dateDebut,
      dateFin: this._dateFin,
      kilometrageParcouru: this._kilometrageParcouru,
    };
  }
}
