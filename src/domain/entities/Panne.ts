// src/domain/entities/Panne.ts

import { Moto } from './Moto';
import { Entretien } from './Entretien';

/**
 * Interface décrivant les propriétés nécessaires pour créer une panne.
 */
export interface PanneProps {
  id?: number;             // Identifiant optionnel, généré par la base de données
  moto?: Moto;             // La panne peut être liée directement à une moto (optionnel)
  entretien?: Entretien;   // ... ou enregistrée dans le cadre d'un entretien (optionnel)
  dateEvent: Date;         // Date de survenue de la panne
  description: string;     // Description de la panne
  cout: number;            // Coût associé à la panne (réparation, etc.)
  sousGarantie?: boolean;   // Indique si la panne est couverte par la garantie (optionnel, défaut à false)
}

/**
 * Classe représentant l'entité Panne dans le domaine.
 * 
 * Cette classe encapsule les propriétés et règles métiers associées à une panne,
 * qui peut être liée soit à une moto directement, soit à un entretien.
 */
export class Panne {
  private readonly _id?: number;
  private _moto?: Moto;
  private _entretien?: Entretien;
  private _dateEvent: Date;
  private _description: string;
  private _cout: number;
  private _sousGarantie: boolean;

  constructor(props: PanneProps) {
    // Vérification basique de validité
    if (!(props.dateEvent instanceof Date)) {
      throw new Error("La date de survenue doit être une instance de Date.");
    }
    if (!props.description.trim()) {
      throw new Error("La description de la panne ne peut pas être vide.");
    }
    if (props.cout < 0) {
      throw new Error("Le coût de la panne ne peut pas être négatif.");
    }
    // On peut éventuellement vérifier qu'au moins une association (moto ou entretien) est présente
    if (!props.moto && !props.entretien) {
      throw new Error("La panne doit être liée soit à une moto, soit à un entretien.");
    }

    this._id = props.id;
    this._moto = props.moto;
    this._entretien = props.entretien;
    this._dateEvent = props.dateEvent;
    this._description = props.description;
    this._cout = props.cout;
    this._sousGarantie = props.sousGarantie ?? false; // Par défaut à false si non précisé
  }

  // Getter pour l'identifiant (lecture seule)
  public get id(): number | undefined {
    return this._id;
  }

  // Getter et setter pour la moto
  public get moto(): Moto | undefined {
    return this._moto;
  }

  public set moto(value: Moto | undefined) {
    this._moto = value;
  }

  // Getter et setter pour l'entretien
  public get entretien(): Entretien | undefined {
    return this._entretien;
  }

  public set entretien(value: Entretien | undefined) {
    this._entretien = value;
  }

  // Getter et setter pour la date de survenue
  public get dateEvent(): Date {
    return this._dateEvent;
  }

  public set dateEvent(value: Date) {
    if (!(value instanceof Date)) {
      throw new Error("La date de survenue doit être une instance de Date.");
    }
    this._dateEvent = value;
  }

  // Getter et setter pour la description
  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    if (!value.trim()) {
      throw new Error("La description de la panne ne peut pas être vide.");
    }
    this._description = value;
  }

  // Getter et setter pour le coût
  public get cout(): number {
    return this._cout;
  }

  public set cout(value: number) {
    if (value < 0) {
      throw new Error("Le coût de la panne ne peut pas être négatif.");
    }
    this._cout = value;
  }

  // Getter et setter pour la garantie
  public get sousGarantie(): boolean {
    return this._sousGarantie;
  }

  public set sousGarantie(value: boolean) {
    this._sousGarantie = value;
  }

  /**
   * Méthode utilitaire pour convertir l'entité en objet JSON.
   */
  public toJSON() {
    return {
      id: this._id,
      moto: this._moto ? (typeof this._moto.toJSON === 'function' ? this._moto.toJSON() : this._moto) : undefined,
      entretien: this._entretien ? (typeof this._entretien.toJSON === 'function' ? this._entretien.toJSON() : this._entretien) : undefined,
      dateEvent: this._dateEvent,
      description: this._description,
      cout: this._cout,
      sousGarantie: this._sousGarantie,
    };
  }
}
