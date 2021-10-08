import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayRoomComponent } from './display-room.component';

describe('DisplayRoomComponent', () => {
  let component: DisplayRoomComponent;
  let fixture: ComponentFixture<DisplayRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
