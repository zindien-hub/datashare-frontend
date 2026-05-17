import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { FileUploadResponse } from '../models/file-upload-response.model';
import { FileListItemResponse } from '../models/file-list-item-response.model';

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

  // Récupère l'historique des fichiers de l'utilisateur connecté.
  getMyFiles(): Observable<FileListItemResponse[]> {
    return this.http.get<FileListItemResponse[]>(this.apiUrl);
  }

  deleteFile(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteFiles(fileIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/bulk-delete`, { fileIds });
  }
}