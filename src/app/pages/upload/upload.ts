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

  selectedFile = signal<File | null>(null);
  errorMessage = signal('');
  successMessage = signal('');
  uploadResponse = signal<FileUploadResponse | null>(null);
  isSubmitting = signal(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile.set(file);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  onSubmit(fileInput?: HTMLInputElement): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.uploadResponse.set(null);

    if (!this.selectedFile()) {
      this.errorMessage.set('Veuillez sélectionner un fichier.');
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

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}