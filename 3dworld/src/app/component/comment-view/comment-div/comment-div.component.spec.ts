import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentDivComponent } from './comment-div.component';

describe('CommentDivComponent', () => {
  let component: CommentDivComponent;
  let fixture: ComponentFixture<CommentDivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentDivComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
