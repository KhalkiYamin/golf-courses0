import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-advisors-dashboard',
  templateUrl: './advisors-dashboard.component.html',
  styleUrls: ['./advisors-dashboard.component.css']
})
export class AdvisorsDashboardComponent implements OnInit {

  pendingCoaches: User[] = [];
  isLoading: boolean = false;

  showModal: boolean = false;
  modalAction: 'accept' | 'reject' = 'accept';
  selectedCoach: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.loadPendingCoaches();
  }
  loadPendingCoaches() {
    this.isLoading = true;
    this.adminService.getPendingCoaches().subscribe({
      next: (data) => {
        this.pendingCoaches = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des coachs en attente', err);
        this.isLoading = false;
      }
    });
  }
  openModal(action: 'accept' | 'reject', coach: User) {
    this.modalAction = action;
    this.selectedCoach = coach;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedCoach = null;
  }

  confirmModal() {
    if (!this.selectedCoach) return;

    if (this.modalAction === 'accept') {
      this.adminService.approveCoach(this.selectedCoach.id).subscribe({
        next: (res) => {
          this.loadPendingCoaches();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de la validation', err);
          this.closeModal();
        }
      });
    } else {
      this.adminService.rejectCoach(this.selectedCoach.id).subscribe({
        next: (res) => {
          this.loadPendingCoaches();
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors du refus', err);
          this.closeModal();
        }
      });
    }
  }

}