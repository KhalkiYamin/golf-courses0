import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { CheckoutFlowService } from '../services/checkout-flow.service';
import {
  ReservationSeanceDto,
  ReservationSeanceService
} from 'src/app/services/reservation-seance.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  paymentError = '';
  selectedPlan: 'SEANCE' | 'MENSUEL' | 'SEMESTRE' | 'ANNUEL' = 'SEANCE';
  isReservationFlow = false;

  private baseTitle = 'Football Training Session';
  private baseDuration = '1 heure';
  private baseCoach = 'Ahmed Ben Ali';
  private baseUnitPrice = 20;
  private baseSessionQuantity = 1;
  private baseSeanceId = 0;
  private baseCoachId = 0;

  private readonly planConfig: {
    [key: string]: { sessions: number; multiplier: number };
  } = {
      SEANCE: { sessions: 1, multiplier: 1 },
      MENSUEL: { sessions: 4, multiplier: 0.95 },
      SEMESTRE: { sessions: 24, multiplier: 0.9 },
      ANNUEL: { sessions: 48, multiplier: 0.85 }
    };

  order = {
    title: 'Football Training Session',
    duration: '1 heure',
    coach: 'Ahmed Ben Ali',
    quantity: 1,
    unitPrice: 20.00,
    subtotal: 20.00,
    discount: 0,
    seanceId: 0,
    coachId: 0
  };

  get total(): number {
    return this.order.subtotal;
  }

  private hasValidCartData(cart: any): boolean {
    return !!(
      cart &&
      Number(cart.seanceId) > 0 &&
      Number(cart.coachId) > 0 &&
      (cart.title || '').toString().trim().length > 0 &&
      (cart.coach || '').toString().trim().length > 0
    );
  }

  private buildOrderSummary(): any {
    return {
      seanceId: this.order.seanceId,
      coachId: this.order.coachId,
      title: this.order.title,
      duration: this.order.duration,
      coach: this.order.coach,
      unitPrice: this.order.unitPrice,
      quantity: this.order.quantity,
      subtotal: this.order.subtotal,
      discount: 0
    };
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private checkoutFlow: CheckoutFlowService,
    private reservationSeanceService: ReservationSeanceService
  ) { }

  ngOnInit(): void {
    // Check if this is a reservation flow
    this.route.queryParams.subscribe(params => {
      this.isReservationFlow = params['fromReservation'] === 'true';
      console.log('🔍 Checkout flow type:', this.isReservationFlow ? 'RESERVATION' : 'REGULAR');
    });

    const cart = this.checkoutFlow.getCart();

    if (this.hasValidCartData(cart) && cart.quantity) {
      const safeQuantity = Number(cart.quantity) > 0 ? Number(cart.quantity) : 1;
      const safeSubtotal = Number(cart.subtotal) > 0 ? Number(cart.subtotal) : 0;
      const resolvedUnitPrice = safeSubtotal > 0
        ? parseFloat((safeSubtotal / safeQuantity).toFixed(2))
        : this.baseUnitPrice;

      this.baseTitle = cart.title || this.baseTitle;
      this.baseDuration = cart.duration || this.baseDuration;
      this.baseCoach = cart.coach || this.baseCoach;
      this.baseSessionQuantity = safeQuantity;
      this.baseUnitPrice = resolvedUnitPrice;
      this.baseSeanceId = Number(cart.seanceId || 0);
      this.baseCoachId = Number(cart.coachId || 0);

      this.order = {
        title: this.baseTitle,
        duration: this.baseDuration,
        coach: this.baseCoach,
        quantity: safeQuantity,
        unitPrice: resolvedUnitPrice,
        subtotal: parseFloat((resolvedUnitPrice * safeQuantity).toFixed(2)),
        discount: 0,
        seanceId: this.baseSeanceId,
        coachId: this.baseCoachId
      };
      this.checkoutFlow.saveBookingSummary(this.buildOrderSummary());
    } else {
      this.router.navigate(['/golfers/cart']);
      return;
    }

    this.form = this.fb.group({
      paymentMethod: ['CARTE', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardHolder: ['', Validators.required],
      saveCard: [false],
      paymentType: ['SEANCE', Validators.required]
    });

    this.toggleCardValidators(this.form.get('paymentMethod')?.value);

    this.form.get('paymentMethod')?.valueChanges.subscribe((method) => {
      this.toggleCardValidators(method);
    });

    this.form.get('paymentType')?.valueChanges.subscribe((plan) => {
      this.updatePlanPricing(plan);
    });

    this.updatePlanPricing(this.form.get('paymentType')?.value);
  }

  private updatePlanPricing(plan: string): void {
    const planKey = this.planConfig[plan] ? plan : 'SEANCE';
    const config = this.planConfig[planKey];

    this.selectedPlan = planKey as 'SEANCE' | 'MENSUEL' | 'SEMESTRE' | 'ANNUEL';

    const sessions = planKey === 'SEANCE' ? this.baseSessionQuantity : config.sessions;
    const unitPrice = parseFloat((this.baseUnitPrice * config.multiplier).toFixed(2));
    const subtotal = parseFloat((unitPrice * sessions).toFixed(2));

    this.order = {
      ...this.order,
      title: this.baseTitle,
      duration: this.baseDuration,
      coach: this.baseCoach,
      quantity: sessions,
      unitPrice,
      subtotal,
      discount: 0,
      seanceId: this.baseSeanceId,
      coachId: this.baseCoachId
    };
  }

  private toggleCardValidators(method: string): void {
    const isCard = method === 'CARTE';
    const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardHolder'];

    cardFields.forEach((field) => {
      const control = this.form.get(field);

      if (!control) {
        return;
      }

      if (isCard) {
        if (field === 'cardNumber') {
          control.setValidators([Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]);
        }
        if (field === 'expiryDate') {
          control.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
        }
        if (field === 'cvv') {
          control.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
        }
        if (field === 'cardHolder') {
          control.setValidators([Validators.required]);
        }
      } else {
        control.clearValidators();
        control.setValue('');
      }

      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    this.form.get('cardNumber')?.setValue(val, { emitEvent: false });
    input.value = val;
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').substring(0, 4);

    if (val.length >= 3) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }

    this.form.get('expiryDate')?.setValue(val, { emitEvent: false });
    input.value = val;
  }

  get isCardPayment(): boolean {
    return this.form.get('paymentMethod')?.value === 'CARTE';
  }

  onSubmit(): void {
    this.paymentError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const cart = this.checkoutFlow.getCart();

    if (!cart?.seanceId) {
      this.paymentError = 'Seance ID is missing.';
      return;
    }

    if (!cart?.coachId) {
      this.paymentError = 'Coach ID is missing.';
      return;
    }

    this.loading = true;

    const customerInfo = cart?.customerInfo;
    const loggedAthlete = this.getLoggedAthleteIdentity();
    const athleteFirstName = (customerInfo?.firstName || loggedAthlete.firstName || '').trim();
    const athleteLastName = (customerInfo?.lastName || loggedAthlete.lastName || '').trim();
    const athleteFullName = `${athleteFirstName} ${athleteLastName}`.trim();

    const payload = {
      title: this.order.title,
      coach: this.order.coach,
      athleteFirstName,
      athleteLastName,
      athleteFullName,
      athleteEmail: (customerInfo?.email || loggedAthlete.email || '').trim(),
      customerName: athleteFullName,
      clientName: athleteFullName,
      amount: this.total,
      quantity: this.order.quantity,
      paymentMethod: this.form.value.paymentMethod,
      paymentType: this.form.value.paymentType,
      discount: 0,
      seanceId: Number(cart.seanceId),
      coachId: Number(cart.coachId)
    };

    console.log('PAYMENT PAYLOAD =', payload);
    console.log('ORDER =', this.order);
    console.log('CART =', cart);

    this.paymentService.createPayment(payload).subscribe({
      next: () => {
        this.loading = false;
        const summary = this.buildOrderSummary();
        this.checkoutFlow.saveBookingSummary(summary);

        // Différencier le comportement selon le mode de paiement
        const method = this.form.value.paymentMethod;
        
        if (method !== 'CASH') {
          this.checkoutFlow.setPaymentCompleted();
        }
        
        this.checkoutFlow.clearCart();

        // Si c'est un flow de réservation, faire la réservation automatiquement
        if (this.isReservationFlow) {
          console.log('🎯 Reservation flow detected, making automatic reservation...');
          this.makeReservationAfterPayment(cart.seanceId, cart.coachId, summary, method);
        } else {
          this.router.navigate(['/golfers/booking-success'], {
            state: { 
              bookingSummary: summary,
              paymentMethod: method,
              message: method === 'CASH' ? 'Vous pouvez réserver votre séance maintenant. Le coach confirmera après validation du paiement.' : '✅ Paiement réussi ! Vous pouvez maintenant réserver votre séance.'
            }
          });
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('PAYMENT ERROR =', err);
        this.paymentError = err?.error?.message || 'Le paiement a echoue. Merci de reessayer.';
      }
    });
  }

  editOrder(): void {
    this.checkoutFlow.saveCart({
      ...this.checkoutFlow.getCart(),
      ...this.order
    });

    this.router.navigate(['/golfers/cart'], {
      queryParams: {
        seanceId: this.checkoutFlow.getCart().seanceId || 0,
        coachId: this.checkoutFlow.getCart().coachId || 0,
        price: this.order.unitPrice || 20
      }
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }

  private getLoggedAthleteIdentity(): { firstName: string; lastName: string; email: string } {
    try {
      const rawUser = localStorage.getItem('user');
      if (!rawUser) {
        return { firstName: '', lastName: '', email: '' };
      }

      const user = JSON.parse(rawUser);
      return {
        firstName: (user?.prenom || user?.firstName || user?.firstname || '').toString().trim(),
        lastName: (user?.nom || user?.lastName || user?.lastname || '').toString().trim(),
        email: (user?.email || user?.mail || user?.username || user?.login || '').toString().trim()
      };
    } catch {
      return { firstName: '', lastName: '', email: '' };
    }
  }

  private makeReservationAfterPayment(seanceId: number, coachId: number, paymentSummary: any, paymentMethod: string): void {
    console.log('📝 Making reservation after payment:', { seanceId, coachId });

    this.reservationSeanceService.reserverSeance(seanceId, coachId).subscribe({
      next: () => {
        console.log('✅ Reservation completed successfully after payment!');

        const isCash = paymentMethod === 'CASH';
        const message = isCash 
          ? 'Vous pouvez réserver votre séance maintenant. Le coach confirmera après validation du paiement par l’administration.'
          : '✅ Paiement réussi ! Vous avez réservé votre séance.';

        // Navigate to booking success with reservation confirmation
        this.router.navigate(['/golfers/booking-success'], {
          state: {
            bookingSummary: paymentSummary,
            reservationCompleted: true,
            paymentMethod: paymentMethod,
            message: message
          }
        });
      },
      error: (error: any) => {
        console.error('❌ Reservation failed after payment:', error);

        // Even if reservation fails, payment was successful
        // Navigate to success but indicate reservation issue
        this.router.navigate(['/golfers/booking-success'], {
          state: {
            bookingSummary: paymentSummary,
            reservationError: true,
            message: 'Paiement réussi, mais la réservation a échoué. Contactez le support.'
          }
        });
      }
    });
  }
}