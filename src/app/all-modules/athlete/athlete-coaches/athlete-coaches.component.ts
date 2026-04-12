import { Component, OnInit } from '@angular/core';

import { AthleteDashboardService } from '../../../services/athlete-dashboard.service';
import { AthleteSeance } from '../../models/athlete-seance.model';

interface CoachProfileView {
    id: number;
    fullName: string;
    firstName: string;
    lastName: string;
    username: string;
    gender: string;
    birthDate: string;
    imageUrl: string;
    initials: string;
    speciality: string;
    sport: string;
    level: string;
    experienceYears: number;
    biography: string;
    email: string;
    phone: string;
    availability: string;
    clubName: string;
    clubAddress: string;
    clubImage: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    stateProvince: string;
    country: string;
    postalCode: string;
    services: string[];
    specialisations: string[];
    diplomes: Array<{ title: string; institute: string; year: string }>;
    experiences: Array<{ clubName: string; position: string; from: string; to: string }>;
    recompenses: Array<{ title: string; year: string }>;
    qualifications: string[];
    certifications: string[];
    skills: string[];
    resumeHighlights: string[];
}

@Component({
    selector: 'app-athlete-coaches',
    templateUrl: './athlete-coaches.component.html',
    styleUrls: ['./athlete-coaches.component.css']
})
export class AthleteCoachesComponent implements OnInit {
    athleteSport = '';
    loading = false;
    errorMessage = '';

    coaches: CoachProfileView[] = [];
    filteredCoaches: CoachProfileView[] = [];
    selectedCoach: CoachProfileView | null = null;

    constructor(private athleteDashboardService: AthleteDashboardService) { }

    ngOnInit(): void {
        this.loadAthleteSportAndCoaches();
    }

    selectCoach(coach: CoachProfileView): void {
        this.selectedCoach = coach;

        this.athleteDashboardService.getCoachProfileDetails(coach.id).subscribe({
            next: (details: any) => {
                if (!details) {
                    return;
                }

                const enriched = this.mapCoachRow(
                    {
                        ...coach,
                        ...details,
                        coach: details,
                        user: details,
                        profile: details,
                        coachProfile: details,
                        id: coach.id
                    },
                    coach.id
                );

                this.selectedCoach = {
                    ...coach,
                    ...enriched,
                    id: coach.id
                };
            },
            error: () => { }
        });
    }

    isSelected(coach: CoachProfileView): boolean {
        return !!this.selectedCoach && this.selectedCoach.id === coach.id;
    }

    hasDisplayValue(value: string): boolean {
        const normalized = (value || '').toString().trim().toLowerCase();
        if (!normalized) {
            return false;
        }

        return normalized !== 'not provided' && normalized !== 'not specified' && normalized !== 'not provided.';
    }

    hasClubInfo(coach: CoachProfileView): boolean {
        return this.hasDisplayValue(coach.clubName) ||
            this.hasDisplayValue(coach.clubAddress) ||
            this.hasDisplayValue(coach.clubImage);
    }

    hasAddressInfo(coach: CoachProfileView): boolean {
        return this.hasDisplayValue(coach.addressLine1) ||
            this.hasDisplayValue(coach.addressLine2) ||
            this.hasDisplayValue(coach.city) ||
            this.hasDisplayValue(coach.stateProvince) ||
            this.hasDisplayValue(coach.country) ||
            this.hasDisplayValue(coach.postalCode);
    }

    private loadAthleteSportAndCoaches(): void {
        this.loading = true;
        this.errorMessage = '';

        this.athleteDashboardService.getAthleteProfile().subscribe({
            next: (profile: any) => {
                this.athleteSport =
                    this.extractCategoryLabel(profile?.sport) ||
                    this.extractCategoryLabel(profile?.specialite) ||
                    this.extractCategoryLabel(profile?.categorie);
                this.loadCoaches();
            },
            error: () => {
                this.athleteSport = '';
                this.loadCoaches();
            }
        });
    }

    private loadCoaches(): void {
        this.athleteDashboardService.getCoachDirectory().subscribe({
            next: (rows: any[]) => {
                this.coaches = (rows || [])
                    .filter((row) => !!row)
                    .map((row, index) => this.mapCoachRow(row, index));

                this.filteredCoaches = this.filterByAthleteSport(this.coaches, this.athleteSport);

                if (this.filteredCoaches.length) {
                    this.selectCoach(this.filteredCoaches[0]);
                    this.loading = false;
                    return;
                }

                this.loadFallbackCoachesFromSeances();
            },
            error: () => {
                this.loadFallbackCoachesFromSeances();
            }
        });
    }

    private loadFallbackCoachesFromSeances(): void {
        this.athleteDashboardService.getAthleteSeances().subscribe({
            next: (seances: AthleteSeance[]) => {
                const fallback = this.mapFallbackSeancesToCoaches(seances || []);
                this.coaches = fallback;
                this.filteredCoaches = this.filterByAthleteSport(fallback, this.athleteSport);
                if (this.filteredCoaches.length) {
                    this.selectCoach(this.filteredCoaches[0]);
                } else {
                    this.selectedCoach = null;
                }
                this.errorMessage = this.filteredCoaches.length
                    ? ''
                    : (this.athleteSport
                        ? `No coach profiles available for your specialization: ${this.athleteSport}.`
                        : 'No coach profiles available for now.');
                this.loading = false;
            },
            error: () => {
                this.coaches = [];
                this.filteredCoaches = [];
                this.selectedCoach = null;
                this.errorMessage = 'Unable to load coach profiles right now.';
                this.loading = false;
            }
        });
    }

    private mapFallbackSeancesToCoaches(seances: AthleteSeance[]): CoachProfileView[] {
        const unique = new Map<string, CoachProfileView>();

        seances.forEach((seance, index) => {
            const fullName = (seance?.coachNomComplet || '').toString().trim();
            if (!fullName) {
                return;
            }

            const key = this.normalize(fullName);
            if (unique.has(key)) {
                return;
            }

            const speciality = (seance?.specialite || '').toString().trim() || this.athleteSport || 'Not specified';
            const sport = speciality;
            const names = this.splitName(fullName);

            unique.set(key, {
                id: index + 1,
                fullName,
                firstName: names.firstName,
                lastName: names.lastName,
                username: '',
                gender: '',
                birthDate: '',
                imageUrl: '',
                initials: this.extractInitials(fullName),
                speciality,
                sport,
                level: 'Not specified',
                experienceYears: 0,
                biography: '',
                email: 'Not provided',
                phone: 'Not provided',
                availability: 'Available',
                clubName: '',
                clubAddress: '',
                clubImage: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                stateProvince: '',
                country: '',
                postalCode: '',
                services: [],
                specialisations: speciality !== 'Not specified' ? [speciality] : [],
                diplomes: [],
                experiences: [],
                recompenses: [],
                qualifications: [],
                certifications: [],
                skills: speciality !== 'Not specified' ? [speciality] : [],
                resumeHighlights: []
            });
        });

        return Array.from(unique.values());
    }

    private filterByAthleteSport(items: CoachProfileView[], sport: string): CoachProfileView[] {
        const needle = this.normalize(sport);
        if (!needle) {
            return items;
        }

        const keys = this.getSportKeywords(needle);

        const matched = items.filter((coach) => {
            const speciality = this.normalize(coach.speciality);
            const sportValue = this.normalize(coach.sport);
            const skills = this.normalize(coach.skills.join(' '));

            const hasDefinedSpeciality =
                !!speciality &&
                speciality !== 'not specified' &&
                speciality !== 'specialite non definie';

            if (hasDefinedSpeciality) {
                return keys.some((key) => speciality.includes(key));
            }

            return keys.some((key) => sportValue.includes(key) || skills.includes(key));
        });

        return matched;
    }

    private getSportKeywords(needle: string): string[] {
        const keyset = new Set<string>([needle]);

        if (needle.includes('football') || needle.includes('foot')) {
            keyset.add('football');
            keyset.add('foot');
            keyset.add('soccer');
            keyset.add('futsal');
        }

        return Array.from(keyset);
    }

    private mapCoachRow(row: any, index: number): CoachProfileView {
        const source = this.mergeCoachSource(row);
        const names = this.splitName(this.buildName(source));
        const fullName = this.buildName(source);
        const speciality = this.extractCategoryLabel(source?.specialite) || (source?.categorie || '').toString().trim() || 'Not specified';
        const sport = this.extractCategoryLabel(source?.sport) || (source?.categorie || '').toString().trim() || 'Not specified';
        const level = (source?.niveau || '').toString().trim() || 'Not specified';
        const experienceYears = this.extractExperience(source);

        const services = this.parseList(source?.services);
        const specialisations = this.parseList(source?.specialisations || source?.specialite);
        const diplomes = this.parseDiplomes(source?.diplomes);
        const experiences = this.parseExperiences(source?.experiences);
        const recompenses = this.parseRecompenses(source?.recompenses);

        const qualifications = this.parseList(
            source?.qualifications || source?.diplomes || source?.education || source?.formation
        );

        const certifications = this.parseList(
            source?.certifications || source?.recompenses || source?.awards || source?.certification
        );

        const skills = this.parseList(
            source?.skills || source?.specialisations || source?.services
        );

        const biography =
            (source?.biographie || source?.description || source?.presentation || '').toString().trim();

        const resumeHighlights = this.buildResumeHighlights(speciality, sport, level, experienceYears);
        const mappedId = Number(source?.id || source?.userId || row?.id || row?.userId || index + 1);

        return {
            id: Number.isFinite(mappedId) && mappedId > 0 ? mappedId : index + 1,
            fullName,
            firstName: names.firstName,
            lastName: names.lastName,
            username: (source?.nomUtilisateur || source?.username || '').toString().trim(),
            gender: (source?.genre || '').toString().trim(),
            birthDate: (source?.dateNaissance || '').toString().trim(),
            imageUrl: this.resolveImage(source?.imageProfil),
            initials: this.extractInitials(fullName),
            speciality,
            sport,
            level,
            experienceYears,
            biography,
            email: (source?.email || '').toString().trim() || 'Not provided',
            phone: (source?.telephone || '').toString().trim() || 'Not provided',
            availability: this.resolveAvailability(source),
            clubName: (source?.nomClub || '').toString().trim(),
            clubAddress: (source?.adresseClub || '').toString().trim(),
            clubImage: (source?.clubImage || '').toString().trim(),
            addressLine1: (source?.adresseLigne1 || '').toString().trim(),
            addressLine2: (source?.adresseLigne2 || '').toString().trim(),
            city: (source?.ville || '').toString().trim(),
            stateProvince: (source?.etatProvince || '').toString().trim(),
            country: (source?.pays || '').toString().trim(),
            postalCode: (source?.codePostal || '').toString().trim(),
            services,
            specialisations,
            diplomes,
            experiences,
            recompenses,
            qualifications,
            certifications,
            skills: skills.length ? skills : [...specialisations],
            resumeHighlights
        };
    }

    private mergeCoachSource(row: any): any {
        if (!row || typeof row !== 'object') {
            return row;
        }

        return Object.assign(
            {},
            row,
            row.details || {},
            row.profileDetails || {},
            row.profile || {},
            row.coachProfile || {},
            row.coach_profile || {},
            row.coach?.details || {},
            row.coach?.profile || {},
            row.user?.profile || {},
            row.user || {},
            row.coach || {}
        );
    }

    private unwrapCoachRow(row: any): any {
        if (!row || typeof row !== 'object') {
            return row;
        }

        return row.coach || row.user || row.profile || row;
    }

    private splitName(fullName: string): { firstName: string; lastName: string } {
        const parts = (fullName || '').trim().split(' ').filter((part) => !!part);
        if (!parts.length) {
            return { firstName: '', lastName: '' };
        }

        if (parts.length === 1) {
            return { firstName: parts[0], lastName: '' };
        }

        return {
            firstName: parts[0],
            lastName: parts.slice(1).join(' ')
        };
    }

    private buildName(row: any): string {
        const fullName = (`${row?.prenom || ''} ${row?.nom || ''}`).trim();
        if (fullName) {
            return fullName;
        }

        return (row?.fullName || row?.nomUtilisateur || '').toString().trim() || 'Coach Profile';
    }

    private extractCategoryLabel(value: any): string {
        if (!value) {
            return '';
        }

        if (typeof value === 'string') {
            return value.trim();
        }

        if (typeof value === 'object') {
            return (value.title || value.nom || value.label || '').toString().trim();
        }

        return '';
    }

    private extractExperience(row: any): number {
        const raw = row?.experience ?? row?.yearsExperience ?? row?.anneesExperience ?? 0;
        const parsed = Number(raw);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }

    private parseList(value: any): string[] {
        if (!value) {
            return [];
        }

        if (Array.isArray(value)) {
            return value
                .map((item) => {
                    if (typeof item === 'string') {
                        return item.trim();
                    }

                    if (typeof item === 'object') {
                        return (
                            item?.diplome ||
                            item?.recompense ||
                            item?.nom ||
                            item?.title ||
                            item?.name ||
                            ''
                        ).toString().trim();
                    }

                    return '';
                })
                .filter((text) => !!text);
        }

        if (typeof value === 'string') {
            return value
                .split(',')
                .map((part) => part.trim())
                .filter((part) => !!part);
        }

        return [];
    }

    private parseDiplomes(value: any): Array<{ title: string; institute: string; year: string }> {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .map((item) => {
                if (typeof item === 'string') {
                    return {
                        title: item.trim(),
                        institute: '',
                        year: ''
                    };
                }

                if (!item || typeof item !== 'object') {
                    return null;
                }

                return {
                    title: (item?.diplome || item?.title || item?.name || '').toString().trim(),
                    institute: (item?.ecoleInstitut || item?.institute || item?.ecole || '').toString().trim(),
                    year: (item?.anneeObtention || item?.year || item?.annee || '').toString().trim()
                };
            })
            .filter((item) => !!item && !!(item.title || item.institute || item.year)) as Array<{ title: string; institute: string; year: string }>;
    }

    private parseExperiences(value: any): Array<{ clubName: string; position: string; from: string; to: string }> {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .map((item) => {
                if (!item || typeof item !== 'object') {
                    return null;
                }

                return {
                    clubName: (item?.nomClub || item?.clubName || '').toString().trim(),
                    position: (item?.poste || item?.position || '').toString().trim(),
                    from: (item?.dateDebut || item?.from || '').toString().trim(),
                    to: (item?.dateFin || item?.to || '').toString().trim()
                };
            })
            .filter((item) => !!item && !!(item.clubName || item.position || item.from || item.to)) as Array<{ clubName: string; position: string; from: string; to: string }>;
    }

    private parseRecompenses(value: any): Array<{ title: string; year: string }> {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .map((item) => {
                if (typeof item === 'string') {
                    return { title: item.trim(), year: '' };
                }

                if (!item || typeof item !== 'object') {
                    return null;
                }

                return {
                    title: (item?.recompense || item?.title || item?.name || '').toString().trim(),
                    year: (item?.annee || item?.year || '').toString().trim()
                };
            })
            .filter((item) => !!item && !!(item.title || item.year)) as Array<{ title: string; year: string }>;
    }

    private resolveImage(path: string | undefined): string {
        const image = (path || '').toString().trim();
        if (!image) {
            return '';
        }

        if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('assets/')) {
            return image;
        }

        return `http://localhost:8081/${image.replace(/^\/+/, '')}`;
    }

    private extractInitials(fullName: string): string {
        const parts = (fullName || '').split(' ').filter(Boolean);
        if (!parts.length) {
            return 'C';
        }

        const first = parts[0].charAt(0) || '';
        const last = parts.length > 1 ? (parts[parts.length - 1].charAt(0) || '') : '';
        return `${first}${last}`.toUpperCase() || 'C';
    }

    private resolveAvailability(row: any): string {
        if (row?.enabled === false) {
            return 'Unavailable';
        }

        const status = (row?.statut || '').toString().toUpperCase();
        if (status.includes('ATTENTE')) {
            return 'Pending approval';
        }

        if (row?.adminApproved === false) {
            return 'Pending approval';
        }

        return 'Available';
    }

    private buildResumeHighlights(
        speciality: string,
        sport: string,
        level: string,
        experienceYears: number
    ): string[] {
        const items: string[] = [];

        if (speciality && speciality !== 'Not specified') {
            items.push(`Specialty focus: ${speciality}`);
        }

        if (sport && sport !== 'Not specified') {
            items.push(`Primary sport: ${sport}`);
        }

        if (level && level !== 'Not specified') {
            items.push(`Coaching level: ${level}`);
        }

        if (experienceYears > 0) {
            items.push(`${experienceYears} years of coaching experience`);
        }

        return items;
    }

    private normalize(value: string): string {
        return (value || '')
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[éèê]/g, 'e')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ');
    }
}