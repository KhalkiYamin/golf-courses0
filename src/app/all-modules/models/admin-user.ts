export interface UserCategory {
    id?: number;
    title: string;
    description: string;
}

export interface AdminUser {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    role: string;

    specialite: UserCategory | string | null;
    sport: UserCategory | null;

    niveau: string | null;
    categorie: string | null;
    statut: string;
    enabled: boolean;

    experience?: number | null;
    emailVerified?: boolean;
    adminApproved?: boolean;
}