import { TestBed } from '@angular/core/testing';

import { ConfigstateService } from './configstate.service';

describe('ConfigstateService', () => {
  let service: ConfigstateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigstateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
