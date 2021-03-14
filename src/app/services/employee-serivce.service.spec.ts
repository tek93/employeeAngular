import { TestBed } from '@angular/core/testing';

import { EmployeeSerivceService } from './employee-serivce.service';

describe('EmployeeSerivceService', () => {
  let service: EmployeeSerivceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeSerivceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
