import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorsChangePasswordComponent } from './advisors-change-password.component';

describe('AdvisorsChangePasswordComponent', () => {
  let component: AdvisorsChangePasswordComponent;
  let fixture: ComponentFixture<AdvisorsChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisorsChangePasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorsChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
