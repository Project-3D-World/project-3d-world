import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< HEAD:3dworld/src/app/component/vote/vote.component.spec.ts
      declarations: [VoteComponent],
    }).compileComponents();
=======
      declarations: [ NotificationComponent ]
    })
    .compileComponents();
>>>>>>> 4dec677 (minor changes to UI + create notification):3dworld/src/app/component/notification/notification.component.spec.ts

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
