import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  files: FileListItemResponse[] = [];
  errorMessage = '';
  successMessage = '';
  isLoading = true;

  ngOnInit(): void {
    this.loadFiles();
  }

  loadFiles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.fileService.getMyFiles()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          this.files = Array.isArray(response) ? response : [];
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Erreur lors du chargement de l’historique.';
          this.cdr.detectChanges();
        }
      });
  }

  deleteFile(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.fileService.deleteFile(id).subscribe({
      next: () => {
        this.successMessage = 'Fichier supprimé avec succès.';
        this.loadFiles();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Erreur lors de la suppression du fichier.';
        this.cdr.detectChanges();
      }
    });
  }

  buildDownloadLink(downloadUrl: string): string {
    return `${environment.backendBaseUrl}${downloadUrl}`;
  }

  // Retour à la page upload
  goToUpload(): void {
    this.router.navigate(['/upload']);
  }

  // Copier le lien du fichier dans le presse-papiers
  copyLinkToClipboard(downloadUrl: string): void {
    const fullLink = this.buildDownloadLink(downloadUrl);

    if (!navigator.clipboard) {
      this.errorMessage = 'Copie non supportée sur ce navigateur.';
      this.successMessage = '';
      this.cdr.detectChanges();
      return;
    }

    navigator.clipboard.writeText(fullLink).then(() => {
      // Affichage du message de succès
      this.successMessage = 'Lien copié avec succès!';
      this.errorMessage = '';
      this.cdr.detectChanges();

      // Effacer le message après 3 secondes
      setTimeout(() => {
        this.successMessage = '';
        this.cdr.detectChanges();
      }, 3000);
    }).catch(() => {
      // Affichage du message d'erreur
      this.errorMessage = 'Erreur lors de la copie du lien.';
      this.successMessage = '';
      this.cdr.detectChanges();

      // Effacer le message après 3 secondes
      setTimeout(() => {
        this.errorMessage = '';
        this.cdr.detectChanges();
      }, 3000);
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}