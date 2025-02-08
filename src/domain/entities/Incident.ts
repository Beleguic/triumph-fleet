// src/domain/entities/Incident.ts

import { Essai } from './Essai';
import { Conducteur } from './Conducteur';
import { Moto } from './Moto';

/**
 * Interface décrivant les propriétés nécessaires pour créer un incident.
 */
export interface IncidentProps {
  id?: number;               // Identifiant optionnel, généré par la base de données
  essai?: Essai;             // Incident rattaché à un essai (optionnel)
  conducteur?: Conducteur;   // Incident rattaché à un conducteur (optionnel)
  moto?: Moto;               // Incident impactant une moto (optionnel)
  dateIncident: Date;        // Date de survenue de l'incident
  description: string;       // Description de l'incident (accident, infraction, etc.)
  severite: string;          // Sévérité de l'incident (ex. "faible", "moyenne", "élevée")
}

/**
 * Classe représentant l'entité Incident dans le domaine.
 * 
 * Cette classe encapsule les données et la logique métier liées aux incidents,
 * qui peuvent être rattachés à un essai, un conducteur et/ou une moto.
 */
export class Incident {
  private readonly _id?: number;
  private _essai?: Essai;
  private _conducteur?: Conducteur;
  private _moto?: Moto;
  private _dateIncident: Date;
  private _description: string;
  private _severite: string;

  constructor(props: IncidentProps) {
    if (!(props.dateIncident instanceof Date)) {
      throw new Error("La date de l'incident doit être une instance de Date.");
    }
    if (!props.description.trim()) {
      throw new Error("La description de l'incident ne peut pas être vide.");
    }
    if (!props.severite.trim()) {
      throw new Error("La sévérité de l'incident ne peut pas être vide.");
    }
    // Vérifier qu'au moins une association est présente (essai, conducteur ou moto)
    if (!props.essai && !props.conducteur && !props.moto) {
      throw new Error("L'incident doit être lié à au moins un essai, un conducteur ou une moto.");
    }

    this._id = props.id;
    this._essai = props.essai;
    this._conducteur = props.conducteur;
    this._moto = props.moto;
    this._dateIncident = props.dateIncident;
    this._description = props.description;
    this._severite = props.severite;
  }

  // Getter pour l'identifiant (lecture seule)
  public get id(): number | undefined {
    return this._id;
  }

  // Getter et setter pour l'essai
  public get essai(): Essai | undefined {
    return this._essai;
  }

  public set essai(value: Essai | undefined) {
    this._essai = value;
  }

  // Getter et setter pour le conducteur
  public get conducteur(): Conducteur | undefined {
    return this._conducteur;
  }

  public set conducteur(value: Conducteur | undefined) {
    this._conducteur = value;
  }

  // Getter et setter pour la moto
  public get moto(): Moto | undefined {
    return this._moto;
  }

  public set moto(value: Moto | undefined) {
    this._moto = value;
  }

  // Getter et setter pour la date de l'incident
  public get dateIncident(): Date {
    return this._dateIncident;
  }

  public set dateIncident(value: Date) {
    if (!(value instanceof Date)) {
      throw new Error("La date de l'incident doit être une instance de Date.");
    }
    this._dateIncident = value;
  }

  // Getter et setter pour la description
  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    if (!value.trim()) {
      throw new Error("La description de l'incident ne peut pas être vide.");
    }
    this._description = value;
  }

  // Getter et setter pour la sévérité
  public get severite(): string {
    return this._severite;
  }

  public set severite(value: string) {
    if (!value.trim()) {
      throw new Error("La sévérité de l'incident ne peut pas être vide.");
    }
    this._severite = value;
  }

  /**
   * Méthode utilitaire pour convertir l'entité en objet JSON.
   */
  public toJSON() {
    return {
      id: this._id,
      essai: this._essai ? (typeof this._essai.toJSON === 'function' ? this._essai.toJSON() : this._essai) : undefined,
      conducteur: this._conducteur ? (typeof this._conducteur.toJSON === 'function' ? this._conducteur.toJSON() : this._conducteur) : undefined,
      moto: this._moto ? (typeof this._moto.toJSON === 'function' ? this._moto.toJSON() : this._moto) : undefined,
      dateIncident: this._dateIncident,
      description: this._description,
      severite: this._severite,
    };
  }
}
