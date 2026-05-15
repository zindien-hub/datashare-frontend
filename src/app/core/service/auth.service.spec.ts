import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should send register request', () => {
    const payload = {
      email: 'test@datashare.com',
      password: 'password123'
    };

    service.register(payload).subscribe();

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({ message: 'User registered successfully' });
  });

  it('should send login request', () => {
    const payload = {
      email: 'test@datashare.com',
      password: 'password123'
    };

    service.login(payload).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({ token: 'fake-jwt-token' });
  });

  it('should save and retrieve token', () => {
    service.saveToken('fake-jwt-token');

    expect(service.getToken()).toBe('fake-jwt-token');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should remove token on logout', () => {
    service.saveToken('fake-jwt-token');

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });
});