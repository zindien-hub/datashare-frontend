import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

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
    this.cdr.detectChanges();
  }

  // Envoie le fichier sélectionné au backend.
  onSubmit(fileInput?: HTMLInputElement): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.uploadResponse = null;

    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner un fichier.';
      this.cdr.detectChanges();
      return;
    }

    this.isSubmitting = true;
    this.cdr.detectChanges();

    this.fileService.upload(this.selectedFile)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.uploadResponse = response;
          this.successMessage = 'Fichier uploadé avec succès.';
          this.selectedFile = null;

          if (fileInput) {
            fileInput.value = '';
          }

          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Erreur lors de l’upload du fichier.';
          this.cdr.detectChanges();
        }
      });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}