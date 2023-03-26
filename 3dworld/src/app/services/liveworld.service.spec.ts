import { TestBed } from '@angular/core/testing';

import { LiveWorldService } from './liveworld.service';

describe('LiveworldService', () => {
  let service: LiveWorldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveWorldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
