import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { History } from './history';
import { FileService } from '../../core/service/file.service';
import { AuthService } from '../../core/service/auth.service';
import { environment } from '../../../environments/environment';

describe('History', () => {
  let component: History;
  let fixture: ComponentFixture<History>;

  const fileServiceMock = {
    getMyFiles: vi.fn(),
    deleteFile: vi.fn(),
    deleteFiles: vi.fn()
  };

  const authServiceMock = {
    logout: vi.fn()
  };

  const routerMock = {
    navigate: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [History],
      providers: [
        { provide: FileService, useValue: fileServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(History);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load files on init', () => {
    const files = [
      {
        id: 1,
        originalName: 'test.pdf',
        contentType: 'application/pdf',
        size: 1024,
        downloadToken: 'token-123',
        downloadUrl: '/files/token-123',
        expiresAt: '2026-05-16T10:00:00Z',
        createdAt: '2026-05-15T10:00:00Z'
      }
    ];

    fileServiceMock.getMyFiles.mockReturnValue(of(files));

    fixture.detectChanges();

    expect(fileServiceMock.getMyFiles).toHaveBeenCalled();
    expect(component.files()).toEqual(files);
    expect(component.isLoading()).toBe(false);
  });

  it('should set empty array when response is not an array', () => {
    fileServiceMock.getMyFiles.mockReturnValue(of({}));

    component.loadFiles();

    expect(component.files()).toEqual([]);
    expect(component.isLoading()).toBe(false);
  });

  it('should set error message when loadFiles fails', () => {
    fileServiceMock.getMyFiles.mockReturnValue(
      throwError(() => ({
        error: { message: 'Erreur backend' }
      }))
    );

    component.loadFiles();

    expect(component.errorMessage()).toBe('Erreur backend');
    expect(component.isLoading()).toBe(false);
  });

  it('should use fallback error message when loadFiles fails without backend message', () => {
    fileServiceMock.getMyFiles.mockReturnValue(throwError(() => ({})));

    component.loadFiles();

    expect(component.errorMessage()).toBe(
      'Erreur lors du chargement de l’historique.'
    );
    expect(component.isLoading()).toBe(false);
  });

  it('should delete file and reload list', () => {
    fileServiceMock.deleteFile.mockReturnValue(of(void 0));
    fileServiceMock.getMyFiles.mockReturnValue(of([]));
    const loadFilesSpy = vi.spyOn(component, 'loadFiles');

    component.deleteFile(1);

    expect(fileServiceMock.deleteFile).toHaveBeenCalledWith(1);
    expect(component.successMessage()).toBe('Fichier supprimé avec succès.');
    expect(loadFilesSpy).toHaveBeenCalled();
  });

  it('should manage file selection', () => {
    expect(component.isFileSelected(1)).toBe(false);

    component.toggleFileSelection(1);

    expect(component.isFileSelected(1)).toBe(true);

    component.toggleFileSelection(1);

    expect(component.isFileSelected(1)).toBe(false);
  });

  it('should select and deselect all files', () => {
    component.files.set([
      { id: 1, originalName: 'a.txt', contentType: 'text/plain', size: 1, downloadToken: 'a', downloadUrl: '/a', expiresAt: '2026-05-16T10:00:00Z', createdAt: '2026-05-15T10:00:00Z' },
      { id: 2, originalName: 'b.txt', contentType: 'text/plain', size: 1, downloadToken: 'b', downloadUrl: '/b', expiresAt: '2026-05-16T10:00:00Z', createdAt: '2026-05-15T10:00:00Z' }
    ] as any);

    component.toggleAllFiles({ target: { checked: true } } as unknown as Event);

    expect(component.areAllFilesSelected()).toBe(true);
    expect(component.selectedFileIds().size).toBe(2);

    component.toggleAllFiles({ target: { checked: false } } as unknown as Event);

    expect(component.hasSelectedFiles()).toBe(false);
    expect(component.selectedFileIds().size).toBe(0);
  });

  it('should delete selected files and reload list', () => {
    fileServiceMock.deleteFiles.mockReturnValue(of(void 0));
    fileServiceMock.getMyFiles.mockReturnValue(of([]));
    const loadFilesSpy = vi.spyOn(component, 'loadFiles');

    component.selectedFileIds.set(new Set([1, 2]));

    component.deleteSelectedFiles();

    expect(fileServiceMock.deleteFiles).toHaveBeenCalledWith([1, 2]);
    expect(component.successMessage()).toBe('Fichiers supprimés avec succès.');
    expect(component.selectedFileIds().size).toBe(0);
    expect(loadFilesSpy).toHaveBeenCalled();
  });

  it('should not call deleteFiles when nothing is selected', () => {
    component.deleteSelectedFiles();

    expect(fileServiceMock.deleteFiles).not.toHaveBeenCalled();
  });

  it('should set error message when deleteFile fails', () => {
    fileServiceMock.deleteFile.mockReturnValue(
      throwError(() => ({
        error: { message: 'Suppression impossible' }
      }))
    );

    component.deleteFile(1);

    expect(component.errorMessage()).toBe('Suppression impossible');
  });

  it('should use fallback error message when deleteFile fails without backend message', () => {
    fileServiceMock.deleteFile.mockReturnValue(throwError(() => ({})));

    component.deleteFile(1);

    expect(component.errorMessage()).toBe(
      'Erreur lors de la suppression du fichier.'
    );
  });

  it('should build download link', () => {
    const result = component.buildDownloadLink('/files/1/download');

    expect(result).toBe(`${environment.backendBaseUrl}/files/1/download`);
  });

  it('should navigate to upload page', () => {
    component.goToUpload();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/upload']);
  });

  it('should logout and navigate to login', () => {
    component.onLogout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error if clipboard API is unavailable', () => {
    const originalClipboard = navigator.clipboard;

    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true
    });

    component.copyLinkToClipboard('/files/test');

    expect(component.errorMessage()).toBe(
      'Copie non supportée sur ce navigateur.'
    );
    expect(component.successMessage()).toBe('');

    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true
    });
  });

  it('should copy link to clipboard successfully', async () => {
    vi.useFakeTimers();

    const writeText = vi.fn().mockResolvedValue(undefined);
    const originalClipboard = navigator.clipboard;

    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true
    });

    component.copyLinkToClipboard('/files/test');
    await Promise.resolve();

    expect(writeText).toHaveBeenCalledWith(
      `${environment.backendBaseUrl}/files/test`
    );
    expect(component.successMessage()).toBe('Lien copié avec succès!');
    expect(component.errorMessage()).toBe('');

    vi.advanceTimersByTime(3000);

    expect(component.successMessage()).toBe('');

    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true
    });

    vi.useRealTimers();
  });

  it('should set error when clipboard copy fails', async () => {
    vi.useFakeTimers();

    const writeText = vi.fn().mockRejectedValue(new Error('copy failed'));
    const originalClipboard = navigator.clipboard;

    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true
    });

    component.copyLinkToClipboard('/files/test');
    await Promise.resolve();
    await Promise.resolve();

    expect(component.errorMessage()).toBe('Erreur lors de la copie du lien.');
    expect(component.successMessage()).toBe('');

    vi.advanceTimersByTime(3000);

    expect(component.errorMessage()).toBe('');

    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true
    });

    vi.useRealTimers();
  });
});