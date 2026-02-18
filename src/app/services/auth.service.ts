import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl = 'http://localhost:8081/api/auth'; // نفس بورت Spring

    constructor(private http: HttpClient) { }

    register(data: any) {
        return this.http.post<{ token: string }>(`${this.baseUrl}/register`, data);
    }

    login(email: string, password: string) {
        return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { email, password })
            .pipe(
                tap(res => {
                    // حسب AuthResponse متاعك: token ولا accessToken؟
                    const token = (res as any).token || (res as any).accessToken;
                    if (token) localStorage.setItem('token', token);
                })
            );
    }

    logout() { localStorage.removeItem('token'); }
    getToken() { return localStorage.getItem('token'); }
    isLoggedIn() { return !!this.getToken(); }
}