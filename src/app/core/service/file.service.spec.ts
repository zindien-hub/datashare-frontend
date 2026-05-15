import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { FileService } from './file.service';
import { FileListItemResponse } from '../models/file-list-item-response.model';
import { FileUploadResponse } from '../models/file-upload-response.model';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FileService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should upload a file and return response', () => {
    const mockResponse: FileUploadResponse = {
      id: 1,
      originalName: 'test.pdf',
      downloadToken: 'token-123',
      downloadUrl: '/files/token-123',
      expiresAt: '2026-05-16T10:00:00Z'
    };

    const file = new File(['content'], 'test.pdf', {
      type: 'application/pdf'
    });

    service.upload(file).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/files');
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    expect(req.request.body.get('file')).toBe(file);

    req.flush(mockResponse);
  });

  it('should retrieve user files list', () => {
    const mockResponse: FileListItemResponse[] = [
      {
        id: 1,
        originalName: 'doc1.pdf',
        contentType: 'application/pdf',
        size: 1024,
        downloadToken: 'token-123',
        downloadUrl: '/files/token-123',
        expiresAt: '2026-05-16T10:00:00Z',
        createdAt: '2026-05-15T10:00:00Z'
      }
    ];

    service.getMyFiles().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/files');
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should delete a file by id', () => {
    service.deleteFile(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('/api/files/1');
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});