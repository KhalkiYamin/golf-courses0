import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { ChatbotService } from '../../../services/chatbot.service';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

interface QuickAction {
    label: string;
    prompt: string;
}

@Component({
    selector: 'app-athlete-chatbot',
    templateUrl: './athlete-chatbot.component.html',
    styleUrls: ['./athlete-chatbot.component.css']
})
export class AthleteChatbotComponent implements AfterViewInit {
    @Input() variant: 'page' | 'widget' = 'page';
    @Input() title = 'Assistant Athlete';
    @Input() subtitle = 'Posez vos questions sur vos seances, reservations et entrainements.';
    @Input() placeholder = 'Ecrire votre message...';

    @ViewChild('messagesBody') private messagesBody?: ElementRef<HTMLDivElement>;

    userMessage = '';
    loading = false;
    starterMode = true;
    quickActions: QuickAction[] = [
        { label: 'My reservations', prompt: 'What reservations do I have?' },
        { label: 'My next sessions', prompt: 'What are my next sessions?' },
        { label: 'List of coaches', prompt: 'Show me the list of coaches' },
        { label: 'Recommend a session', prompt: 'Which session do you recommend for me?' }
    ];

    messages: Message[] = [
        {
            sender: 'bot',
            text: 'Hello. I can help you with your reservations, upcoming sessions, coaches, and personalized session recommendations.'
        }
    ];

    constructor(private chatbotService: ChatbotService) { }

    ngAfterViewInit(): void {
        this.scrollToBottom();
    }

    get activePlaceholder(): string {
        if (this.starterMode) {
            return 'Start with a quick action or type your own question...';
        }

        return this.placeholder;
    }

    sendMessage(): void {
        const message = this.userMessage.trim();

        if (!message || this.loading) {
            return;
        }

        this.starterMode = false;

        this.messages.push({ sender: 'user', text: message });
        this.userMessage = '';
        this.loading = true;
        this.scrollToBottom();

        this.chatbotService.sendMessage(message).subscribe({
            next: (response) => {
                this.messages.push({
                    sender: 'bot',
                    text: response.reply
                });
                this.loading = false;
                this.scrollToBottom();
            },
            error: () => {
                this.messages.push({
                    sender: 'bot',
                    text: 'I could not reach the server right now. Please try again in a moment.'
                });
                this.loading = false;
                this.scrollToBottom();
            }
        });
    }

    sendQuickAction(action: QuickAction): void {
        if (this.loading) {
            return;
        }

        this.starterMode = false;
        this.userMessage = action.prompt;
        this.sendMessage();
    }

    switchToFreeChat(): void {
        this.starterMode = false;
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            if (this.messagesBody) {
                this.messagesBody.nativeElement.scrollTop = this.messagesBody.nativeElement.scrollHeight;
            }
        });
    }
}