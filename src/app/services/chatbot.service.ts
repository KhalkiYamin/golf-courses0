import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatResponse {
    reply: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatbotService {
    private apiUrl = 'http://localhost:8081/api/chatbot/athlete';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        let headers = new HttpHeaders();

        if (token) {
            headers = headers.set('Authorization', 'Bearer ' + token);
        }

        return headers;
    }

    sendMessage(message: string): Observable<ChatResponse> {
        return this.http.post<ChatResponse>(this.apiUrl, { message }, { headers: this.getHeaders() });
    }
}