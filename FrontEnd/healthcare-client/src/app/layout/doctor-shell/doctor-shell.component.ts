import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-doctor-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule,
            MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule],
  template: `
    <mat-sidenav-container class="shell-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">local_hospital</mat-icon>
          <span class="logo-text">HealthCare</span>
        </div>
        <div class="role-badge">Doctor Portal</div>
        <mat-nav-list>
          <a mat-list-item routerLink="/doctor/appointments" routerLinkActive="active-link">
            <mat-icon matListItemIcon>event</mat-icon>
            <span matListItemTitle>Appointments</span>
          </a>
        </mat-nav-list>
        <div class="sidenav-footer">
          <div class="user-info">
            <mat-icon>medical_services</mat-icon>
            <span>{{ auth.getEmail() }}</span>
          </div>
          <button mat-button (click)="auth.logout()" class="logout-btn">
            <mat-icon>logout</mat-icon> Sign out
          </button>
        </div>
      </mat-sidenav>
      <mat-sidenav-content class="main-content">
        <mat-toolbar class="toolbar doctor-toolbar">
          <span>Doctor Dashboard</span>
        </mat-toolbar>
        <div class="page-content">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .shell-container { height:100vh; }
    .sidenav { width:240px; background:#0d2137; color:white; display:flex; flex-direction:column; }
    .sidenav-header { display:flex; align-items:center; gap:10px; padding:20px 16px; border-bottom:1px solid rgba(255,255,255,0.1); }
    .logo-icon { color:#66bb6a; font-size:28px; width:28px; height:28px; }
    .logo-text { font-size:18px; font-weight:600; color:white; }
    .role-badge { margin:12px 16px; padding:4px 10px; background:rgba(102,187,106,0.2); color:#66bb6a; border-radius:4px; font-size:12px; font-weight:500; display:inline-block; }
    .sidenav-footer { margin-top:auto; padding:16px; border-top:1px solid rgba(255,255,255,0.1); }
    .user-info { display:flex; align-items:center; gap:8px; color:rgba(255,255,255,0.7); font-size:13px; margin-bottom:8px; }
    .logout-btn { color:rgba(255,255,255,0.7); width:100%; justify-content:flex-start; }
    .logout-btn mat-icon { margin-right:8px; }
    .doctor-toolbar { background:#0d47a1; color:white; }
    .main-content { background:#f5f7fa; }
    .page-content { padding:24px; }
    ::ng-deep .active-link { background:rgba(102,187,106,0.15) !important; color:#66bb6a !important; }
    ::ng-deep .mat-mdc-list-item { color:rgba(255,255,255,0.85) !important; }
  `]
})
export class DoctorShellComponent {
  constructor(public auth: AuthService) {}
}
