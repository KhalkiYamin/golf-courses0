import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AthleteShellLayoutComponent } from './athlete-layout/athlete-layout.component';
import { AthleteDashboardComponent } from './athlete-dashboard/athlete-dashboard.component';
import { AthleteProfileComponent } from './athlete-profile/athlete-profile.component';
import { AthleteSessionsComponent } from './athlete-sessions/athlete-sessions.component';
import { AthleteNotificationsComponent } from './athlete-notifications/athlete-notifications.component';
import { AthletePlanningComponent } from './athlete-planning/athlete-planning.component';
import { AthleteEvaluationsComponent } from './athlete-evaluations/athlete-evaluations.component';

const routes: Routes = [
    {
        path: '',
        component: AthleteShellLayoutComponent,
        children: [
            { path: 'dashboard', component: AthleteDashboardComponent },
            { path: 'profile', component: AthleteProfileComponent },
            { path: 'sessions', component: AthleteSessionsComponent },
            { path: 'notifications', component: AthleteNotificationsComponent },
            { path: 'planning', component: AthletePlanningComponent },
            { path: 'evaluations', component: AthleteEvaluationsComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: '**', redirectTo: 'dashboard' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AthleteRoutingModule { }
