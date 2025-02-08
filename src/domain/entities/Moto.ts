// src/domain/entities/Moto.ts

import { ModeleMoto } from './ModeleMoto';
import { Client } from './Client';

/**
 * Interface décrivant les propriétés nécessaires pour créer une moto.
 */
export interface MotoProps {
  id?: number;                // Identifiant optionnel (généré par la base de données)
  modele: ModeleMoto;         // Instance du modèle de la moto
  client?: Client;            // Le client (ou partenaire) auquel la moto est associée (optionnel)
  numeroSerie: string;        // Numéro de série unique de la moto
  kilometrageActuel: number;  // Kilométrage actuel de la moto
  dateAchat: Date;            // Date d'achat de la moto
  statut: string;             // Statut de la moto (ex: "disponible", "en entretien", etc.)
}

/**
 * Classe représentant l'entité Moto dans le domaine.
 * 
 * Elle encapsule les propriétés et les règles métiers associées à une moto.
 */
export class Moto {
  private readonly _id?: number;
  private _modele: ModeleMoto;
  private _client?: Client;
  private _numeroSerie: string;
  private _kilometrageActuel: number;
  private _dateAchat: Date;
  private _statut: string;

  constructor(props: MotoProps) {
    if (!props.numeroSerie.trim()) {
      throw new Error("Le numéro de série ne peut pas être vide.");
    }
    if (props.kilometrageActuel < 0) {
      throw new Error("Le kilométrage actuel ne peut pas être négatif.");
    }
    if (!props.statut.trim()) {
      throw new Error("Le statut de la moto ne peut pas être vide.");
    }
    this._id = props.id;
    this._modele = props.modele;
    this._client = props.client;
    this._numeroSerie = props.numeroSerie;
    this._kilometrageActuel = props.kilometrageActuel;
    this._dateAchat = props.dateAchat;
    this._statut = props.statut;
  }

  // Getter pour l'identifiant (lecture seule)
  public get id(): number | undefined {
    return this._id;
  }

  // Getter et setter pour le modèle de la moto
  public get modele(): ModeleMoto {
    return this._modele;
  }

  public set modele(value: ModeleMoto) {
    this._modele = value;
  }

  // Getter et setter pour le client associé
  public get client(): Client | undefined {
    return this._client;
  }

  public set client(value: Client | undefined) {
    this._client = value;
  }

  // Getter pour le numéro de série (immuable après création)
  public get numeroSerie(): string {
    return this._numeroSerie;
  }

  // Getter et setter pour le kilométrage actuel
  public get kilometrageActuel(): number {
    return this._kilometrageActuel;
  }

  public set kilometrageActuel(value: number) {
    if (value < 0) {
      throw new Error("Le kilométrage actuel ne peut pas être négatif.");
    }
    this._kilometrageActuel = value;
  }

  // Getter pour la date d'achat (immuable après création)
  public get dateAchat(): Date {
    return this._dateAchat;
  }

  // Getter et setter pour le statut de la moto
  public get statut(): string {
    return this._statut;
  }

  public set statut(value: string) {
    if (!value.trim()) {
      throw new Error("Le statut ne peut pas être vide.");
    }
    this._statut = value;
  }

  /**
   * Méthode utilitaire pour convertir l'entité en objet JSON.
   */
  public toJSON() {
    return {
      id: this._id,
      modele: typeof this._modele.toJSON === 'function' ? this._modele.toJSON() : this._modele,
      client: this._client ? (typeof this._client.toJSON === 'function' ? this._client.toJSON() : this._client) : undefined,
      numeroSerie: this._numeroSerie,
      kilometrageActuel: this._kilometrageActuel,
      dateAchat: this._dateAchat,
      statut: this._statut,
    };
  }
}
