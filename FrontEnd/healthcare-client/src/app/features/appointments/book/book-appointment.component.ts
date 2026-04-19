import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentService, TimeSlot } from '../../../core/services/appointment.service';
import { DoctorService, Doctor } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule,
            MatButtonModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
            MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <div class="page">
      <div class="page-header">
        <button mat-icon-button (click)="router.navigate(['/patient/appointments'])">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Book Appointment</h1>
      </div>

      <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">

            <h3 class="section-title">Select Doctor</h3>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Choose a doctor</mat-label>
              <mat-select formControlName="doctorId" (selectionChange)="onDoctorChange()">
                <mat-option *ngFor="let d of doctors" [value]="d.id">
                  {{ d.fullName }} — {{ d.specialization }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <h3 class="section-title">Select Date & Time</h3>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Appointment Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date"
                     [min]="minDate" (dateChange)="onDateChange()">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <div *ngIf="loadingSlots" class="slots-loading">
              <mat-spinner diameter="24"></mat-spinner>
              <span>Loading available slots...</span>
            </div>

            <div *ngIf="slots.length > 0 && !loadingSlots" class="slots-grid">
              <button type="button" *ngFor="let slot of slots"
                      [class]="'slot-btn ' + (slot.available ? '' : 'unavailable') + (form.get('slotStart')?.value === slot.start ? ' selected' : '')"
                      [disabled]="!slot.available"
                      (click)="selectSlot(slot)">
                {{ slot.start | date:'h:mm a' }}
              </button>
            </div>

            <p *ngIf="slots.length === 0 && form.get('date')?.value && !loadingSlots" class="no-slots">
              No available slots on this date. Try another day.
            </p>

            <h3 class="section-title">Reason for Visit</h3>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Describe your symptoms or reason</mat-label>
              <textarea matInput formControlName="reason" rows="4"></textarea>
              <mat-hint align="end">{{ form.get('reason')?.value?.length || 0 }}/500</mat-hint>
            </mat-form-field>

            <p class="error-msg" *ngIf="error">{{ error }}</p>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="form.invalid || submitting" class="submit-btn">
              <mat-spinner diameter="20" *ngIf="submitting"></mat-spinner>
              <span *ngIf="!submitting">
                <mat-icon>check_circle</mat-icon> Confirm Booking
              </span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page { max-width:600px; margin:0 auto; }
    .page-header { display:flex; align-items:center; gap:8px; margin-bottom:24px; }
    .page-header h1 { margin:0; font-size:24px; font-weight:500; }
    .form-card { border-radius:12px !important; }
    .full-width { width:100%; margin-bottom:16px; }
    .section-title { font-size:14px; font-weight:600; color:#555; text-transform:uppercase; letter-spacing:0.05em; margin:16px 0 8px; }
    .slots-loading { display:flex; align-items:center; gap:12px; padding:16px 0; color:#666; }
    .slots-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:20px; }
    .slot-btn { padding:8px 4px; border:1px solid #1976d2; background:white; color:#1976d2; border-radius:6px; cursor:pointer; font-size:13px; transition:all 0.15s; }
    .slot-btn:hover:not(.unavailable) { background:#e3f2fd; }
    .slot-btn.selected { background:#1976d2; color:white; }
    .slot-btn.unavailable { border-color:#ccc; color:#ccc; cursor:not-allowed; text-decoration:line-through; }
    .no-slots { color:#888; font-size:14px; text-align:center; padding:16px; }
    .error-msg { color:#f44336; font-size:13px; margin:8px 0; }
    .submit-btn { width:100%; height:48px; margin-top:8px; display:flex; align-items:center; justify-content:center; gap:8px; font-size:16px; }
    .submit-btn mat-icon { margin-right:4px; }
  `]
})
export class BookAppointmentComponent implements OnInit {
  form!: FormGroup;

  doctors: Doctor[] = [];
  slots: TimeSlot[] = [];
  minDate = new Date();
  loadingSlots = false;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private apptSvc: AppointmentService,
    private doctorSvc: DoctorService,
    private auth: AuthService,
    private snack: MatSnackBar,
    public router: Router
  ) {
    this.form = this.fb.group({
      doctorId:  ['', Validators.required],
      date:      ['', Validators.required],
      slotStart: ['', Validators.required],
      reason:    ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    this.doctorSvc.getAll().subscribe(docs => this.doctors = docs);
  }

  onDoctorChange() {
    this.slots = [];
    this.form.patchValue({ slotStart: '' });
    if (this.form.get('date')?.value) this.loadSlots();
  }

  onDateChange() {
    this.slots = [];
    this.form.patchValue({ slotStart: '' });
    if (this.form.get('doctorId')?.value) this.loadSlots();
  }

  loadSlots() {
    const doctorId = this.form.get('doctorId')?.value;
    const date = this.form.get('date')?.value;
    if (!doctorId || !date) return;
    const iso = new Date(date as string).toISOString().split('T')[0];
    this.loadingSlots = true;
    this.apptSvc.getAvailability(doctorId, iso).subscribe({
      next: s => { this.slots = s; this.loadingSlots = false; },
      error: () => { this.loadingSlots = false; }
    });
  }

  selectSlot(slot: TimeSlot) {
    if (!slot.available) return;
    this.form.patchValue({ slotStart: slot.start });
  }

  submit() {
    if (this.form.invalid) return;
    this.submitting = true; this.error = '';
    const v = this.form.value;
    this.apptSvc.book({
      patientId: this.auth.getUserId(),
      doctorId: v.doctorId!,
      slotStart: v.slotStart!,
      reason: v.reason!
    }).subscribe({
      next: () => {
        this.snack.open('Appointment booked! Confirmation email sent.', 'Close', { duration: 4000 });
        this.router.navigate(['/patient/appointments']);
      },
      error: err => { this.error = err.error?.message || 'Booking failed.'; this.submitting = false; }
    });
  }
}
