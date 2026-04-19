import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientShell } from './patient-shell';

describe('PatientShell', () => {
  let component: PatientShell;
  let fixture: ComponentFixture<PatientShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientShell],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
