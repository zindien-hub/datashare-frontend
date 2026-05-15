import { TestBed } from '@angular/core/testing';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom, of, throwError } from 'rxjs';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../service/auth.service';

describe('authInterceptor', () => {
  let authServiceMock: {
    getToken: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };

  let routerMock: {
    url: string;
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authServiceMock = {
      getToken: vi.fn(),
      logout: vi.fn()
    };

    routerMock = {
      url: '/history',
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should add Authorization header when token exists', async () => {
    authServiceMock.getToken.mockReturnValue('fake-token');

    let capturedRequest: HttpRequest<unknown> | undefined;

    const req = new HttpRequest('POST', '/api/files', null);

    const next: HttpHandlerFn = (request) => {
      capturedRequest = request;
      return of(new HttpResponse({ status: 200, body: null }));
    };

    await firstValueFrom(
      TestBed.runInInjectionContext(() => authInterceptor(req, next))
    );

    expect(capturedRequest?.headers.get('Authorization')).toBe(
      'Bearer fake-token'
    );
  });

  it('should not modify request when token does not exist', async () => {
    authServiceMock.getToken.mockReturnValue(null);

    let capturedRequest: HttpRequest<unknown> | undefined;

    const req = new HttpRequest('GET', '/api/files');

    const next: HttpHandlerFn = (request) => {
      capturedRequest = request;
      return of(new HttpResponse({ status: 200, body: null }));
    };

    await firstValueFrom(
      TestBed.runInInjectionContext(() => authInterceptor(req, next))
    );

    expect(capturedRequest?.headers.has('Authorization')).toBe(false);
  });

  it('should logout and redirect to /login on 401 outside auth routes', async () => {
    authServiceMock.getToken.mockReturnValue('fake-token');
    routerMock.url = '/history';

    const req = new HttpRequest('GET', '/api/files');

    const next: HttpHandlerFn = () =>
      throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            url: '/api/files'
          })
      );

    await expect(
      firstValueFrom(
        TestBed.runInInjectionContext(() => authInterceptor(req, next))
      )
    ).rejects.toMatchObject({ status: 401 });

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: {
        returnUrl: '/history',
        reason: 'session_expired'
      }
    });
  });

  it('should not redirect on 401 from /api/auth/login', async () => {
    authServiceMock.getToken.mockReturnValue(null);
    routerMock.url = '/login';

    const req = new HttpRequest('POST', '/api/auth/login', {
      email: 'test@test.com',
      password: 'password'
    });

    const next: HttpHandlerFn = () =>
      throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            url: '/api/auth/login'
          })
      );

    await expect(
      firstValueFrom(
        TestBed.runInInjectionContext(() => authInterceptor(req, next))
      )
    ).rejects.toMatchObject({ status: 401 });

    expect(authServiceMock.logout).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});