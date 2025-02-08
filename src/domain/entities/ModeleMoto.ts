// src/domain/entities/ModeleMoto.ts

/**
 * Interface décrivant les propriétés d'un modèle de moto.
 */
export interface ModeleMotoProps {
    id?: number;           // Optionnel si généré par la base de données
    nom: string;           // Nom du modèle (ex: "Street Triple", "Tiger Sport 660")
    intervalleKm: number;  // Intervalle en kilomètres pour les entretiens (ex: 10000)
    intervalleAnnees: number; // Intervalle en années pour les entretiens (ex: 1)
  }
  
  /**
   * Classe représentant l'entité ModeleMoto dans le domaine.
   * 
   * Cette classe encapsule les propriétés d'un modèle de moto ainsi que les règles métiers associées.
   */
  export class ModeleMoto {
    private readonly _id?: number;
    private _nom: string;
    private _intervalleKm: number;
    private _intervalleAnnees: number;
  
    constructor(props: ModeleMotoProps) {
      this._id = props.id;
      this._nom = props.nom;
      this._intervalleKm = props.intervalleKm;
      this._intervalleAnnees = props.intervalleAnnees;
    }
  
    // Getter pour l'identifiant (en lecture seule)
    public get id(): number | undefined {
      return this._id;
    }
  
    // Getter et setter pour le nom du modèle
    public get nom(): string {
      return this._nom;
    }
  
    public set nom(value: string) {
      if (!value.trim()) {
        throw new Error('Le nom du modèle ne peut pas être vide.');
      }
      this._nom = value;
    }
  
    // Getter et setter pour l'intervalle en kilomètres
    public get intervalleKm(): number {
      return this._intervalleKm;
    }
  
    public set intervalleKm(value: number) {
      if (value < 0) {
        throw new Error("L'intervalle en km ne peut pas être négatif.");
      }
      this._intervalleKm = value;
    }
  
    // Getter et setter pour l'intervalle en années
    public get intervalleAnnees(): number {
      return this._intervalleAnnees;
    }
  
    public set intervalleAnnees(value: number) {
      if (value < 0) {
        throw new Error("L'intervalle en années ne peut pas être négatif.");
      }
      this._intervalleAnnees = value;
    }
  
    /**
     * Méthode utilitaire pour convertir l'entité en objet JSON.
     */
    public toJSON() {
      return {
        id: this._id,
        nom: this._nom,
        intervalleKm: this._intervalleKm,
        intervalleAnnees: this._intervalleAnnees,
      };
    }
  }
  