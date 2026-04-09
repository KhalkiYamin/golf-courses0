import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  public daterange: any = {};
  selectedSession = {
    seanceId: 86,
    coachId: 90,
    title: 'Golf Training Session',
    duration: '1 heure',
    coach: 'Toma Masters',
    price: 20
  };

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  public options: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
  };

  public selectedDate(value: any, datepicker?: any) {
    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = value.start;
    datepicker.end = value.end;

    // use passed valuable to update state
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.hydrateFromQueryParams();
  }

  proceedToCart(): void {
    this.router.navigate(['/golfers/cart'], {
      queryParams: {
        seanceId: this.selectedSession.seanceId,
        coachId: this.selectedSession.coachId,
        title: this.selectedSession.title,
        duration: this.selectedSession.duration,
        coach: this.selectedSession.coach,
        price: this.selectedSession.price
      }
    });
  }

  private hydrateFromQueryParams(): void {
    const seanceId = Number(this.route.snapshot.queryParamMap.get('seanceId') || 0);
    const coachId = Number(this.route.snapshot.queryParamMap.get('coachId') || 0);
    const title = this.route.snapshot.queryParamMap.get('title') || '';
    const duration = this.route.snapshot.queryParamMap.get('duration') || '';
    const coach = this.route.snapshot.queryParamMap.get('coach') || '';
    const price = Number(this.route.snapshot.queryParamMap.get('price') || 0);

    if (seanceId > 0) {
      this.selectedSession.seanceId = seanceId;
    }
    if (coachId > 0) {
      this.selectedSession.coachId = coachId;
    }
    if (title) {
      this.selectedSession.title = title;
    }
    if (duration) {
      this.selectedSession.duration = duration;
    }
    if (coach) {
      this.selectedSession.coach = coach;
    }
    if (price > 0) {
      this.selectedSession.price = price;
    }
  }

}
