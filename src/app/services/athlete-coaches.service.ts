import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AthleteCoachesService {
    private readonly endpoints = [
        'http://localhost:8081/api/athlete/coaches',
        'http://localhost:8081/api/athlete/dashboard/coaches',
        'http://localhost:8081/api/coach/profile/all',
        'http://localhost:8081/api/coaches/approved'
    ];

    constructor(private http: HttpClient) { }

    getAvailableCoaches(): Observable<any[]> {
        return this.tryEndpoints(0);
    }

    private tryEndpoints(index: number): Observable<any[]> {
        if (index >= this.endpoints.length) {
            return of([]);
        }

        const url = this.endpoints[index];

        return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
            map((response) => this.extractArray(response)),
            catchError(() => this.tryEndpoints(index + 1))
        );
    }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();

        if (token) {
            headers = headers.set('Authorization', 'Bearer ' + token);
        }

        return headers;
    }

    private extractArray(response: any): any[] {
        if (Array.isArray(response)) {
            return response;
        }

        const keys = ['content', 'data', 'results', 'items', 'coaches', 'users'];
        for (const key of keys) {
            if (Array.isArray(response?.[key])) {
                return response[key];
            }
        }

        return [];
    }
}