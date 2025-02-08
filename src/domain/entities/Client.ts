// src/domain/entities/Client.ts

/**
 * Interface décrivant les propriétés d'un client ou partenaire.
 */
export interface ClientProps {
    id?: number;          // Identifiant optionnel, généré par la base de données
    nom: string;          // Nom du client (ex : "Livraison Express", "Concessionnaire XYZ")
    type: string;         // Type de client (ex : 'entreprise', 'concessionnaire', etc.)
    contactInfo?: string; // Informations de contact (email, téléphone, etc.)
  }
  
  /**
   * Classe représentant l'entité Client dans le domaine.
   * 
   * Cette classe encapsule les propriétés d'un client et garantit
   * leur validité conformément aux règles métiers.
   */
  export class Client {
    private readonly _id?: number;
    private _nom: string;
    private _type: string;
    private _contactInfo?: string;
  
    constructor(props: ClientProps) {
      if (!props.nom.trim()) {
        throw new Error("Le nom du client ne peut pas être vide.");
      }
      if (!props.type.trim()) {
        throw new Error("Le type de client ne peut pas être vide.");
      }
      this._id = props.id;
      this._nom = props.nom;
      this._type = props.type;
      this._contactInfo = props.contactInfo;
    }
  
    // Getter pour l'identifiant (en lecture seule)
    public get id(): number | undefined {
      return this._id;
    }
  
    // Getter et setter pour le nom du client
    public get nom(): string {
      return this._nom;
    }
  
    public set nom(value: string) {
      if (!value.trim()) {
        throw new Error("Le nom du client ne peut pas être vide.");
      }
      this._nom = value;
    }
  
    // Getter et setter pour le type de client
    public get type(): string {
      return this._type;
    }
  
    public set type(value: string) {
      if (!value.trim()) {
        throw new Error("Le type de client ne peut pas être vide.");
      }
      this._type = value;
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
        type: this._type,
        contactInfo: this._contactInfo,
      };
    }
  }
  