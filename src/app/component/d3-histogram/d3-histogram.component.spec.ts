import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3Histogram } from './d3-histogram.component';

describe('D3Component', () => {
  let component: D3Histogram;
  let fixture: ComponentFixture<D3Histogram>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3Histogram ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3Histogram);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
