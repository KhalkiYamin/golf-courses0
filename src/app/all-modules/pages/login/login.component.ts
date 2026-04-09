import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';
  emailError: string = '';
  passwordError: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  validate(): boolean {
    this.emailError = '';
    this.passwordError = '';
    let valid = true;

    if (!this.email || this.email.trim() === '') {
      this.emailError = "L'email est obligatoire";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError = 'Email invalide';
      valid = false;
    }

    if (!this.password || this.password.trim() === '') {
      this.passwordError = 'Le mot de passe est obligatoire';
      valid = false;
    }

    return valid;
  }

  submit(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.validate()) {
      return;
    }

    this.loading = true;

    const loginRequest = {
      email: this.email.trim(),
      password: this.password,
    };

    this.authService.login(loginRequest).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.successMsg = 'Connexion réussie ! Redirection...';

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('nom');
        localStorage.removeItem('prenom');

        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        if (response.role) {
          localStorage.setItem('role', response.role);
        }

        if (response.email) {
          localStorage.setItem('email', response.email);
        }

        if (response.nom) {
          localStorage.setItem('nom', response.nom);
        }

        if (response.prenom) {
          localStorage.setItem('prenom', response.prenom);
        }

        setTimeout(() => {
          const role = response.role;

          if (role === 'ADMIN') {
            this.router.navigate(['/golf-advisors/advisors-dashboard']);
          } else if (role === 'COACH') {
            this.router.navigate(['/dashboard/coach']);
          } else if (role === 'ATHLETE') {
            this.router.navigate(['/dashboard/athlete']);
          } else {
            this.router.navigate(['/']);
          }
        }, 1000);
      },
      error: (err: any) => {
        this.loading = false;

        if (err.status === 401) {
          this.errorMsg = 'Email ou mot de passe incorrect';
        } else if (err.status === 403) {
          this.errorMsg = "Votre compte est désactivé. Contactez l'administrateur.";
        } else if (err.status === 0) {
          this.errorMsg = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        } else {
          this.errorMsg =
            err.error?.message || 'Erreur lors de la connexion. Veuillez réessayer.';
        }
      },
    });
  }
}