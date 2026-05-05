import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FileService } from '../../core/service/file.service';
import { AuthService } from '../../core/service/auth.service';
import { FileUploadResponse } from '../../core/models/file-upload-response.model';

@Component({
  selector: 'app-upload',
  imports: [DatePipe, FormsModule],
  templateUrl: './upload.html',
  styleUrl: './upload.scss'
})
export class Upload {
  private fileService = inject(FileService);
  private authService = inject(AuthService);
  private router = inject(Router);

  selectedFile: File | null = null;
  errorMessage = '';
  successMessage = '';
  uploadResponse: FileUploadResponse | null = null;
  isSubmitting = false;

  // Met à jour le fichier sélectionné depuis l'input.
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile = file;
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Envoie le fichier sélectionné au backend.
  onSubmit(): void {
    console.log('onSubmit déclenché');
    this.errorMessage = '';
    this.successMessage = '';
    this.uploadResponse = null;

    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner un fichier.';
      return;
    }

    this.isSubmitting = true;

    this.fileService.upload(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload OK', response);
        this.uploadResponse = response;
        this.successMessage = 'Fichier uploadé avec succès.';
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Upload KO', error);
        this.errorMessage = error?.error?.message || 'Erreur lors de l’upload du fichier.';
        this.isSubmitting = false;
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}