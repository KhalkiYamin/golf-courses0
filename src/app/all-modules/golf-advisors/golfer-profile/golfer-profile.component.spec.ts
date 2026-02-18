import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GolferProfileComponent } from './golfer-profile.component';

describe('GolferProfileComponent', () => {
  let component: GolferProfileComponent;
  let fixture: ComponentFixture<GolferProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GolferProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GolferProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
