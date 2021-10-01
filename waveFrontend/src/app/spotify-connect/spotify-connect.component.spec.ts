import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyConnectComponent } from './spotify-connect.component';

describe('SpotifyConnectComponent', () => {
  let component: SpotifyConnectComponent;
  let fixture: ComponentFixture<SpotifyConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpotifyConnectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
