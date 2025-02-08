// src/domain/entities/Notification.ts

import { Entretien } from './Entretien';
import { Client } from './Client';

/**
 * Interface décrivant les propriétés nécessaires pour créer une notification.
 */
export interface NotificationProps {
  id?: number;              // Identifiant optionnel, généré par la base de données
  entretien: Entretien;      // Notification liée à un entretien planifié
  client: Client;            // Notification destinée à un client ou gestionnaire
  message: string;           // Message de la notification
  dateNotification: Date;    // Date d'envoi de la notification
  estLu: boolean;            // Indique si la notification a été lue
}

/**
 * Classe représentant l'entité Notification dans le domaine.
 * 
 * Cette classe encapsule les données et règles métiers associées à une notification,
 * qui est générée à partir d'un entretien et adressée à un client ou gestionnaire.
 */
export class Notification {
  private readonly _id?: number;
  private _entretien: Entretien;
  private _client: Client;
  private _message: string;
  private _dateNotification: Date;
  private _estLu: boolean;

  constructor(props: NotificationProps) {
    if (!props.message.trim()) {
      throw new Error("Le message de la notification ne peut pas être vide.");
    }
    if (!(props.dateNotification instanceof Date)) {
      throw new Error("La date de notification doit être une instance de Date.");
    }
    this._id = props.id;
    this._entretien = props.entretien;
    this._client = props.client;
    this._message = props.message;
    this._dateNotification = props.dateNotification;
    this._estLu = props.estLu;
  }

  // Getter pour l'identifiant (lecture seule)
  public get id(): number | undefined {
    return this._id;
  }

  // Getter et setter pour l'entretien associé
  public get entretien(): Entretien {
    return this._entretien;
  }

  public set entretien(value: Entretien) {
    this._entretien = value;
  }

  // Getter et setter pour le client destinataire
  public get client(): Client {
    return this._client;
  }

  public set client(value: Client) {
    this._client = value;
  }

  // Getter et setter pour le message de la notification
  public get message(): string {
    return this._message;
  }

  public set message(value: string) {
    if (!value.trim()) {
      throw new Error("Le message de la notification ne peut pas être vide.");
    }
    this._message = value;
  }

  // Getter et setter pour la date d'envoi de la notification
  public get dateNotification(): Date {
    return this._dateNotification;
  }

  public set dateNotification(value: Date) {
    if (!(value instanceof Date)) {
      throw new Error("La date de notification doit être une instance de Date.");
    }
    this._dateNotification = value;
  }

  // Getter et setter pour le statut de lecture
  public get estLu(): boolean {
    return this._estLu;
  }

  public set estLu(value: boolean) {
    this._estLu = value;
  }

  /**
   * Méthode utilitaire pour convertir l'entité en objet JSON.
   */
  public toJSON() {
    return {
      id: this._id,
      entretien: typeof this._entretien.toJSON === 'function' ? this._entretien.toJSON() : this._entretien,
      client: typeof this._client.toJSON === 'function' ? this._client.toJSON() : this._client,
      message: this._message,
      dateNotification: this._dateNotification,
      estLu: this._estLu,
    };
  }
}
