import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface Doctor { id: string; fullName: string; specialization: string; bio?: string; }

@Injectable({ providedIn: 'root' })
export class DoctorService {
  constructor(private api: ApiService) {}

  getAll() { return this.api.get<Doctor[]>('doctors'); }
  getById(id: string) { return this.api.get<Doctor>(`doctors/${id}`); }
}
