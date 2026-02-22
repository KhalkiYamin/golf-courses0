import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl = 'http://localhost:8081/api';

    constructor(private http: HttpClient) { }

    register(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/auth/register`, data);
    }

    login(loginRequest: { email: string; password: string }): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/auth/login`, loginRequest)
            .pipe(
                tap(res => {
                    const token = res.token || res.accessToken;
                    if (token) localStorage.setItem('token', token);
                    if (res.role) localStorage.setItem('role', res.role);
                })
            );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getRole(): string | null {
        return localStorage.getItem('role');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}