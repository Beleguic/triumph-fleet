// src/domain/entities/Conducteur.ts

/**
 * Interface décrivant les propriétés nécessaires pour créer un conducteur.
 */
export interface ConducteurProps {
    id?: number;             // Identifiant optionnel, généré par la base de données
    nom: string;             // Nom du conducteur
    permis: string;          // Numéro ou type de permis du conducteur
    experienceAnnees: number; // Nombre d'années d'expérience du conducteur
    contactInfo?: string;    // Informations de contact (email, téléphone, etc.), optionnel
  }
  
  /**
   * Classe représentant l'entité Conducteur dans le domaine.
   * 
   * Cette classe encapsule les informations et règles métiers associées à un conducteur.
   */
  export class Conducteur {
    private readonly _id?: number;
    private _nom: string;
    private _permis: string;
    private _experienceAnnees: number;
    private _contactInfo?: string;
  
    constructor(props: ConducteurProps) {
      if (!props.nom.trim()) {
        throw new Error("Le nom du conducteur ne peut pas être vide.");
      }
      if (!props.permis.trim()) {
        throw new Error("Le permis du conducteur ne peut pas être vide.");
      }
      if (props.experienceAnnees < 0) {
        throw new Error("L'expérience en années ne peut pas être négative.");
      }
      this._id = props.id;
      this._nom = props.nom;
      this._permis = props.permis;
      this._experienceAnnees = props.experienceAnnees;
      this._contactInfo = props.contactInfo;
    }
  
    // Getter pour l'identifiant (lecture seule)
    public get id(): number | undefined {
      return this._id;
    }
  
    // Getter et setter pour le nom
    public get nom(): string {
      return this._nom;
    }
  
    public set nom(value: string) {
      if (!value.trim()) {
        throw new Error("Le nom du conducteur ne peut pas être vide.");
      }
      this._nom = value;
    }
  
    // Getter et setter pour le permis
    public get permis(): string {
      return this._permis;
    }
  
    public set permis(value: string) {
      if (!value.trim()) {
        throw new Error("Le permis du conducteur ne peut pas être vide.");
      }
      this._permis = value;
    }
  
    // Getter et setter pour l'expérience en années
    public get experienceAnnees(): number {
      return this._experienceAnnees;
    }
  
    public set experienceAnnees(value: number) {
      if (value < 0) {
        throw new Error("L'expérience en années ne peut pas être négative.");
      }
      this._experienceAnnees = value;
    }
  
    // Getter et setter pour les informations de contact
    public get contactInfo(): string | undefined {
      return this._contactInfo;
    }
  
    public set contactInfo(value: string | undefined) {
      this._contactInfo = value;
    }
  
    /**
     * Méthode utilitaire pour convertir l'entité en objet JSON.
     */
    public toJSON() {
      return {
        id: this._id,
        nom: this._nom,
        permis: this._permis,
        experienceAnnees: this._experienceAnnees,
        contactInfo: this._contactInfo,
      };
    }
  }
  