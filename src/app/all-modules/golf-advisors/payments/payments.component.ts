import { Component, OnInit } from '@angular/core';
import { PaymentRecord, PaymentService } from 'src/app/services/payment.service';

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
    payments: PaymentRecord[] = [];

    constructor(private paymentService: PaymentService) { }

    ngOnInit(): void {
        this.paymentService.getPayments().subscribe((items) => {
            this.payments = items;
        });
    }

    private getCollectedAmount(payment: PaymentRecord): number {
        if (payment.status !== 'PAID') {
            return 0;
        }

        return Number(payment.amount || 0);
    }

    get totalAmount(): number {
        return this.payments.reduce((sum, payment) => sum + this.getCollectedAmount(payment), 0);
    }

    get totalPaid(): number {
        return this.payments.filter((p) => p.status === 'PAID').length;
    }

    get totalPendingCash(): number {
        return this.payments.filter((p) => p.status === 'PENDING_CASH').length;
    }

    asDate(value: string): Date {
        return new Date(value);
    }
}
