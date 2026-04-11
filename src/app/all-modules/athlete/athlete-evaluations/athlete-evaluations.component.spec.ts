import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AthleteEvaluationsComponent } from './athlete-evaluations.component';

describe('AthleteEvaluationsComponent', () => {
    let component: AthleteEvaluationsComponent;
    let fixture: ComponentFixture<AthleteEvaluationsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AthleteEvaluationsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AthleteEvaluationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
