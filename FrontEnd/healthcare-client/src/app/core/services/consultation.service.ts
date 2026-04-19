import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  constructor(private api: ApiService) {}

  getVideoToken(appointmentId: string) {
    return this.api.get<{ roomUrl: string }>(`consultations/${appointmentId}/token`);
  }
}
