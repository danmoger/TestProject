import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyfudgeComponent } from './surveyfudge.component';

describe('SurveyfudgeComponent', () => {
  let component: SurveyfudgeComponent;
  let fixture: ComponentFixture<SurveyfudgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyfudgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyfudgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
