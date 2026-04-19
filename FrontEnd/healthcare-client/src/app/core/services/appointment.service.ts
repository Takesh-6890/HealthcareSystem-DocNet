import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface TimeSlot { start: string; end: string; available: boolean; }
export interface Appointment {
  id: string; patientName: string; doctorName: string; specialization: string;
  slotStart: string; slotEnd: string; reason: string; status: string; videoRoomUrl?: string;
}
export interface BookPayload { patientId: string; doctorId: string; slotStart: string; reason: string; }

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  constructor(private api: ApiService) {}

  getAvailability(doctorId: string, date: string) {
    return this.api.get<TimeSlot[]>('appointments/availability', { doctorId, date });
  }

  getMyAppointments(entityId: string, role: string) {
    return this.api.get<Appointment[]>('appointments/my', { entityId, role });
  }

  book(payload: BookPayload) {
    return this.api.post<{ id: string }>('appointments', payload);
  }

  cancel(id: string) {
    return this.api.delete<boolean>(`appointments/${id}`);
  }
}
