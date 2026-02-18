import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GolfersRoutingModule } from './golfers-routing.module';
import { GolfersComponent } from './golfers.component';
import { MapGridComponent } from './map-grid/map-grid.component';
import { MapListComponent } from './map-list/map-list.component';
import { SearchComponent } from './search/search.component';
import { AdvisorsProfileComponent } from './advisors-profile/advisors-profile.component';
import { BookingComponent } from './booking/booking.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { BookingSuccessComponent } from './booking-success/booking-success.component';
import { GolferDashboardComponent } from './golfer-dashboard/golfer-dashboard.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { ChatComponent } from './chat/chat.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgSelect2Module } from 'ng-select2';
import { CrystalLightboxModule } from '@crystalui/angular-lightbox';
import { Daterangepicker } from 'ng2-daterangepicker';


@NgModule({
  declarations: [
    GolfersComponent,
    MapGridComponent,
    MapListComponent,
    SearchComponent,
    AdvisorsProfileComponent,
    BookingComponent,
    CheckoutComponent,
    BookingSuccessComponent,
    GolferDashboardComponent,
    FavouritesComponent,
    ChatComponent,
    ProfileSettingsComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    GolfersRoutingModule,
    NgSelect2Module,
    CrystalLightboxModule,
    Daterangepicker
  ]
})
export class GolfersModule { }
