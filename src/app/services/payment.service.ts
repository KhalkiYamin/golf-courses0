import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreatePaymentInput {
    title: string;
    coach: string;
    athleteFirstName?: string;
    athleteLastName?: string;
    athleteFullName?: string;
    athleteEmail?: string;
    customerName?: string;
    clientName?: string;
    amount: number;
    quantity: number;
    paymentMethod: string;
    paymentType: string;
    promoCode?: string;
    discount?: number;
    seanceId?: number;
    coachId?: number;
}

export interface PaymentRecord {
    id: number;
    title: string;
    coach: string;
    athleteName?: string;
    amount: number;
    quantity: number;
    paymentMethod: string;
    paymentType: string;
    promoCode?: string | null;
    discount: number;
    finalAmount: number;
    status: 'PAID' | 'PENDING_CASH' | 'FAILED';
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private apiUrl = 'http://localhost:8081/api/paiements';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');

        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    getPayments(): Observable<PaymentRecord[]> {
        return this.http.get<PaymentRecord[]>(this.apiUrl, {
            headers: this.getHeaders()
        });
    }

    getPaymentById(id: number): Observable<PaymentRecord> {
        return this.http.get<PaymentRecord>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    createPayment(input: CreatePaymentInput): Observable<PaymentRecord> {
        return this.http.post<PaymentRecord>(this.apiUrl, input, {
            headers: this.getHeaders()
        });
    }

    confirmCashPayment(id: number): Observable<PaymentRecord> {
        return this.http.put<PaymentRecord>(`${this.apiUrl}/${id}/confirm-cash`, {}, {
            headers: this.getHeaders()
        });
    }
}