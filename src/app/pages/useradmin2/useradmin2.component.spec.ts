import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Useradmin2Component } from './useradmin2.component';

describe('Useradmin2Component', () => {
  let component: Useradmin2Component;
  let fixture: ComponentFixture<Useradmin2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Useradmin2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Useradmin2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
