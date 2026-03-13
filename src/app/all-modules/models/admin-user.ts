export interface CategoryRef {
    id?: number;
    title: string;
    description?: string;
}

export interface AdminUser {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    role: string;
    specialite: CategoryRef | string | null;
    sport: CategoryRef | null;
    niveau: string | null;
    categorie: string | null;
    statut: string;
    enabled: boolean;
}