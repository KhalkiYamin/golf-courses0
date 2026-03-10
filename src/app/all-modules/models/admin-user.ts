export interface AdminUser {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    role: string;
    specialite: string | null;
    sport: string | null;
    statut: string;
    enabled: boolean;
}