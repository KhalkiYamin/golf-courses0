import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent implements OnInit {
  email = '';
  code = '';
  errorMsg = '';
  successMsg = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const savedEmail = localStorage.getItem('resetEmail');
    if (savedEmail) {
      this.email = savedEmail;
    }
  }

  submit(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.email || !this.code) {
      this.errorMsg = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;

    this.authService.verifyResetCode(this.email, this.code).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = res;
        localStorage.setItem('resetEmail', this.email);
        localStorage.setItem('resetCode', this.code);
        this.router.navigate(['/pages/reset-password']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || err.error || 'Code invalide ou expiré';
      }
    });
  }
}