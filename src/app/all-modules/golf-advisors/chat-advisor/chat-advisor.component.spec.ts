import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAdvisorComponent } from './chat-advisor.component';

describe('ChatAdvisorComponent', () => {
  let component: ChatAdvisorComponent;
  let fixture: ComponentFixture<ChatAdvisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatAdvisorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
