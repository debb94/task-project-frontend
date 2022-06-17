import { TestBed } from '@angular/core/testing';

import { HandleAppService } from './handle-app.service';

describe('HandleAppService', () => {
  let service: HandleAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
