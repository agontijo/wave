import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorebuttonsComponent } from './storebuttons.component';

describe('StorebuttonsComponent', () => {
  let component: StorebuttonsComponent;
  let fixture: ComponentFixture<StorebuttonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorebuttonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorebuttonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
