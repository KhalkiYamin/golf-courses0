import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AthleteRoutingModule } from './athlete-routing.module';
import { AthleteShellLayoutComponent as AthleteLayoutComponent } from './athlete-layout/athlete-layout.component';
import { AthleteDashboardComponent } from './athlete-dashboard/athlete-dashboard.component';
import { AthleteProfileComponent } from './athlete-profile/athlete-profile.component';
import { AthleteSessionsComponent } from './athlete-sessions/athlete-sessions.component';
import { AthleteNotificationsComponent } from './athlete-notifications/athlete-notifications.component';
import { AthletePlanningComponent } from './athlete-planning/athlete-planning.component';
import { AthleteEvaluationsComponent } from './athlete-evaluations/athlete-evaluations.component';
import { AthleteChatbotComponent } from './athlete-chatbot/athlete-chatbot.component';
import { AthleteCoachesComponent } from './athlete-coaches/athlete-coaches.component';

@NgModule({
    declarations: [
        AthleteLayoutComponent,
        AthleteDashboardComponent,
        AthleteProfileComponent,
        AthleteSessionsComponent,
        AthleteNotificationsComponent,
        AthletePlanningComponent,
        AthleteEvaluationsComponent,
        AthleteChatbotComponent,
        AthleteCoachesComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        AthleteRoutingModule
    ]
})
export class AthleteModule { }
