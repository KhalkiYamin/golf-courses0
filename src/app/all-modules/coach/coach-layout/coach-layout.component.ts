import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-coach-layout',
    templateUrl: './coach-layout.component.html',
    styleUrls: ['./coach-layout.component.css']
})
export class CoachLayoutComponent {
    searchTerm: string = '';
    showLogoutModal: boolean = false;
    expandedSections: { [key: string]: boolean } = {
        users: true,
        enterprises: false,
        settings: false
    };

    coachProfile = {
        initials: 'SN',
        name: 'Coach Nour',
        specialty: 'Coach de football'
    };

    usersMenuItems = [
        { label: 'Profil coach', path: '/dashboard/coach/profile' },
        { label: 'Athletes', path: '/dashboard/coach/athletes' }
    ];

    enterprisesMenuItems = [
        { label: 'Seances', path: '/dashboard/coach/sessions' },
        { label: 'Planning', path: '/dashboard/coach/planning' }
    ];

    settingsMenuItems = [
        { label: 'Presences', path: '/dashboard/coach/presences' },
        { label: 'Notifications', path: '/dashboard/coach/notifications' }
    ];

    usersMenuPaths = this.usersMenuItems.map((item) => item.path);
    enterprisesMenuPaths = this.enterprisesMenuItems.map((item) => item.path);
    settingsMenuPaths = this.settingsMenuItems.map((item) => item.path);

    constructor(private router: Router) { }

    get filteredUsersMenuItems() {
        return this.filterMenuItems(this.usersMenuItems);
    }

    get filteredEnterprisesMenuItems() {
        return this.filterMenuItems(this.enterprisesMenuItems);
    }

    get filteredSettingsMenuItems() {
        return this.filterMenuItems(this.settingsMenuItems);
    }

    get hasSearchTerm(): boolean {
        return this.searchTerm.trim().length > 0;
    }

    get hasSearchResults(): boolean {
        return this.filteredUsersMenuItems.length > 0 ||
            this.filteredEnterprisesMenuItems.length > 0 ||
            this.filteredSettingsMenuItems.length > 0;
    }

    searchAndNavigate(): void {
        const firstResult = this.filteredUsersMenuItems[0] ||
            this.filteredEnterprisesMenuItems[0] ||
            this.filteredSettingsMenuItems[0];

        if (firstResult) {
            this.router.navigate([firstResult.path]);
        }
    }

    toggleSection(sectionKey: string): void {
        this.expandedSections[sectionKey] = !this.expandedSections[sectionKey];
    }

    isExpanded(sectionKey: string): boolean {
        return !!this.expandedSections[sectionKey];
    }

    hasActiveRoute(paths: string[]): boolean {
        return paths.some((path) => this.router.isActive(path, {
            paths: 'exact',
            queryParams: 'ignored',
            fragment: 'ignored',
            matrixParams: 'ignored'
        }));
    }

    logout(): void {
        this.showLogoutModal = true;
    }

    cancelLogout(): void {
        this.showLogoutModal = false;
    }

    confirmLogout(): void {
        this.showLogoutModal = false;
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.router.navigate(['/pages/login']);
    }

    private filterMenuItems(items: Array<{ label: string; path: string }>): Array<{ label: string; path: string }> {
        const term = this.searchTerm.trim().toLowerCase();

        if (!term) {
            return items;
        }

        return items.filter((item) => item.label.toLowerCase().includes(term));
    }
}