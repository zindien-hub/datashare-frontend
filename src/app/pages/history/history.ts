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
    this.cdr.detectChanges(); // Force la mise à jour de la vue pour afficher le spinner de chargement

    this.fileService.getMyFiles()
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges(); // Force la mise à jour de la vue après la fin du chargement
        })
      )
      .subscribe({
        next: (response) => {
          this.files = Array.isArray(response) ? response : [];
          this.cdr.detectChanges(); // Force la mise à jour de la vue après avoir reçu les données
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Erreur lors du chargement de l’historique.';
          this.cdr.detectChanges(); // Force la mise à jour de la vue en cas d'erreur
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

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}