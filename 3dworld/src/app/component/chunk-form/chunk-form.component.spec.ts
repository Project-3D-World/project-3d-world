import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChunkFormComponent } from './chunk-form.component';

describe('ChunkFormComponent', () => {
  let component: ChunkFormComponent;
  let fixture: ComponentFixture<ChunkFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChunkFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChunkFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
