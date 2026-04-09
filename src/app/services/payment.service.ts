import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreatePaymentInput {
    title: string;
    coach: string;
    amount: number;
    quantity: number;
    paymentMethod: string;
    paymentType: string;
    promoCode?: string;
    discount?: number;
}

export interface PaymentRecord {
    id: number;
    title: string;
    coach: string;
    amount: number;
    quantity: number;
    paymentMethod: string;
    paymentType: string;
    promoCode?: string;
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

    getPayments(): Observable<PaymentRecord[]> {
        return this.http.get<PaymentRecord[]>(this.apiUrl);
    }

    getPaymentById(id: number): Observable<PaymentRecord> {
        return this.http.get<PaymentRecord>(`${this.apiUrl}/${id}`);
    }

    createPayment(input: CreatePaymentInput): Observable<PaymentRecord> {
        return this.http.post<PaymentRecord>(this.apiUrl, input);
    }
}