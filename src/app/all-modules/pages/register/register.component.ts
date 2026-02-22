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

  nom: string = '';
  prenom: string = '';
  telephone: string = '';
  email: string = '';
  password: string = '';
  role: Role = '';

  specialite: string = '';
  experience: number | null = null;

  sport: string = '';
  niveau: string = '';

  loading: boolean = false;
  errorMsg: string = '';
  successMsg: string = '';   // ✅ جديد

  constructor(private auth: AuthService, private router: Router) { }

  onRoleChange() {
    this.errorMsg = '';
    this.successMsg = '';

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
    this.successMsg = '';

    if (!this.nom || !this.prenom || !this.email || !this.password || !this.role) {
      this.errorMsg = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    if (this.role === 'COACH' && !this.specialite) {
      this.errorMsg = 'Veuillez indiquer votre spécialité.';
      return;
    }

    if (this.role === 'ATHLETE' && (!this.sport || !this.niveau)) {
      this.errorMsg = 'Veuillez compléter les informations du profil athlète (sport + niveau).';
      return;
    }

    const payload: any = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      telephone: this.telephone,
      role: this.role
      // ❌ ما تبعثش enabled من الفرونت
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
      next: (res: any) => {
        this.loading = false;

        // ✅ عرض رسالة النجاح اللي جاية من backend
        this.successMsg = res?.message || "Inscription réussie ✅";

        // ✅ Redirect بعد شوية
        setTimeout(() => {
          this.router.navigate(['/pages/login']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMsg = err?.error?.message || "Erreur lors de l'inscription.";
      }
    });
  }
}