import { TestBed } from '@angular/core/testing';

import { DirectoratesService } from './directorates.service';

describe('DirectoratesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DirectoratesService = TestBed.get(DirectoratesService);
    expect(service).toBeTruthy();
  });
});
