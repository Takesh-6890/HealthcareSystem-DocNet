import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorShell } from './doctor-shell';

describe('DoctorShell', () => {
  let component: DoctorShell;
  let fixture: ComponentFixture<DoctorShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorShell],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
