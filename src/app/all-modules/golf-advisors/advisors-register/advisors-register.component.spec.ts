import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorsRegisterComponent } from './advisors-register.component';

describe('AdvisorsRegisterComponent', () => {
  let component: AdvisorsRegisterComponent;
  let fixture: ComponentFixture<AdvisorsRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisorsRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
