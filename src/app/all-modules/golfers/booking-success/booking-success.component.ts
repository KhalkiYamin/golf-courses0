import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutCart, CheckoutFlowService } from '../services/checkout-flow.service';

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.css']
})
export class BookingSuccessComponent implements OnInit {

  cart: CheckoutCart = {
    seanceId: 0,
    coachId: 0,
    title: 'Seance de sport',
    duration: '1 heure',
    coach: 'Coach',
    unitPrice: 20,
    quantity: 1,
    subtotal: 20
  };

  successMessage = 'Votre paiement a été traité avec succès !';
  isCashPayment = false;
  reservationCompleted = false;
  reservationError = false;

  constructor(
    private checkoutFlow: CheckoutFlowService,
    private router: Router
  ) { }

  private isValidSummary(summary: CheckoutCart | null | undefined): summary is CheckoutCart {
    return !!(
      summary &&
      Number(summary.seanceId) > 0 &&
      Number(summary.coachId) > 0 &&
      (summary.title || '').toString().trim().length > 0 &&
      (summary.coach || '').toString().trim().length > 0
    );
  }

  ngOnInit(): void {
    const state = history.state || {};
    const stateSummary = state.bookingSummary as CheckoutCart | undefined;
    const stateMessage = state.message as string | undefined;
    const paymentMethod = state.paymentMethod as string | undefined;
    const reservationCompleted = state.reservationCompleted as boolean | undefined;
    const reservationError = state.reservationError as boolean | undefined;

    if (this.isValidSummary(stateSummary)) {
      this.cart = stateSummary;

      // Gérer les différents états
      if (reservationCompleted) {
        this.reservationCompleted = true;
        this.successMessage = stateMessage || 'Paiement et réservation effectués avec succès !';
      } else if (reservationError) {
        this.reservationError = true;
        this.successMessage = stateMessage || 'Paiement réussi, mais la réservation a échoué.';
      } else if (paymentMethod === 'CASH' && stateMessage) {
        this.successMessage = stateMessage;
        this.isCashPayment = true;
      } else if (stateMessage) {
        this.successMessage = stateMessage;
      }

      return;
    }

    const summary = this.checkoutFlow.getBookingSummary();
    if (this.isValidSummary(summary)) {
      this.cart = summary;
      return;
    }

    const cart = this.checkoutFlow.getCart();
    if (this.isValidSummary(cart)) {
      this.cart = cart;
      return;
    }

    this.router.navigate(['/golfers/cart']);
  }

  goToHome(): void {
    this.router.navigateByUrl('/dashboard/athlete/dashboard');
  }

}
