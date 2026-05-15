import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { Register } from './register';
import { AuthService } from '../../core/service/auth.service';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  const authServiceMock = {
    register: vi.fn()
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
      imports: [Register],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as submitted', () => {
    component.onSubmit();

    expect(component.submitted()).toBe(true);
  });

  it('should clear error and success messages before submit', () => {
    component.errorMessage.set('ancienne erreur');
    component.successMessage.set('ancien succès');

    component.onSubmit();

    expect(component.errorMessage()).toBe('');
    expect(component.successMessage()).toBe('');
  });

  it('should not call authService.register when form is invalid', () => {
    component.registerForm.setValue({
      email: '',
      password: ''
    });

    component.onSubmit();

    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('should call authService.register with email and password when form is valid', () => {
    authServiceMock.register.mockReturnValue(
      of({ message: 'Compte créé avec succès.' })
    );

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('should show success message from response on successful register', () => {
    authServiceMock.register.mockReturnValue(
      of({ message: 'Compte créé avec succès.' })
    );

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.successMessage()).toBe('Compte créé avec succès.');
  });

  it('should show default success message when response message is missing', () => {
    authServiceMock.register.mockReturnValue(of({}));

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.successMessage()).toBe('Compte créé avec succès.');
  });

  it('should navigate to /login on successful register', () => {
    authServiceMock.register.mockReturnValue(
      of({ message: 'Compte créé avec succès.' })
    );

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show backend error message when register fails', () => {
    authServiceMock.register.mockReturnValue(
      throwError(() => ({
        error: { message: 'Email déjà utilisé.' }
      }))
    );

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe('Email déjà utilisé.');
  });

  it('should show default error message when backend message is missing', () => {
    authServiceMock.register.mockReturnValue(
      throwError(() => ({}))
    );

    component.registerForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.errorMessage()).toBe(
      'Erreur lors de la création du compte.'
    );
  });
});