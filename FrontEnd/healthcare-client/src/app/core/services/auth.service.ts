import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

export interface AuthResult { token: string; email: string; role: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<AuthResult>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => { localStorage.setItem('token', res.token); this.loggedIn.next(true); }));
  }

  register(payload: any) {
    return this.http.post<AuthResult>(`${environment.apiUrl}/auth/register`, payload)
      .pipe(tap(res => { localStorage.setItem('token', res.token); this.loggedIn.next(true); }));
  }

  logout() { localStorage.removeItem('token'); this.loggedIn.next(false); }

  getToken() { return localStorage.getItem('token'); }

  getRole(): string {
    const token = this.getToken();
    if (!token) return '';
    const decoded: any = jwtDecode(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
  }
}
