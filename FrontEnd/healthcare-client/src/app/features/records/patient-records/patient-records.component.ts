import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-records',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule,
            MatInputModule, MatIconModule, MatExpansionModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="page">
      <h1>Patient Medical Records</h1>

      <div *ngIf="loading" class="loading-center"><mat-spinner diameter="40"></mat-spinner></div>

      <div *ngIf="!loading && record" class="record-container">
        <mat-card class="patient-card">
          <mat-card-header>
            <div mat-card-avatar class="avatar">{{ getInitials(record.name) }}</div>
            <mat-card-title>{{ record.name }}</mat-card-title>
            <mat-card-subtitle>DOB: {{ record.birthDate }} | FHIR ID: {{ fhirId }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="telecom-list">
              <div *ngFor="let t of record.telecom" class="telecom-item">
                <mat-icon>{{ t.system === 'email' ? 'email' : 'phone' }}</mat-icon>
                <span>{{ t.value }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-expansion-panel class="prescription-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              <mat-icon>medication</mat-icon> Add Prescription
            </mat-panel-title>
          </mat-expansion-panel-header>
          <form [formGroup]="rxForm" (ngSubmit)="addPrescription()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Medication name</mat-label>
              <input matInput formControlName="medication">
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Dosage instructions</mat-label>
              <input matInput formControlName="dosage" placeholder="e.g. 500mg twice daily after food">
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" [disabled]="rxForm.invalid || rxLoading">
              <mat-spinner diameter="18" *ngIf="rxLoading"></mat-spinner>
              <span *ngIf="!rxLoading">Save Prescription</span>
            </button>
          </form>
        </mat-expansion-panel>
      </div>

      <div *ngIf="!loading && !record" class="empty-state">
        <mat-icon class="empty-icon">folder_off</mat-icon>
        <p>No FHIR record found for this patient.</p>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width:700px; margin:0 auto; }
    h1 { font-size:24px; font-weight:500; margin-bottom:24px; }
    .loading-center { display:flex; justify-content:center; padding:60px; }
    .record-container { display:flex; flex-direction:column; gap:16px; }
    .patient-card { border-radius:12px !important; }
    .avatar { background:#0d47a1; color:white; display:flex; align-items:center; justify-content:center; font-weight:600; border-radius:50%; width:40px; height:40px; }
    .telecom-list { display:flex; flex-direction:column; gap:8px; margin-top:8px; }
    .telecom-item { display:flex; align-items:center; gap:8px; font-size:14px; color:#444; }
    .telecom-item mat-icon { font-size:18px; width:18px; height:18px; color:#888; }
    .prescription-panel { border-radius:12px !important; }
    .prescription-panel mat-panel-title { display:flex; align-items:center; gap:8px; }
    .full-width { width:100%; margin-bottom:12px; }
    .empty-state { text-align:center; padding:60px; color:#666; }
    .empty-icon { font-size:64px; width:64px; height:64px; color:#ccc; margin-bottom:16px; }
  `]
})
export class PatientRecordsComponent implements OnInit {
  record: any = null;
  fhirId = '';
  loading = true;
  rxLoading = false;

  rxForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private fb: FormBuilder,
    private snack: MatSnackBar
  ) {
    this.rxForm = this.fb.group({
      medication: ['', Validators.required],
      dosage:     ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fhirId = this.route.snapshot.paramMap.get('fhirId')!;
    this.api.get<any>(`records/${this.fhirId}`).subscribe({
      next: r => { this.record = r; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  addPrescription() {
    if (this.rxForm.invalid) return;
    this.rxLoading = true;
    const v = this.rxForm.value;
    this.api.post(`records/${this.fhirId}/prescriptions`, { medication: v.medication, dosage: v.dosage }).subscribe({
      next: () => {
        this.snack.open('Prescription saved to FHIR record', 'Close', { duration: 3000 });
        this.rxForm.reset(); this.rxLoading = false;
      },
      error: () => { this.snack.open('Failed to save prescription', 'Close', { duration: 3000 }); this.rxLoading = false; }
    });
  }

  getInitials(name: string) {
    return (name || '').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  }
}
