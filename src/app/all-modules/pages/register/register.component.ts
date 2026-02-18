import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

type Role = 'COACH' | 'ATHLETE' | '';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // Champs communs
  nom: string = '';
  prenom: string = '';
  telephone: string = '';
  email: string = '';
  password: string = '';
  role: Role = '';

  // Champs Coach
  specialite: string = '';
  experience: number | null = null;

  // Champs Athlète
  sport: string = '';
  niveau: string = '';

  loading: boolean = false;
  errorMsg: string = '';

  constructor(private auth: AuthService, private router: Router) { }

  onRoleChange() {
    this.errorMsg = '';

    if (this.role === 'COACH') {
      this.sport = '';
      this.niveau = '';
    } else if (this.role === 'ATHLETE') {
      this.specialite = '';
      this.experience = null;
    }
  }

  submit() {
    this.errorMsg = '';

    if (!this.nom || !this.prenom || !this.email || !this.password || !this.role) {
      this.errorMsg = 'عبّي الحقول الضرورية.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg = 'كلمة السر لازم على الأقل 6 حروف.';
      return;
    }

    if (this.role === 'COACH' && !this.specialite) {
      this.errorMsg = 'اكتب الاختصاص متاعك.';
      return;
    }

    if (this.role === 'ATHLETE' && (!this.sport || !this.niveau)) {
      this.errorMsg = 'كمّل معلومات الرياضي (sport + niveau).';
      return;
    }

    const payload: any = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      telephone: this.telephone,
      role: this.role,
      enabled: true
    };

    if (this.role === 'COACH') {
      payload.specialite = this.specialite;
      payload.experience = this.experience ?? 0;
    }

    if (this.role === 'ATHLETE') {
      payload.sport = this.sport;
      payload.niveau = this.niveau;
    }

    this.loading = true;

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMsg = err?.error?.message || 'صار خطأ في التسجيل.';
      }
    });
  }
}