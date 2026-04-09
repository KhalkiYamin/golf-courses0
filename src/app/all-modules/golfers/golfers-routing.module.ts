import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvisorsProfileComponent } from './advisors-profile/advisors-profile.component';
import { BookingSuccessComponent } from './booking-success/booking-success.component';
import { BookingComponent } from './booking/booking.component';
import { CartComponent } from './cart/cart.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChatComponent } from './chat/chat.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { GolferDashboardComponent } from './golfer-dashboard/golfer-dashboard.component';
import { GolfersComponent } from './golfers.component';
import { InformationComponent } from './information/information.component';
import { MapGridComponent } from './map-grid/map-grid.component';
import { MapListComponent } from './map-list/map-list.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '', component: GolfersComponent,
    children: [
      { path: 'map-grid', component: MapGridComponent },
      { path: 'map-list', component: MapListComponent },
      { path: 'search', component: SearchComponent },
      { path: 'advisors-profile', component: AdvisorsProfileComponent },
      { path: 'booking', component: BookingComponent },
      { path: 'cart', component: CartComponent },
      { path: 'information', component: InformationComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'booking-success', component: BookingSuccessComponent },
      { path: 'golfer-dashboard', component: GolferDashboardComponent },
      { path: 'favourites', component: FavouritesComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'profile-settings', component: ProfileSettingsComponent },
      { path: 'change-password', component: ChangePasswordComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GolfersRoutingModule { }
