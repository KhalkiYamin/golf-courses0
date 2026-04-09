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
        this.form = this.fb.group({
            firstName: [info?.firstName || '', Validators.required],
            lastName: [info?.lastName || '', Validators.required],
            email: [info?.email || '', [Validators.required, Validators.email]],
            phone: [info?.phone || '', Validators.required]
        });
    }

    continueToCheckout(): void {
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
}