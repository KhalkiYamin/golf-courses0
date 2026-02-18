import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GolferDashboardComponent } from './golfer-dashboard.component';

describe('GolferDashboardComponent', () => {
  let component: GolferDashboardComponent;
  let fixture: ComponentFixture<GolferDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GolferDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GolferDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
