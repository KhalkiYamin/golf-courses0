import { Injectable } from '@angular/core';

export interface CheckoutCart {
    seanceId: number;
    coachId: number;
    title: string;
    duration: string;
    coach: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    discount?: number;
    customerInfo?: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
}

export interface CheckoutStepView {
    name: string;
    route: string;
    status: 'pending' | 'active' | 'completed';
    clickable: boolean;
}

const CART_KEY = 'checkout_cart';
const PAYMENT_COMPLETED_KEY = 'checkout_payment_completed';
const BOOKING_SUMMARY_KEY = 'checkout_booking_summary';

@Injectable({ providedIn: 'root' })
export class CheckoutFlowService {
    private cart: CheckoutCart = {
        seanceId: 0,
        coachId: 0,
        title: 'Training Session',
        duration: '1 heure',
        coach: 'Coach',
        unitPrice: 20,
        quantity: 1,
        subtotal: 20,
        discount: 0
    };

    constructor() {
        this.loadCart();
    }

    getCart(): CheckoutCart {
        return this.cart;
    }

    saveCart(cart: CheckoutCart): void {
        this.cart = { ...cart };
        localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
    }

    clearCart(): void {
        this.cart = {
            seanceId: 0,
            coachId: 0,
            title: 'Training Session',
            duration: '1 heure',
            coach: 'Coach',
            unitPrice: 20,
            quantity: 1,
            subtotal: 20,
            discount: 0
        };
        localStorage.removeItem(CART_KEY);
    }

    clearPaymentCompleted(): void {
        localStorage.removeItem(PAYMENT_COMPLETED_KEY);
    }

    setPaymentCompleted(): void {
        localStorage.setItem(PAYMENT_COMPLETED_KEY, 'true');
    }

    saveBookingSummary(cart: CheckoutCart): void {
        localStorage.setItem(BOOKING_SUMMARY_KEY, JSON.stringify(cart));
    }

    getBookingSummary(): CheckoutCart | null {
        const stored = localStorage.getItem(BOOKING_SUMMARY_KEY);
        if (!stored) { return null; }
        try { return JSON.parse(stored) as CheckoutCart; } catch { return null; }
    }

    clearBookingSummary(): void {
        localStorage.removeItem(BOOKING_SUMMARY_KEY);
    }


    getSteps(current: 'cart' | 'information' | 'checkout' | 'success'): CheckoutStepView[] {
        const steps: CheckoutStepView[] = [
            { name: 'Panier', route: '/golfers/cart', status: 'pending', clickable: true },
            { name: 'Informations', route: '/golfers/information', status: 'pending', clickable: true },
            { name: 'Paiement', route: '/golfers/checkout', status: 'pending', clickable: true },
            { name: 'Confirmation', route: '/golfers/booking-success', status: 'pending', clickable: false }
        ];

        const map: Record<'cart' | 'information' | 'checkout' | 'success', number> = {
            cart: 0,
            information: 1,
            checkout: 2,
            success: 3
        };

        const currentIndex = map[current];
        steps.forEach((step, index) => {
            if (index < currentIndex) {
                step.status = 'completed';
            } else if (index === currentIndex) {
                step.status = 'active';
            }
        });

        return steps;
    }

    private loadCart(): void {
        const stored = localStorage.getItem(CART_KEY);
        if (!stored) {
            return;
        }

        try {
            const parsed = JSON.parse(stored) as CheckoutCart;
            this.cart = { ...this.cart, ...parsed };
        } catch {
            localStorage.removeItem(CART_KEY);
        }
    }
}
