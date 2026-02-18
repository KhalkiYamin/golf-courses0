import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GolfAdvisorsComponent } from './golf-advisors.component';

describe('GolfAdvisorsComponent', () => {
  let component: GolfAdvisorsComponent;
  let fixture: ComponentFixture<GolfAdvisorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GolfAdvisorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GolfAdvisorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
