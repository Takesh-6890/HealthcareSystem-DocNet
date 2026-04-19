import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

export interface AuthResult { token: string; email: string; role: string; userId: string; }
export interface RegisterPayload { email: string; password: string; role: string; firstName: string; lastName: string; phone?: string; specialization?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<AuthResult>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => this.storeAuth(res)));
  }

  register(payload: RegisterPayload) {
    return this.http.post<AuthResult>(`${environment.apiUrl}/auth/register`, payload)
      .pipe(tap(res => this.storeAuth(res)));
  }

  logout() {
    localStorage.clear();
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  private storeAuth(res: AuthResult) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    localStorage.setItem('userId', res.userId);
    localStorage.setItem('email', res.email);
    this.loggedIn.next(true);
  }

  getToken()  { return localStorage.getItem('token'); }
  getRole()   { return localStorage.getItem('role') ?? ''; }
  getUserId() { return localStorage.getItem('userId') ?? ''; }
  getEmail()  { return localStorage.getItem('email') ?? ''; }

  isLoggedIn() { return !!this.getToken(); }
}
