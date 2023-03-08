import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldObjectComponent } from './world-object.component';

describe('WorldObjectComponent', () => {
  let component: WorldObjectComponent;
  let fixture: ComponentFixture<WorldObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldObjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorldObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
