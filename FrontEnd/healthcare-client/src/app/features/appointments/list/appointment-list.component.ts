import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentService, Appointment } from '../../../core/services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule,
            MatIconModule, MatChipsModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>{{ isDoctor ? 'My Appointments' : 'My Appointments' }}</h1>
        <a mat-raised-button color="primary" routerLink="/patient/book" *ngIf="!isDoctor">
          <mat-icon>add</mat-icon> Book New
        </a>
      </div>

      <div *ngIf="loading" class="loading-center">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!loading && appointments.length === 0" class="empty-state">
        <mat-icon class="empty-icon">calendar_today</mat-icon>
        <p>No appointments found.</p>
        <a mat-raised-button color="primary" routerLink="/patient/book" *ngIf="!isDoctor">Book your first appointment</a>
      </div>

      <div class="appointments-grid" *ngIf="!loading && appointments.length > 0">
        <mat-card *ngFor="let appt of appointments" class="appt-card">
          <mat-card-header>
            <div mat-card-avatar class="avatar">{{ getInitials(isDoctor ? appt.patientName : appt.doctorName) }}</div>
            <mat-card-title>{{ isDoctor ? appt.patientName : appt.doctorName }}</mat-card-title>
            <mat-card-subtitle>{{ isDoctor ? '' : appt.specialization }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="appt-details">
              <div class="detail-row">
                <mat-icon>event</mat-icon>
                <span>{{ appt.slotStart | date:'EEEE, MMMM d, y' }}</span>
              </div>
              <div class="detail-row">
                <mat-icon>schedule</mat-icon>
                <span>{{ appt.slotStart | date:'h:mm a' }} – {{ appt.slotEnd | date:'h:mm a' }}</span>
              </div>
              <div class="detail-row">
                <mat-icon>notes</mat-icon>
                <span>{{ appt.reason }}</span>
              </div>
              <div class="status-row">
                <mat-chip [class]="'status-' + appt.status.toLowerCase()">{{ appt.status }}</mat-chip>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button color="primary"
               [routerLink]="isDoctor ? ['/doctor/consult', appt.id] : ['/patient/consult', appt.id]"
               *ngIf="appt.status === 'Scheduled' || appt.status === 'Confirmed'">
              <mat-icon>videocam</mat-icon> Join Video
            </a>
            <button mat-button color="warn" (click)="cancel(appt.id)"
                    *ngIf="!isDoctor && (appt.status === 'Scheduled' || appt.status === 'Confirmed')">
              <mat-icon>cancel</mat-icon> Cancel
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width:900px; margin:0 auto; }
    .page-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
    .page-header h1 { margin:0; font-size:24px; font-weight:500; }
    .loading-center { display:flex; justify-content:center; padding:60px; }
    .empty-state { text-align:center; padding:60px 20px; color:#666; }
    .empty-icon { font-size:64px; width:64px; height:64px; color:#ccc; margin-bottom:16px; }
    .appointments-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:16px; }
    .appt-card { border-radius:12px !important; }
    .avatar { background:#1976d2; color:white; display:flex; align-items:center; justify-content:center; font-weight:600; border-radius:50%; width:40px; height:40px; }
    .appt-details { margin-top:8px; display:flex; flex-direction:column; gap:8px; }
    .detail-row { display:flex; align-items:center; gap:8px; font-size:14px; color:#444; }
    .detail-row mat-icon { font-size:18px; width:18px; height:18px; color:#888; }
    .status-row { margin-top:4px; }
    ::ng-deep .status-scheduled { background:#e3f2fd !important; color:#1565c0 !important; }
    ::ng-deep .status-confirmed  { background:#e8f5e9 !important; color:#2e7d32 !important; }
    ::ng-deep .status-cancelled  { background:#ffebee !important; color:#c62828 !important; }
    ::ng-deep .status-completed  { background:#f3e5f5 !important; color:#6a1b9a !important; }
  `]
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  isDoctor = false;

  constructor(
    private apptSvc: AppointmentService,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.isDoctor = this.auth.getRole() === 'Doctor';
    this.load();
  }

  load() {
    this.loading = true;
    this.apptSvc.getMyAppointments(this.auth.getUserId(), this.auth.getRole()).subscribe({
      next: data => { this.appointments = data; this.loading = false; },
      error: () => { this.loading = false; this.snack.open('Failed to load appointments', 'Close', { duration: 3000 }); }
    });
  }

  cancel(id: string) {
    if (!confirm('Cancel this appointment?')) return;
    this.apptSvc.cancel(id).subscribe({
      next: () => { this.snack.open('Appointment cancelled', 'Close', { duration: 3000 }); this.load(); },
      error: () => this.snack.open('Failed to cancel', 'Close', { duration: 3000 })
    });
  }

  getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}
