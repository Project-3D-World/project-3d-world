import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorlddivComponent } from './worlddiv.component';

describe('WorlddivComponent', () => {
  let component: WorlddivComponent;
  let fixture: ComponentFixture<WorlddivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorlddivComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorlddivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
