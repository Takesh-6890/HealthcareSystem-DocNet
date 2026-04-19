import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
            MatCardModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Welcome back</mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" autocomplete="email">
              <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
              <mat-error *ngIf="form.get('email')?.hasError('email')">Enter a valid email</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" autocomplete="current-password">
              <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>
            <p class="error-msg" *ngIf="error">{{ error }}</p>
            <button mat-raised-button color="primary" type="submit"
                    [disabled]="form.invalid || loading" class="full-width submit-btn">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Sign In</span>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p class="register-link">Don't have an account? <a routerLink="/register">Register here</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-page { display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f5f5f5; }
    .auth-card { width:400px; padding:1rem; }
    .full-width { width:100%; margin-bottom:12px; }
    .submit-btn { height:44px; margin-top:8px; display:flex; align-items:center; justify-content:center; gap:8px; }
    .error-msg { color:#f44336; font-size:13px; margin:4px 0; }
    .register-link { text-align:center; font-size:13px; }
    .register-link a { color:#1976d2; text-decoration:none; }
    mat-card-header { margin-bottom:1rem; }
  `]
})
export class LoginComponent {
  form!: FormGroup;
  error = '';
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: res => this.router.navigate([res.role === 'Doctor' ? '/doctor' : '/patient']),
      error: err => { this.error = err.error?.message || 'Login failed. Check your credentials.'; this.loading = false; }
    });
  }
}
