import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentRecord, PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit {

  invoice: PaymentRecord | null = null;
  isLoading = true;
  currentUser: any = null;

  private readonly demoInvoice: PaymentRecord = {
    id: 1001,
    title: 'Séance Tennis — Niveau Avancé',
    coach: 'Karim Benali',
    amount: 150,
    quantity: 3,
    paymentMethod: 'Carte Bancaire',
    paymentType: 'ONLINE',
    promoCode: 'SPORT10',
    discount: 10,
    finalAmount: 405,
    status: 'PAID',
    createdAt: new Date().toISOString()
  };

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    try {
      const stored = localStorage.getItem('user');
      if (stored) { this.currentUser = JSON.parse(stored); }
    } catch { }

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.paymentService.getPaymentById(+id).subscribe({
        next: (data) => { this.invoice = data; this.isLoading = false; },
        error: () => { this.invoice = this.demoInvoice; this.isLoading = false; }
      });
    } else {
      this.invoice = this.demoInvoice;
      this.isLoading = false;
    }
  }

  get invoiceNumber(): string {
    return this.invoice ? '#INV-' + String(this.invoice.id).padStart(4, '0') : '';
  }

  get issuedDate(): string {
    if (!this.invoice?.createdAt) { return ''; }
    return new Date(this.invoice.createdAt).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  get subtotal(): number {
    return this.invoice ? this.invoice.amount * this.invoice.quantity : 0;
  }

  get discountAmount(): number {
    if (!this.invoice || !this.invoice.discount) { return 0; }
    return parseFloat((this.subtotal * this.invoice.discount / 100).toFixed(2));
  }

  get clientName(): string {
    if (!this.currentUser) { return 'Client Invité'; }
    const prenom = this.currentUser.prenom || '';
    const nom = this.currentUser.nom || '';
    return [prenom, nom].filter(Boolean).join(' ') || this.currentUser.email || 'Client';
  }

  get clientEmail(): string { return this.currentUser?.email || '—'; }
  get clientPhone(): string { return this.currentUser?.telephone || '—'; }

  get statusClass(): string {
    switch (this.invoice?.status) {
      case 'PAID': return 'status-paid';
      case 'PENDING_CASH': return 'status-pending';
      case 'FAILED': return 'status-failed';
      default: return 'status-pending';
    }
  }

  get statusLabel(): string {
    switch (this.invoice?.status) {
      case 'PAID': return 'Payé';
      case 'PENDING_CASH': return 'En attente';
      case 'FAILED': return 'Échoué';
      default: return '—';
    }
  }

  get statusIconClass(): string {
    switch (this.invoice?.status) {
      case 'PAID': return 'fas fa-check-circle';
      case 'PENDING_CASH': return 'fas fa-clock';
      case 'FAILED': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  }

  get paymentIconClass(): string {
    const m = (this.invoice?.paymentMethod || '').toLowerCase();
    if (m.includes('carte') || m.includes('card')) { return 'fas fa-credit-card'; }
    if (m.includes('espèce') || m.includes('cash')) { return 'fas fa-money-bill-wave'; }
    return 'fas fa-wallet';
  }

  formatAmount(value: number): string {
    return value.toFixed(2).replace('.', ',') + ' DT';
  }

  printInvoice(): void {
    window.print();
  }
}

