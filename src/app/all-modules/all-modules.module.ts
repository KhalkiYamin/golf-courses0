import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   // 👈 هذا لازم يتزاد

import { AllModulesRoutingModule } from './all-modules-routing.module';
import { AllModulesComponent } from './all-modules.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';

@NgModule({
  declarations: [
    AllModulesComponent,
    VerifyCodeComponent,
  ],
  imports: [
    CommonModule,
    AllModulesRoutingModule,
    FormsModule   // 👈 زيد هذا
  ]
})
export class AllModulesModule { }