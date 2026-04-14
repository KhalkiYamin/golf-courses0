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
    @Input() title = 'المساعد الرياضي';
    @Input() subtitle = 'اطرح أسئلتك حول حصصك، حجوزاتك، وتمارينك.';
    @Input() placeholder = 'اكتب رسالتك هنا...';

    @ViewChild('messagesBody') private messagesBody?: ElementRef<HTMLDivElement>;

    userMessage = '';
    loading = false;
    starterMode = true;

    quickActions: QuickAction[] = [
        { label: 'حجوزاتي', prompt: 'ما هي حجوزاتي؟' },
        { label: 'حصصي القادمة', prompt: 'ما هي حصصي القادمة؟' },
        { label: 'قائمة المدربين', prompt: 'أظهر لي قائمة المدربين' },
        { label: 'اقترح لي حصة', prompt: 'ما هي الحصة التي تنصحني بها؟' }
    ];

    messages: Message[] = [
        {
            sender: 'bot',
            text: 'مرحبًا، يمكنني مساعدتك في الحجوزات، الحصص القادمة، المدربين، واقتراح الحصص المناسبة لك.'
        }
    ];

    constructor(private chatbotService: ChatbotService) { }

    ngAfterViewInit(): void {
        this.scrollToBottom();
    }

    get activePlaceholder(): string {
        if (this.starterMode) {
            return 'ابدأ باختيار سريع أو اكتب سؤالك مباشرة...';
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
                    text: 'تعذر الاتصال بالخادم الآن. حاول مرة أخرى بعد قليل.'
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