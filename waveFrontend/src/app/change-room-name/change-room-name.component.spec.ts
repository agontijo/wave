import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRoomNameComponent } from './change-room-name.component';

describe('ChangeRoomNameComponent', () => {
  let component: ChangeRoomNameComponent;
  let fixture: ComponentFixture<ChangeRoomNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRoomNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRoomNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
