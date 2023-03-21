import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldsComponent } from './worlds.component';

describe('WorldsComponent', () => {
  let component: WorldsComponent;
  let fixture: ComponentFixture<WorldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
