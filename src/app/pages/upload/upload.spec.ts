import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { Upload } from './upload';
import { FileService } from '../../core/service/file.service';
import { AuthService } from '../../core/service/auth.service';

describe('Upload', () => {
  let component: Upload;
  let fixture: ComponentFixture<Upload>;

  const fileServiceMock = {
    upload: vi.fn()
  };

  const authServiceMock = {
    logout: vi.fn()
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
      imports: [Upload],
      providers: [
        { provide: FileService, useValue: fileServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Upload);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selected file on file input change', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const event = {
      target: {
        files: [file]
      }
    } as unknown as Event;

    component.onFileSelected(event);

    expect(component.selectedFile()).toBe(file);
    expect(component.errorMessage()).toBe('');
    expect(component.successMessage()).toBe('');
  });

  it('should set selected file to null when no file is chosen', () => {
    const event = {
      target: {
        files: []
      }
    } as unknown as Event;

    component.onFileSelected(event);

    expect(component.selectedFile()).toBeNull();
  });

  it('should not submit when no file is selected', () => {
    component.onSubmit();

    expect(fileServiceMock.upload).not.toHaveBeenCalled();
    expect(component.errorMessage()).toBe('Veuillez sélectionner un fichier.');
  });

  it('should upload file successfully', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    const response = {
      id: 1,
      originalName: 'test.txt',
      downloadToken: 'token',
      downloadUrl: '/files/test',
      expiresAt: '2026-05-15T20:00:00Z'
    };
    const input = document.createElement('input');

    component.selectedFile.set(file);
    fileServiceMock.upload.mockReturnValue(of(response));

    component.onSubmit(input);

    expect(fileServiceMock.upload).toHaveBeenCalledWith(file);
    expect(component.uploadResponse()).toEqual(response);
    expect(component.successMessage()).toBe('Fichier uploadé avec succès.');
    expect(component.selectedFile()).toBeNull();
    expect(input.value).toBe('');
    expect(component.isSubmitting()).toBe(false);
  });

  it('should set error message when upload fails', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    component.selectedFile.set(file);
    fileServiceMock.upload.mockReturnValue(
      throwError(() => ({
        error: { message: 'Upload refusé' }
      }))
    );

    component.onSubmit();

    expect(component.errorMessage()).toBe('Upload refusé');
    expect(component.isSubmitting()).toBe(false);
  });

  it('should use fallback error message when upload fails without backend message', () => {
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    component.selectedFile.set(file);
    fileServiceMock.upload.mockReturnValue(
      throwError(() => ({}))
    );

    component.onSubmit();

    expect(component.errorMessage()).toBe('Erreur lors de l’upload du fichier.');
    expect(component.isSubmitting()).toBe(false);
  });

  it('should logout and navigate to login', () => {
    component.onLogout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});