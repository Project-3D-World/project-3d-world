import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationdivComponent } from './notificationdiv.component';

describe('NotificationdivComponent', () => {
  let component: NotificationdivComponent;
  let fixture: ComponentFixture<NotificationdivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationdivComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationdivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
