import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'patient',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/patient-shell/patient-shell.component').then(m => m.PatientShellComponent),
    children: [
      { path: '', redirectTo: 'appointments', pathMatch: 'full' },
      { path: 'appointments', loadComponent: () => import('./features/appointments/list/appointment-list.component').then(m => m.AppointmentListComponent) },
      { path: 'book',         loadComponent: () => import('./features/appointments/book/book-appointment.component').then(m => m.BookAppointmentComponent) },
      { path: 'consult/:id',  loadComponent: () => import('./features/consultations/video-room/video-room.component').then(m => m.VideoRoomComponent) },
    ]
  },
  {
    path: 'doctor',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/doctor-shell/doctor-shell.component').then(m => m.DoctorShellComponent),
    children: [
      { path: '', redirectTo: 'appointments', pathMatch: 'full' },
      { path: 'appointments', loadComponent: () => import('./features/appointments/list/appointment-list.component').then(m => m.AppointmentListComponent) },
      { path: 'records/:fhirId', loadComponent: () => import('./features/records/patient-records/patient-records.component').then(m => m.PatientRecordsComponent) },
      { path: 'consult/:id',     loadComponent: () => import('./features/consultations/video-room/video-room.component').then(m => m.VideoRoomComponent) },
    ]
  },
  { path: '**', redirectTo: '/login' }
];
