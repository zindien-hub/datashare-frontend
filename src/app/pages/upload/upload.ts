import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { FileService } from '../../core/service/file.service';
import { AuthService } from '../../core/service/auth.service';
import { FileUploadResponse } from '../../core/models/file-upload-response.model';

@Component({
  selector: 'app-upload',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './upload.html',
  styleUrl: './upload.scss'
})
export class Upload {
  private fileService = inject(FileService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private readonly maxFileSizeBytes = 5 * 1024 * 1024;

  private readonly allowedContentTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'text/plain'
  ];

  selectedFile = signal<File | null>(null);
  errorMessage = signal('');
  successMessage = signal('');
  uploadResponse = signal<FileUploadResponse | null>(null);
  isSubmitting = signal(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.errorMessage.set('');
    this.successMessage.set('');
    this.uploadResponse.set(null);

    if (!file) {
      this.selectedFile.set(null);
      return;
    }

    const validationError = this.validateSelectedFile(file);

    if (validationError) {
      this.selectedFile.set(null);
      this.errorMessage.set(validationError);
      input.value = '';
      return;
    }

    this.selectedFile.set(file);
  }

  onSubmit(fileInput?: HTMLInputElement): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.uploadResponse.set(null);

    if (!this.selectedFile()) {
      this.errorMessage.set('Veuillez sélectionner un fichier.');
      return;
    }

    const validationError = this.validateSelectedFile(this.selectedFile()!);

    if (validationError) {
      this.errorMessage.set(validationError);
      this.selectedFile.set(null);

      if (fileInput) {
        fileInput.value = '';
      }

      return;
    }

    this.isSubmitting.set(true);

    this.fileService.upload(this.selectedFile()!)
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.uploadResponse.set(response);
          this.successMessage.set('Fichier uploadé avec succès.');
          this.selectedFile.set(null);

          if (fileInput) {
            fileInput.value = '';
          }
        },
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message || 'Erreur lors de l’upload du fichier.'
          );
        }
      });
  }

  formatFileSize(size: number): string {
    if (size < 1024) {
      return `${size} o`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} Ko`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private validateSelectedFile(file: File): string | null {
    if (file.size === 0) {
      return 'Le fichier sélectionné est vide.';
    }

    if (file.size > this.maxFileSizeBytes) {
      return 'Le fichier dépasse la taille maximale autorisée de 5 Mo.';
    }

    if (!this.allowedContentTypes.includes(file.type)) {
      return 'Format non autorisé. Formats acceptés : PNG, JPG, PDF, TXT.';
    }

    return null;
  }
}