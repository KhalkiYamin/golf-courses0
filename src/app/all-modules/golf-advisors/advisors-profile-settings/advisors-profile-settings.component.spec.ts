import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorsProfileSettingsComponent } from './advisors-profile-settings.component';

describe('AdvisorsProfileSettingsComponent', () => {
  let component: AdvisorsProfileSettingsComponent;
  let fixture: ComponentFixture<AdvisorsProfileSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvisorsProfileSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorsProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
