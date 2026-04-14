import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AthleteDashboardService } from '../../../services/athlete-dashboard.service';
import {
    ReservationSeanceDto,
    ReservationSeanceService
} from 'src/app/services/reservation-seance.service';
import { CheckoutFlowService } from '../../golfers/services/checkout-flow.service';

interface AthletePresenceSummary {
    presenceRate: number;
    presenceLabel: string;
    presentCount: number;
    absentCount: number;
    retardCount: number;
    totalSeances: number;
}

@Component({
    selector: 'app-athlete-dashboard',
    templateUrl: './athlete-dashboard.component.html',
    styleUrls: ['./athlete-dashboard.component.css']
})
export class AthleteDashboardComponent implements OnInit {

    stats = [
        { label: 'Séances disponibles', value: 0, icon: '📅', trend: '' },
        { label: 'Présence', value: '0%', icon: '✅', trend: '' },
        { label: 'Réservations', value: 0, icon: '📝', trend: '' },
        { label: 'Acceptées', value: 0, icon: '🎯', trend: '' }
    ];

    availableSeances: ReservationSeanceDto[] = [];
    myReservations: ReservationSeanceDto[] = [];

    lastSession: any = null;
    lastSessionLoading = false;

    loading = false;
    reservationsLoading = false;
    errorMessage = '';
    successMessage = '';

    toastVisible = false;
    toastType: 'success' | 'error' | 'info' = 'info';
    toastMessage = '';

    showCancelledAlert = false;
    cancelledAlertTitle = 'Séance annulée';
    cancelledAlertMessage = '';
    isChatOpen = false;

    showPaymentModal = false;
    sessionToPay: ReservationSeanceDto | null = null;

    private toastTimeoutRef: any = null;
    private hasLoadedReservations = false;

    presenceRate = 0;
    presenceLabel = 'Aucune donnée';
    presentCount = 0;
    absentCount = 0;
    retardCount = 0;
    totalPresenceSeances = 0;
    athleteSpecialite = '';

    hasActiveSubscription = false;
    subscriptionType = '';
    subscriptionExpiry: string | null = null;

    constructor(
        private athleteDashboardService: AthleteDashboardService,
        private reservationSeanceService: ReservationSeanceService,
        private router: Router,
        private checkoutFlow: CheckoutFlowService
    ) { }

    ngOnInit(): void {
        this.loadAthleteProfile();
        this.loadAvailableSeances();
        this.loadMyReservations();
        this.loadPresenceSummary();
        this.loadLastSession();
    }

    @HostListener('document:keydown.escape')
    handleEscapeKey(): void {
        if (this.isChatOpen) {
            this.closeChatbot();
        }

        if (this.showPaymentModal) {
            this.closePaymentModal();
        }
    }

    loadAthleteProfile(): void {
        this.athleteDashboardService.getAthleteProfile().subscribe({
            next: (profile: any) => {
                console.log('Athlete profile loaded:', profile);

                const rawSport = profile?.sport;

                if (typeof rawSport === 'string') {
                    this.athleteSpecialite = rawSport.trim();
                } else if (rawSport && typeof rawSport === 'object') {
                    this.athleteSpecialite = (rawSport.title || rawSport.nom || '').toString().trim();
                } else {
                    this.athleteSpecialite = '';
                }

                this.hasActiveSubscription = profile?.hasActiveSubscription ||
                    profile?.subscriptionActive ||
                    profile?.abonnementActif ||
                    false;

                this.subscriptionType = profile?.subscriptionType ||
                    profile?.planType ||
                    profile?.abonnementType ||
                    '';

                this.subscriptionExpiry = profile?.subscriptionExpiry ||
                    profile?.dateExpiration ||
                    profile?.abonnementExpiration ||
                    null;

                console.log('Subscription status:', {
                    hasActiveSubscription: this.hasActiveSubscription,
                    subscriptionType: this.subscriptionType,
                    subscriptionExpiry: this.subscriptionExpiry
                });
            },
            error: () => {
                this.athleteSpecialite = '';
                this.hasActiveSubscription = false;
                this.subscriptionType = '';
                this.subscriptionExpiry = null;
            }
        });
    }

    loadLastSession(): void {
        this.lastSessionLoading = true;

        this.reservationSeanceService.getLastSessionForAthlete().subscribe({
            next: (res) => {
                console.log('LAST SESSION DASHBOARD =', res);
                this.lastSession = res;
                this.lastSessionLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.lastSession = null;
                this.lastSessionLoading = false;
            }
        });
    }

    get matchingCoachNames(): string[] {
        const sportNeedle = this.normalizeText(this.athleteSpecialite);
        if (!sportNeedle) {
            return [];
        }

        const unique = new Set<string>();
        const sessions = [...this.availableSeances, ...this.myReservations];

        sessions.forEach((session) => {
            const coachName = this.getCoachDisplayName(session).trim();
            if (!coachName || coachName === 'Coach non défini') {
                return;
            }

            const blob = this.normalizeText(
                `${session.theme || ''} ${session.lieu || ''} ${session.coachNomComplet || ''} ${session.coachNom || ''}`
            );

            if (this.matchesSpecialization(blob, sportNeedle)) {
                unique.add(coachName);
            }
        });

        return Array.from(unique).slice(0, 5);
    }

    private matchesSpecialization(value: string, needle: string): boolean {
        if (!needle) {
            return false;
        }

        if (needle.includes('football') || needle.includes('foot')) {
            return value.includes('football') || value.includes('foot') || value.includes('soccer') || value.includes('futsal');
        }

        return value.includes(needle);
    }

    private normalizeText(value: string): string {
        return (value || '')
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[éèê]/g, 'e')
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ');
    }

    get availableSeancesToReserve(): ReservationSeanceDto[] {
        return this.availableSeances.filter((session) => this.isAvailableStatus(session.statut));
    }

    loadAvailableSeances(): void {
        this.loading = true;
        this.errorMessage = '';

        this.reservationSeanceService.getSeancesDisponiblesPourAthlete().subscribe({
            next: (data: ReservationSeanceDto[]) => {
                console.log('📥 Available seances loaded from API:', data);
                console.log('🔍 Sample seance with IDs:', data[0] ? {
                    id: data[0].id,
                    seanceId: data[0].seanceId,
                    coachId: data[0].coachId,
                    theme: data[0].theme
                } : 'No seances');

                this.availableSeances = data || [];
                this.stats[0].value = this.availableSeancesToReserve.length;
                this.loading = false;
            },
            error: (error: any) => {
                console.error('❌ Error loading seances:', error);
                this.errorMessage = error?.error?.message || 'Impossible de charger les séances disponibles.';
                this.loading = false;
            }
        });
    }

    loadMyReservations(): void {
        this.reservationsLoading = true;

        this.reservationSeanceService.getMesReservations().subscribe({
            next: (data: ReservationSeanceDto[]) => {
                const nextReservations = data || [];

                if (this.hasLoadedReservations) {
                    const previousCancelled = new Set(
                        this.myReservations
                            .filter((r) => this.isSessionCancelled(r))
                            .map((r) => this.getSessionIdentity(r))
                    );

                    const newlyCancelled = nextReservations.find(
                        (r) => this.isSessionCancelled(r) && !previousCancelled.has(this.getSessionIdentity(r))
                    );

                    if (newlyCancelled) {
                        this.openCancelledAlert(newlyCancelled);
                    }
                }

                this.myReservations = nextReservations;
                this.stats[2].value = this.myReservations.length;
                this.stats[3].value = this.myReservations.filter(
                    r => this.normalizeStatus(r.statut) === 'ACCEPTEE'
                ).length;
                this.hasLoadedReservations = true;
                this.reservationsLoading = false;
            },
            error: () => {
                this.reservationsLoading = false;
            }
        });
    }

    loadPresenceSummary(): void {
        this.athleteDashboardService.getPresenceSummary().subscribe({
            next: (data: AthletePresenceSummary) => {
                this.presenceRate = data.presenceRate || 0;
                this.presenceLabel = data.presenceLabel || 'Aucune donnée';
                this.presentCount = data.presentCount || 0;
                this.absentCount = data.absentCount || 0;
                this.retardCount = data.retardCount || 0;
                this.totalPresenceSeances = data.totalSeances || 0;

                this.stats[1].value = `${this.presenceRate}%`;
                this.stats[1].trend = this.presenceLabel;
            },
            error: () => { }
        });
    }

    isSessionCoveredBySubscription(session: ReservationSeanceDto): boolean {
        if (!this.hasActiveSubscription) {
            return false;
        }
        if (!this.subscriptionExpiry) {
            return true;
        }
        const sessionDate = this.parseDateSafe(session.dateSeance);
        const expiryDate = this.parseDateSafe(this.subscriptionExpiry);
        if (!sessionDate || !expiryDate) {
            return false;
        }
        return sessionDate <= expiryDate;
    }

    private parseDateSafe(value: string): Date | null {
        if (!value) {
            return null;
        }
        // Handle dd/MM/yyyy
        const dmyMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (dmyMatch) {
            const d = new Date(Number(dmyMatch[3]), Number(dmyMatch[2]) - 1, Number(dmyMatch[1]));
            return isNaN(d.getTime()) ? null : d;
        }
        // Handle yyyy-MM-dd (normalize to local midnight to avoid timezone shifts)
        const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
            const d = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
            return isNaN(d.getTime()) ? null : d;
        }
        // Fallback for full ISO strings
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }

    handleReserveClick(session: ReservationSeanceDto): void {
        const seanceId = this.getSeanceId(session);
        const coachId = Number(session.coachId || 0);

        if (!seanceId || seanceId <= 0) {
            this.errorMessage = 'Identifiant de séance invalide.';
            this.showToast('error', this.errorMessage);
            return;
        }

        if (!coachId || coachId <= 0) {
            this.errorMessage = 'Coach invalide.';
            this.showToast('error', this.errorMessage);
            return;
        }

        if (this.isSessionCoveredBySubscription(session)) {
            this.reserveDirectly(seanceId, coachId);
            return;
        }

        this.openPaymentModal(session);
    }

    reserveDirectly(seanceId: number, coachId: number): void {
        this.reservationSeanceService.reserverSeance(seanceId, coachId).subscribe({
            next: () => {
                this.errorMessage = '';
                this.successMessage = 'Réservation envoyée avec succès.';
                this.showToast('success', this.successMessage);
                this.loadAvailableSeances();
                this.loadMyReservations();
                this.loadPresenceSummary();
                this.loadAthleteProfile();
            },
            error: (error: any) => {
                const message =
                    error?.error?.message ||
                    error?.error ||
                    'Impossible de réserver cette séance.';
                this.errorMessage = message;
                this.successMessage = '';
                this.showToast('error', message);
            }
        });
    }

    openPaymentModal(session: ReservationSeanceDto): void {
        this.sessionToPay = session;
        this.showPaymentModal = true;
    }

    closePaymentModal(): void {
        this.showPaymentModal = false;
        this.sessionToPay = null;
    }

    confirmPayment(): void {
        if (!this.sessionToPay) {
            return;
        }

        const seanceId = this.getSeanceId(this.sessionToPay);
        const coachId = Number(this.sessionToPay.coachId || 0);

        if (!seanceId || seanceId <= 0) {
            this.errorMessage = 'Identifiant de séance invalide.';
            this.showToast('error', this.errorMessage);
            return;
        }

        if (!coachId || coachId <= 0) {
            this.errorMessage = 'Coach invalide.';
            this.showToast('error', this.errorMessage);
            return;
        }

        const cartData = {
            seanceId: seanceId,
            coachId: coachId,
            title: (this.sessionToPay.theme || 'Séance d\'entraînement').trim(),
            duration: '1 heure',
            coach: this.getCoachDisplayName(this.sessionToPay),
            unitPrice: 20,
            quantity: 1,
            subtotal: 20,
            discount: 0
        };

        console.log('💳 Saving cart data for checkout:', cartData);

        this.checkoutFlow.saveCart(cartData);

        this.router.navigate(['/golfers/checkout'], {
            queryParams: {
                seanceId: seanceId,
                coachId: coachId,
                fromReservation: 'true'
            }
        });

        this.closePaymentModal();
    }

    getReservationBadgeLabel(statut: string): string {
        switch (this.normalizeStatus(statut)) {
            case 'NON_RESERVEE':
                return 'Disponible';
            case 'EN_ATTENTE':
                return 'En attente';
            case 'ACCEPTEE':
                return 'Acceptée';
            case 'REFUSEE':
                return 'Refusée';
            case 'ANNULEE':
                return 'Annulée';
            default:
                return statut;
        }
    }

    getSeanceId(session: ReservationSeanceDto): number {
        return Number(session.seanceId || session.id || 0);
    }

    getCoachDisplayName(session: ReservationSeanceDto): string {
        return session.coachNomComplet || session.coachNom || session.coachName || 'Coach non défini';
    }

    getPlacesDisplay(session: ReservationSeanceDto): string {
        const count = Number(session.nombreAthletesCoachEtSeance ?? 0);
        return `${count}/20 athlètes`;
    }

    isSessionComplete(session: ReservationSeanceDto): boolean {
        return !!session.complet;
    }

    isSessionCancelled(session: ReservationSeanceDto): boolean {
        return (session.seanceStatut || '')
            .toUpperCase()
            .includes('ANNUL');
    }

    isCancelledLessThan24h(session: ReservationSeanceDto): boolean {
        return !!session.annuleeMoinsDe24h;
    }

    getCancellationMessage(session: ReservationSeanceDto): string {
        if (session.messageAnnulation && session.messageAnnulation.trim()) {
            return session.messageAnnulation;
        }

        return this.isCancelledLessThan24h(session)
            ? 'Annulée moins de 24h avant'
            : 'Cette séance a été annulée';
    }

    private isAvailableStatus(statut: string): boolean {
        const normalized = this.normalizeStatus(statut);
        return normalized === 'NON_RESERVEE' || normalized === 'DISPONIBLE' || normalized === 'ANNULEE';
    }

    private normalizeStatus(statut: string): string {
        return (statut || '')
            .toString()
            .trim()
            .toUpperCase()
            .replace(/\s+/g, '_')
            .replace(/-/g, '_')
            .replace(/É/g, 'E');
    }

    getSessionIcon(theme: string): string {
        const value = (theme || '').toLowerCase();

        if (value.includes('football')) return '⚽';
        if (value.includes('basket')) return '🏀';
        if (value.includes('tennis')) return '🎾';
        if (value.includes('natation')) return '🏊';
        if (value.includes('musculation')) return '💪';

        return '🏅';
    }

    formatDate(date: string, heure: string): string {
        return `${date} à ${heure}`;
    }

    closeCancelledAlert(): void {
        this.showCancelledAlert = false;
    }

    toggleChatbot(): void {
        this.isChatOpen = !this.isChatOpen;
    }

    closeChatbot(): void {
        this.isChatOpen = false;
    }

    getToastIcon(): string {
        if (this.toastType === 'success') return '✅';
        if (this.toastType === 'error') return '⛔';
        return '🔔';
    }

    private openCancelledAlert(session: ReservationSeanceDto): void {
        const theme = (session.theme || 'Séance').trim();
        const date = (session.dateSeance || '').trim();
        const heure = (session.heureSeance || '').trim();
        const details = date && heure ? ` (${date} à ${heure})` : '';

        this.cancelledAlertMessage = `${theme}${details} a été annulée par le coach.`;
        this.showCancelledAlert = true;
        this.showToast('info', 'Une séance réservée a été annulée.');
    }

    private getSessionIdentity(session: ReservationSeanceDto): string {
        const id = Number(session.id || 0);
        const seanceId = Number(session.seanceId || 0);
        if (id > 0) {
            return `res-${id}`;
        }
        if (seanceId > 0) {
            return `seance-${seanceId}`;
        }
        return `${session.theme || ''}-${session.dateSeance || ''}-${session.heureSeance || ''}`;
    }

    private showToast(type: 'success' | 'error' | 'info', message: string): void {
        this.toastType = type;
        this.toastMessage = message;
        this.toastVisible = true;

        if (this.toastTimeoutRef) {
            clearTimeout(this.toastTimeoutRef);
        }

        this.toastTimeoutRef = setTimeout(() => {
            this.toastVisible = false;
        }, 3200);
    }
}