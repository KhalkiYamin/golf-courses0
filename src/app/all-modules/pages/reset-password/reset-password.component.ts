import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  newPassword = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  errorMsg = '';
  successMsg = '';
  loading = false;

  email = localStorage.getItem('resetEmail') || '';
  code = localStorage.getItem('resetCode') || '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  submit(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMsg = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.loading = true;

    this.authService.resetPassword(this.email, this.code, this.newPassword).subscribe({
      next: (res: string) => {
        this.loading = false;
        this.successMsg = res;

        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetCode');

        setTimeout(() => {
          this.router.navigate(['/pages/login']);
        }, 1500);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMsg = err.error?.message || err.error || 'Erreur lors de la réinitialisation';
      }
    });
  }
}