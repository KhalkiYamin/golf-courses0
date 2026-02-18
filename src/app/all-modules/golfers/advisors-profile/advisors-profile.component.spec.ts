import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorsProfileComponent } from './advisors-profile.component';

describe('AdvisorsProfileComponent', () => {
  let component: AdvisorsProfileComponent;
  let fixture: ComponentFixture<AdvisorsProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisorsProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
