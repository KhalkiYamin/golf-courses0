import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  errorMsg = '';
  successMsg = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  submit(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.email) {
      this.errorMsg = 'Veuillez saisir votre email';
      return;
    }

    this.loading = true;

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = res;
        localStorage.setItem('resetEmail', this.email);
        this.router.navigate(['/pages/verify-code']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || err.error || 'Erreur lors de l’envoi du code';
      }
    });
  }
}