import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FileUploadResponse } from '../models/file-upload-response.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/files';

  // Envoie un fichier au backend via multipart/form-data.
  upload(file: File): Observable<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<FileUploadResponse>(this.apiUrl, formData);
  }
}