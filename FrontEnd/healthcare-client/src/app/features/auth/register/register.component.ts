import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
            MatCardModule, MatInputModule, MatButtonModule, MatSelectModule, MatProgressSpinnerModule],
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Create account</mat-card-title>
          <mat-card-subtitle>Join HealthCare today</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="row-2">
              <mat-form-field appearance="outline">
                <mat-label>First name</mat-label>
                <input matInput formControlName="firstName">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Last name</mat-label>
                <input matInput formControlName="lastName">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password">
              <mat-hint>Min 8 characters, 1 uppercase, 1 number</mat-hint>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>I am a</mat-label>
              <mat-select formControlName="role">
                <mat-option value="Patient">Patient</mat-option>
                <mat-option value="Doctor">Doctor</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width" *ngIf="form.get('role')?.value === 'Doctor'">
              <mat-label>Specialization</mat-label>
              <input matInput formControlName="specialization">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width" *ngIf="form.get('role')?.value === 'Patient'">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone" type="tel">
            </mat-form-field>
            <p class="error-msg" *ngIf="error">{{ error }}</p>
            <button mat-raised-button color="primary" type="submit"
                    [disabled]="form.invalid || loading" class="full-width submit-btn">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Create Account</span>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p class="login-link">Already have an account? <a routerLink="/login">Sign in</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-page { display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f5f5f5; padding:2rem 1rem; }
    .auth-card { width:440px; padding:1rem; }
    .full-width { width:100%; margin-bottom:12px; }
    .row-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
    .row-2 mat-form-field { width:100%; }
    .submit-btn { height:44px; margin-top:8px; display:flex; align-items:center; justify-content:center; gap:8px; }
    .error-msg { color:#f44336; font-size:13px; margin:4px 0; }
    .login-link { text-align:center; font-size:13px; }
    .login-link a { color:#1976d2; text-decoration:none; }
    mat-card-header { margin-bottom:1rem; }
  `]
})
export class RegisterComponent {
  form = this.fb.group({
    firstName:      ['', Validators.required],
    lastName:       ['', Validators.required],
    email:          ['', [Validators.required, Validators.email]],
    password:       ['', [Validators.required, Validators.minLength(8)]],
    role:           ['Patient', Validators.required],
    specialization: [''],
    phone:          ['']
  });
  error = ''; loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;
    this.loading = true; this.error = '';
    const v = this.form.value;
    this.auth.register({
      email: v.email!, password: v.password!, role: v.role!,
      firstName: v.firstName!, lastName: v.lastName!,
      phone: v.phone || undefined, specialization: v.specialization || undefined
    }).subscribe({
      next: res => this.router.navigate([res.role === 'Doctor' ? '/doctor' : '/patient']),
      error: err => { this.error = err.error?.message || 'Registration failed.'; this.loading = false; }
    });
  }
}
