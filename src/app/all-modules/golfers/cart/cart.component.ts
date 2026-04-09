import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutCart, CheckoutFlowService, CheckoutStepView } from '../services/checkout-flow.service';
import { ReservationSeanceService } from 'src/app/services/reservation-seance.service';

interface CoachCardView {
    coachId: number;
    fullName: string;
    specialty: string;
    level: string;
    imageUrl: string;
    session: any;
}

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    readonly backendBaseUrl = 'http://localhost:8081';
    readonly defaultSessionPrice = 20;

    order!: CheckoutCart;
    steps: CheckoutStepView[] = [];
    coachCards: CoachCardView[] = [];
    loadingLastSession = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private checkoutFlow: CheckoutFlowService,
        private reservationSeanceService: ReservationSeanceService
    ) { }

    ngOnInit(): void {
        this.order = { ...this.checkoutFlow.getCart() };

        // reset old cart values
        this.order.seanceId = 0;
        this.order.coachId = 0;
        this.order.title = '';
        this.order.coach = '';
        this.order.duration = '';

        this.hydrateFromQueryParams();
        this.steps = this.checkoutFlow.getSteps('cart');
        this.checkoutFlow.clearPaymentCompleted();

        // always load the latest athlete session
        this.loadLastSessionForAthlete();

        this.checkoutFlow.saveCart(this.order);
    }

    get total(): number {
        return this.order.subtotal;
    }

    get unitPrice(): number {
        return this.order.unitPrice > 0 ? this.order.unitPrice : this.defaultSessionPrice;
    }

    decreaseQuantity(): void {
        if (this.order.quantity > 1) {
            this.order.quantity -= 1;
            this.recalculateSubtotal();
        }
    }

    increaseQuantity(): void {
        this.order.quantity += 1;
        this.recalculateSubtotal();
    }

    chooseCoach(coach: CoachCardView): void {
        if (!coach || !coach.session) {
            return;
        }

        this.order.coachId = coach.coachId;
        this.applySelectedSession(coach.session);
    }

    isCoachSelected(coach: CoachCardView): boolean {
        return !!coach && coach.coachId > 0 && coach.coachId === this.order.coachId;
    }

    proceedToInformation(): void {
        this.checkoutFlow.saveCart(this.order);

        this.router.navigate(['/golfers/information'], {
            queryParams: {
                seanceId: this.order.seanceId,
                coachId: this.order.coachId,
                price: this.order.unitPrice
            }
        });
    }

    navigateToStep(step: CheckoutStepView): void {
        if (!step.clickable || step.status === 'active') {
            return;
        }

        this.checkoutFlow.saveCart(this.order);

        this.router.navigate([step.route], {
            queryParams: {
                seanceId: this.order.seanceId,
                coachId: this.order.coachId,
                price: this.order.unitPrice
            }
        });
    }

    private recalculateSubtotal(): void {
        this.order.subtotal = parseFloat(
            (this.unitPrice * this.order.quantity - (this.order.discount || 0)).toFixed(2)
        );

        this.checkoutFlow.saveCart(this.order);
    }

    private hydrateFromQueryParams(): void {
        const seanceId = Number(this.route.snapshot.queryParamMap.get('seanceId') || 0);
        const coachId = Number(this.route.snapshot.queryParamMap.get('coachId') || 0);
        const unitPrice = Number(this.route.snapshot.queryParamMap.get('price') || 0);

        if (seanceId > 0) {
            this.order.seanceId = seanceId;
            this.order.title = '';
            this.order.duration = '';
            this.order.coach = '';
        }

        if (coachId > 0) {
            this.order.coachId = coachId;
        }

        if (unitPrice > 0) {
            this.order.unitPrice = unitPrice;
        }

        if (!this.order.quantity || this.order.quantity < 1) {
            this.order.quantity = 1;
        }

        if (this.order.discount == null) {
            this.order.discount = 0;
        }

        if (!this.order.unitPrice || this.order.unitPrice <= 0) {
            this.order.unitPrice = this.defaultSessionPrice;
        }

        this.recalculateSubtotal();
    }

    private loadLastSessionForAthlete(): void {
        this.loadingLastSession = true;

        this.reservationSeanceService.getLastSessionForAthlete().subscribe({
            next: (session: any) => {
                console.log('LAST SESSION =', session);

                if (!session) {
                    this.setEmptyLastSession();
                    this.loadingLastSession = false;
                    return;
                }

                this.coachCards = [
                    {
                        coachId: Number(session.coachId || 0),
                        fullName: session.coachNomComplet || session.coachNom || session.coachName || 'Coach',
                        specialty: session.sportTitle || 'Sport Coach',
                        level: session.niveau || 'All Levels',
                        imageUrl: this.getCoachImage(session),
                        session
                    }
                ];

                this.applySelectedSession(session);
                this.loadingLastSession = false;
            },
            error: (err) => {
                console.error('Erreur chargement dernière séance', err);
                this.coachCards = [];
                this.setEmptyLastSession();
                this.loadingLastSession = false;
            }
        });
    }

    private applySelectedSession(session: any): void {
        this.order.seanceId = Number(session.id || session.seanceId || 0);
        this.order.title = session.theme || session.title || '';
        this.order.duration = session.duree || session.duration || '';
        this.order.coach = session.coachNomComplet || session.coachNom || session.coachName || '';
        this.order.coachId = Number(session.coachId || 0);

        this.order.unitPrice = this.defaultSessionPrice;

        if (!this.order.quantity || this.order.quantity < 1) {
            this.order.quantity = 1;
        }

        this.order = { ...this.order };
        this.recalculateSubtotal();
    }

    private setEmptyLastSession(): void {
        this.order.seanceId = 0;
        this.order.title = '';
        this.order.coach = '';
        this.order.duration = '';
        this.order.coachId = 0;

        if (!this.order.unitPrice || this.order.unitPrice <= 0) {
            this.order.unitPrice = this.defaultSessionPrice;
        }

        this.order = { ...this.order };
        this.recalculateSubtotal();
    }

    getCoachImage(session: any): string {
        const image =
            session?.coachImageProfil ||
            session?.coachImageUrl ||
            session?.coachImage ||
            session?.coachAvatar ||
            session?.coachPhoto ||
            session?.coach?.imageProfil ||
            session?.coach?.imageUrl ||
            session?.coach?.avatar ||
            session?.coach?.photo;

        return this.resolveImageUrl(image || '');
    }

    handleCoachImageError(event: Event, coach: CoachCardView): void {
        const target = event.target as HTMLImageElement;
        if (!target) {
            return;
        }

        coach.imageUrl = '';
        target.removeAttribute('src');
    }

    getCoachInitials(fullName: string): string {
        const words = (fullName || '')
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (!words.length) {
            return 'CO';
        }

        if (words.length === 1) {
            return words[0].slice(0, 2).toUpperCase();
        }

        return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }

    private resolveImageUrl(rawImage: string): string {
        const image = (rawImage || '').toString().trim();

        if (!image) {
            return '';
        }

        if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
            return image;
        }

        if (image.startsWith('assets/')) {
            return image;
        }

        if (image.startsWith('/')) {
            return `${this.backendBaseUrl}${image}`;
        }

        return `${this.backendBaseUrl}/${image}`;
    }
}