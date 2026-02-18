import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGolfersComponent } from './my-golfers.component';

describe('MyGolfersComponent', () => {
  let component: MyGolfersComponent;
  let fixture: ComponentFixture<MyGolfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyGolfersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGolfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
