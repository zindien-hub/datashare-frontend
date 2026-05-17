import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { FileService } from '../../core/service/file.service';
import { AuthService } from '../../core/service/auth.service';
import { FileListItemResponse } from '../../core/models/file-list-item-response.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-history',
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  private fileService = inject(FileService);
  private authService = inject(AuthService);
  private router = inject(Router);

  files = signal<FileListItemResponse[]>([]);
  selectedFileIds = signal<Set<number>>(new Set());
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.fileService.getMyFiles()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (response) => {
          this.files.set(Array.isArray(response) ? response : []);
          this.selectedFileIds.set(new Set());
        },
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message || 'Erreur lors du chargement de l’historique.'
          );
        }
      });
  }

  deleteFile(id: number): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.fileService.deleteFile(id).subscribe({
      next: () => {
        this.successMessage.set('Fichier supprimé avec succès.');
        this.loadFiles();
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Erreur lors de la suppression du fichier.'
        );
      }
    });
  }

  toggleFileSelection(id: number): void {
    const nextSelection = new Set(this.selectedFileIds());

    if (nextSelection.has(id)) {
      nextSelection.delete(id);
    } else {
      nextSelection.add(id);
    }

    this.selectedFileIds.set(nextSelection);
  }

  toggleAllFiles(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (!checked) {
      this.selectedFileIds.set(new Set());
      return;
    }

    this.selectedFileIds.set(new Set(this.files().map(file => file.id)));
  }

  isFileSelected(id: number): boolean {
    return this.selectedFileIds().has(id);
  }

  areAllFilesSelected(): boolean {
    const files = this.files();
    return files.length > 0 && this.selectedFileIds().size === files.length;
  }

  hasSelectedFiles(): boolean {
    return this.selectedFileIds().size > 0;
  }

  deleteSelectedFiles(): void {
    const fileIds = Array.from(this.selectedFileIds());

    if (fileIds.length === 0) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.fileService.deleteFiles(fileIds).subscribe({
      next: () => {
        this.selectedFileIds.set(new Set());
        this.successMessage.set('Fichiers supprimés avec succès.');
        this.loadFiles();
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Erreur lors de la suppression des fichiers.'
        );
      }
    });
  }

  buildDownloadLink(downloadUrl: string): string {
    return `${environment.backendBaseUrl}${downloadUrl}`;
  }

  goToUpload(): void {
    this.router.navigate(['/upload']);
  }

  copyLinkToClipboard(downloadUrl: string): void {
    const fullLink = this.buildDownloadLink(downloadUrl);

    if (!navigator.clipboard) {
      this.errorMessage.set('Copie non supportée sur ce navigateur.');
      this.successMessage.set('');
      return;
    }

    navigator.clipboard.writeText(fullLink).then(() => {
      this.successMessage.set('Lien copié avec succès!');
      this.errorMessage.set('');

      setTimeout(() => {
        this.successMessage.set('');
      }, 3000);
    }).catch(() => {
      this.errorMessage.set('Erreur lors de la copie du lien.');
      this.successMessage.set('');

      setTimeout(() => {
        this.errorMessage.set('');
      }, 3000);
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}