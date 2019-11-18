import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramFormComponent } from './histogram-form.component';

describe('HistogramFormComponent', () => {
  let component: HistogramFormComponent;
  let fixture: ComponentFixture<HistogramFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistogramFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
