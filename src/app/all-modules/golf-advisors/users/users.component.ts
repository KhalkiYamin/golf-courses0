import { Component, OnInit } from '@angular/core';
import { AdminUserService } from 'src/app/services/admin-user.service';
import { CategoryService } from 'src/app/services/category.service';
import { AdminUser } from '../../models/admin-user';
import { Category } from '../../models/category';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

    users: AdminUser[] = [];
    athletes: AdminUser[] = [];
    coaches: AdminUser[] = [];

    selectedUser: AdminUser | null = null;
    selectedTab: 'ATHLETE' | 'COACH' = 'ATHLETE';

    searchTerm = '';
    coachFilter: 'TOUS' | 'VALIDÉ' | 'EN ATTENTE' = 'TOUS';

    currentPage = 1;
    pageSize = 4;

    showAddModal = false;
    successMessage = '';

    categories: Category[] = [];

    newUser: AdminUser = this.createEmptyUser();
    password = '';
    sportId: number | null = null;
    specialiteId: number | null = null;
    experience: number | null = null;
    niveau = '';

    niveauOptions: string[] = ['DEBUTANT', 'INTERMEDIAIRE', 'CONFIRME', 'PROFESSIONNEL'];

    constructor(
        private adminUserService: AdminUserService,
        private categoryService: CategoryService
    ) { }

    ngOnInit(): void {
        this.loadUsers();
        this.loadCategories();
    }

    loadCategories(): void {
        this.categoryService.getAllCategories().subscribe({
            next: (data: Category[]) => {
                this.categories = data;
            },
            error: (err: any) => {
                console.error('Erreur chargement catégories', err);
            }
        });
    }

    createEmptyUser(): AdminUser {
        return {
            id: 0,
            nom: '',
            prenom: '',
            email: '',
            telephone: '',
            role: 'ATHLETE',
            specialite: '',
            sport: null,
            niveau: '',
            categorie: '',
            statut: 'VALIDÉ',
            enabled: true
        };
    }

    loadUsers(): void {
        this.adminUserService.getAllUsers().subscribe({
            next: (data) => {
                this.users = data;
                this.refreshLists();
            },
            error: (err) => {
                console.error('Erreur chargement utilisateurs', err);
            }
        });
    }

    refreshLists(): void {
        this.athletes = this.users.filter(u => u.role === 'ATHLETE');
        this.coaches = this.users.filter(u => u.role === 'COACH');
    }

    get pendingCoachesCount(): number {
        return this.coaches.filter(c => this.getUserStatus(c) === 'EN ATTENTE').length;
    }

    get filteredAthletes(): AdminUser[] {
        return this.athletes.filter(user =>
            (`${user.nom} ${user.prenom} ${user.email} ${user.telephone || ''} ${user.sport?.title || ''} ${user.niveau || ''}`)
                .toLowerCase()
                .includes(this.searchTerm.toLowerCase())
        );
    }

    get filteredCoaches(): AdminUser[] {
        return this.coaches.filter(user => {
            const specialiteLabel = this.getSpecialiteLabel(user);

            const searchMatch =
                (`${user.nom} ${user.prenom} ${user.email} ${specialiteLabel} ${user.telephone || ''}`)
                    .toLowerCase()
                    .includes(this.searchTerm.toLowerCase());

            const filterMatch =
                this.coachFilter === 'TOUS' || this.getUserStatus(user) === this.coachFilter;

            return searchMatch && filterMatch;
        });
    }

    get displayedUsers(): AdminUser[] {
        const source =
            this.selectedTab === 'ATHLETE'
                ? this.filteredAthletes
                : this.filteredCoaches;

        const start = (this.currentPage - 1) * this.pageSize;
        return source.slice(start, start + this.pageSize);
    }

    get totalPages(): number {
        const source =
            this.selectedTab === 'ATHLETE'
                ? this.filteredAthletes
                : this.filteredCoaches;

        return Math.ceil(source.length / this.pageSize) || 1;
    }

    selectUser(user: AdminUser): void {
        this.selectedUser = user;
    }

    switchTab(tab: 'ATHLETE' | 'COACH'): void {
        this.selectedTab = tab;
        this.currentPage = 1;
        this.selectedUser = null;
    }

    setCoachFilter(filter: 'TOUS' | 'VALIDÉ' | 'EN ATTENTE'): void {
        this.coachFilter = filter;
        this.currentPage = 1;
    }

    addUser(): void {
        this.newUser = this.createEmptyUser();
        this.password = '';
        this.sportId = null;
        this.specialiteId = null;
        this.experience = null;
        this.niveau = '';
        this.showAddModal = true;
    }

    onRoleChange(): void {
        if (this.newUser.role === 'ATHLETE') {
            this.specialiteId = null;
            this.experience = null;
        } else {
            this.sportId = null;
            this.niveau = '';
        }
    }

    closeModal(): void {
        this.showAddModal = false;
    }

    saveUser(): void {
        if (!this.newUser.nom || !this.newUser.prenom || !this.newUser.email || !this.newUser.role) {
            alert('Veuillez remplir les champs obligatoires.');
            return;
        }

        if (!this.password || this.password.length < 6) {
            alert('Le mot de passe est obligatoire (minimum 6 caractères).');
            return;
        }

        if (this.newUser.role === 'ATHLETE' && (!this.sportId || !this.niveau)) {
            alert('Veuillez sélectionner un sport et un niveau pour l\'athlète.');
            return;
        }

        if (this.newUser.role === 'COACH' && !this.specialiteId) {
            alert('Veuillez renseigner la spécialité du coach.');
            return;
        }

        const payload: any = {
            nom: this.newUser.nom,
            prenom: this.newUser.prenom,
            email: this.newUser.email,
            telephone: this.newUser.telephone,
            password: this.password,
            role: this.newUser.role,
            enabled: true,
            adminApproved: true
        };

        if (this.newUser.role === 'ATHLETE') {
            payload.sportId = this.sportId;
            payload.niveau = this.niveau;
        }

        if (this.newUser.role === 'COACH') {
            payload.specialiteId = this.specialiteId;
            payload.experience = this.experience ?? 0;
        }

        this.adminUserService.addUser(payload).subscribe({
            next: () => {
                this.showAddModal = false;
                this.successMessage = 'Utilisateur ajouté avec succès';
                this.loadUsers();

                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);
            },
            error: (err) => {
                console.error('Erreur ajout utilisateur', err);
                alert(err?.error?.message || 'Erreur lors de l\'ajout utilisateur.');
            }
        });
    }

    confirmDelete(user: AdminUser): void {
        const confirmation = confirm(`هل أنت متأكد من حذف ${user.prenom} ${user.nom} ؟`);
        if (!confirmation) return;

        this.adminUserService.deleteUser(user.id).subscribe({
            next: () => {
                this.successMessage = 'Utilisateur supprimé avec succès';
                this.selectedUser = null;
                this.loadUsers();

                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);
            },
            error: (err) => {
                console.error('Erreur suppression utilisateur', err);
            }
        });
    }

    validateCoach(user: AdminUser): void {
        this.adminUserService.approveCoach(user.id).subscribe({
            next: () => {
                this.successMessage = `Coach ${user.prenom} validé avec succès`;
                this.loadUsers();

                setTimeout(() => {
                    this.successMessage = '';
                }, 3000);
            },
            error: (err) => {
                console.error('Erreur validation coach', err);
            }
        });
    }

    getUserStatus(user: AdminUser): string {
        return user.statut || (user.enabled ? 'VALIDÉ' : 'EN ATTENTE');
    }

    getSpecialiteLabel(user: AdminUser): string {
        const specialite: any = user.specialite;

        if (!specialite) return '-';
        if (typeof specialite === 'string') return specialite;

        return specialite?.title || '-';
    }

    goToPage(page: number): void {
        this.currentPage = page;
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }
}