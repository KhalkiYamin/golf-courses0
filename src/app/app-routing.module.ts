import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyEmailComponent } from './all-modules/pages/verify-email/verify-email.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'verify-email', component: VerifyEmailComponent },
    { path: '', loadChildren: () => import('./all-modules/all-modules.module').then(m => m.AllModulesModule) },
    { path: '**', redirectTo: '', component: HomeComponent }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
