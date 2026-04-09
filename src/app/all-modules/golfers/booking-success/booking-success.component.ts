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
    const nav = this.router.getCurrentNavigation();
    const stateSummary = nav?.extras?.state?.bookingSummary as CheckoutCart | undefined;

    if (this.isValidSummary(stateSummary)) {
      this.cart = stateSummary;
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
