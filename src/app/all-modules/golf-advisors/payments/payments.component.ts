import { Component, OnInit } from '@angular/core';
import { PaymentRecord, PaymentService } from 'src/app/services/payment.service';

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
    payments: PaymentRecord[] = [];
    processingPayments = new Set<number>();

    toastVisible = false;
    toastType: 'success' | 'error' = 'success';
    toastMessage = '';
    private toastTimeoutRef: any = null;

    constructor(private paymentService: PaymentService) { }

    ngOnInit(): void {
        this.paymentService.getPayments().subscribe((items) => {
            this.payments = items;
        });
    }

    private isCashPayment(payment: PaymentRecord): boolean {
        return (payment.paymentMethod || '').toString().trim().toUpperCase() === 'CASH';
    }

    isPendingCash(payment: PaymentRecord): boolean {
        return (this.isCashPayment(payment) && payment.status !== 'PAID') || payment.status === 'PENDING_CASH';
    }

    private isCollected(payment: PaymentRecord): boolean {
        return payment.status === 'PAID';
    }

    showToast(type: 'success' | 'error', message: string): void {
        this.toastType = type;
        this.toastMessage = message;
        this.toastVisible = true;
        if (this.toastTimeoutRef) {
            clearTimeout(this.toastTimeoutRef);
        }
        this.toastTimeoutRef = setTimeout(() => {
            this.toastVisible = false;
        }, 3000);
    }

    confirmerPaiement(payment: PaymentRecord): void {
        this.processingPayments.add(payment.id);
        
        this.paymentService.confirmCashPayment(payment.id).subscribe({
            next: (updatedPayment) => {
                this.processingPayments.delete(payment.id);
                payment.status = 'PAID';
                payment.paymentMethod = updatedPayment?.paymentMethod || payment.paymentMethod;
                
                // Forcer le rafraîchissement des calculs auto (total, validés, pending)
                this.payments = [...this.payments];
                
                this.showToast('success', 'Paiement en espèces confirmé avec succès !');
            },
            error: (err) => {
                this.processingPayments.delete(payment.id);
                console.error('Erreur de confirmation:', err);
                this.showToast('error', 'Erreur lors de la confirmation. Veuillez vérifier votre connexion.');
            }
        });
    }

    displayStatus(payment: PaymentRecord): string {
        if (this.isPendingCash(payment)) {
            return 'En attente (espèces)';
        }

        if (payment.status === 'FAILED') {
            return 'Échoué';
        }

        return 'Payé';
    }

    get totalAmount(): number {
        return this.payments.reduce((sum, payment) => sum + (this.isCollected(payment) ? payment.amount : 0), 0);
    }

    get totalPaid(): number {
        return this.payments.filter((payment) => this.isCollected(payment)).length;
    }

    get totalPendingCash(): number {
        return this.payments.filter((payment) => this.isPendingCash(payment)).length;
    }

    asDate(value: string): Date {
        return new Date(value);
    }

    athleteFullName(payment: PaymentRecord): string {
        const resolvedName = this.findAthleteName(payment as any);
        return resolvedName || '-';
    }

    private findAthleteName(source: any): string {
        const exactName = this.findValueByKeys(source, [
            'athleteName',
            'athleteNomComplet',
            'athleteFullName',
            'athlete_full_name',
            'nomCompletAthlete',
            'customerName',
            'clientName',
            'fullName',
            'nomComplet',
            'displayName',
            'name'
        ]);

        if (exactName) {
            return exactName;
        }

        const firstName = this.findValueByKeys(source, [
            'athleteFirstName',
            'athletePrenom',
            'prenomAthlete',
            'firstName',
            'prenom',
            'firstname'
        ]);

        const lastName = this.findValueByKeys(source, [
            'athleteLastName',
            'athleteNom',
            'nomAthlete',
            'lastName',
            'nom',
            'lastname'
        ]);

        const combined = `${firstName} ${lastName}`.trim();
        return combined;
    }

    private findValueByKeys(source: any, candidateKeys: string[]): string {
        const visited = new Set<any>();
        return this.findValueByKeysRecursive(source, candidateKeys.map((key) => key.toLowerCase()), visited, 0);
    }

    private findValueByKeysRecursive(
        source: any,
        candidateKeys: string[],
        visited: Set<any>,
        depth: number
    ): string {
        if (!source || typeof source !== 'object' || visited.has(source) || depth > 5) {
            return '';
        }

        visited.add(source);

        const entries = Object.entries(source);

        for (const [key, value] of entries) {
            if (typeof value !== 'string') {
                continue;
            }

            if (candidateKeys.includes(key.toLowerCase()) && value.trim().length > 0) {
                return value.trim();
            }
        }

        for (const [, value] of entries) {
            if (!value || typeof value !== 'object') {
                continue;
            }

            const nested = this.findValueByKeysRecursive(value, candidateKeys, visited, depth + 1);
            if (nested) {
                return nested;
            }
        }

        return '';
    }
}