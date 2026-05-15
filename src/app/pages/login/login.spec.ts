import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { Login } from './login';
import { AuthService } from '../../core/service/auth.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  const authServiceMock = {
    login: vi.fn(),
    saveToken: vi.fn()
  };

  const routerMock = {
    navigate: vi.fn()
  };

  const activatedRouteMock = {
    snapshot: {
      queryParamMap: convertToParamMap({})
    }
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    activatedRouteMock.snapshot.queryParamMap = convertToParamMap({});

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set info message when session expired reason is present', () => {
    activatedRouteMock.snapshot.queryParamMap = convertToParamMap({
      reason: 'session_expired'
    });

    component.ngOnInit();

    expect(component.infoMessage()).toBe(
      'Votre session a expiré. Veuillez vous reconnecter.'
    );
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();

    expect(component.submitted()).toBe(true);
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should login, save token and navigate to returnUrl', () => {
    activatedRouteMock.snapshot.queryParamMap = convertToParamMap({
      returnUrl: '/history'
    });

    authServiceMock.login.mockReturnValue(of({ token: 'fake-token' }));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(authServiceMock.saveToken).toHaveBeenCalledWith('fake-token');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/history']);
  });

  it('should navigate to /upload when no returnUrl is provided', () => {
    authServiceMock.login.mockReturnValue(of({ token: 'fake-token' }));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/upload']);
  });

  it('should set 401 error message', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 401 }))
    );

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Email ou mot de passe incorrect');
  });

  it('should set status 0 error message', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 0 }))
    );

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Impossible de contacter le serveur.');
  });

  it('should set backend message for HttpErrorResponse', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 500,
          error: { message: 'Erreur API' }
        })
      )
    );

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Erreur API');
  });

  it('should set generic message for unknown HttpErrorResponse', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() =>
        new HttpErrorResponse({
          status: 500,
          error: {}
        })
      )
    );

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Erreur lors de la connexion.');
  });

  it('should set Error message for standard Error', () => {
    authServiceMock.login.mockReturnValue(
      throwError(() => new Error('Erreur custom'))
    );

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Erreur custom');
  });

  it('should set generic error message for unknown error', () => {
    authServiceMock.login.mockReturnValue(throwError(() => 'unexpected'));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Erreur lors de la connexion.');
  });
});