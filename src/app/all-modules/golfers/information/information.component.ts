import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutCart, CheckoutFlowService } from '../services/checkout-flow.service';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
    form!: FormGroup;
    order!: CheckoutCart;
    athleteEmail = '';
    athleteFirstName = '';
    athleteLastName = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private checkoutFlow: CheckoutFlowService
    ) { }

    ngOnInit(): void {
        this.order = this.checkoutFlow.getCart();

        if (!this.order || !this.order.quantity) {
            this.router.navigate(['/golfers/cart'], {
                queryParams: {
                    seanceId: this.order?.seanceId || 0,
                    coachId: this.order?.coachId || 0,
                    price: this.order?.unitPrice || 20
                }
            });
            return;
        }

        const info = this.order.customerInfo;
        this.athleteFirstName = this.getAthleteFirstName();
        this.athleteLastName = this.getAthleteLastName();
        this.athleteEmail = this.getAthleteEmail();
        this.form = this.fb.group({
            firstName: [info?.firstName || this.athleteFirstName, Validators.required],
            lastName: [info?.lastName || this.athleteLastName, Validators.required],
            email: [this.athleteEmail || info?.email || '', [Validators.required, Validators.email]],
            phone: [info?.phone || '', Validators.required]
        });
    }

    continueToCheckout(): void {
        if (this.athleteEmail) {
            const enteredEmail = (this.form.get('email')?.value || '').toString().trim().toLowerCase();
            const accountEmail = this.athleteEmail.trim().toLowerCase();

            if (enteredEmail !== accountEmail) {
                this.form.get('email')?.setErrors({
                    ...(this.form.get('email')?.errors || {}),
                    athleteEmailMismatch: true
                });
                this.form.get('email')?.markAsTouched();
            }
        }

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.order.customerInfo = this.form.value;
        this.checkoutFlow.saveCart(this.order);

        this.router.navigate(['/golfers/checkout'], {
            queryParams: {
                seanceId: this.order.seanceId,
                coachId: this.order.coachId,
                price: this.order.unitPrice
            }
        });
    }

    backToCart(): void {
        this.router.navigate(['/golfers/cart'], {
            queryParams: {
                seanceId: this.order.seanceId,
                coachId: this.order.coachId,
                price: this.order.unitPrice
            }
        });
    }

    private getAthleteEmail(): string {
        try {
            const rawUser = localStorage.getItem('user');
            if (rawUser) {
                const user = JSON.parse(rawUser);
                const userEmail =
                    user?.email ||
                    user?.mail ||
                    user?.username ||
                    user?.login;

                if (typeof userEmail === 'string' && userEmail.includes('@')) {
                    return userEmail;
                }
            }
        } catch {
            // Ignore parsing issues and fallback to token extraction.
        }

        const token = localStorage.getItem('token') || '';
        if (!token) {
            return '';
        }

        try {
            const payloadPart = token.split('.')[1] || '';
            if (!payloadPart) {
                return '';
            }

            const normalizedBase64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
            const paddedBase64 = normalizedBase64 + '='.repeat((4 - (normalizedBase64.length % 4)) % 4);
            const payload = JSON.parse(atob(paddedBase64));

            const email = payload?.email || payload?.sub || payload?.username;
            return typeof email === 'string' && email.includes('@') ? email : '';
        } catch {
            return '';
        }
    }

    private getAthleteFirstName(): string {
        try {
            const rawUser = localStorage.getItem('user');
            if (!rawUser) {
                return '';
            }

            const user = JSON.parse(rawUser);
            const firstName = user?.prenom || user?.firstName || user?.firstname || '';
            return typeof firstName === 'string' ? firstName.trim() : '';
        } catch {
            return '';
        }
    }

    private getAthleteLastName(): string {
        try {
            const rawUser = localStorage.getItem('user');
            if (!rawUser) {
                return '';
            }

            const user = JSON.parse(rawUser);
            const lastName = user?.nom || user?.lastName || user?.lastname || '';
            return typeof lastName === 'string' ? lastName.trim() : '';
        } catch {
            return '';
        }
    }
}