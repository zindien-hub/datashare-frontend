import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

// Composant de la page de connexion
export class Login {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  submitted = false;
  errorMessage = '';

  // Création du formulaire de connexion avec validation
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  // Getter pour accéder facilement aux contrôles du formulaire dans le template
  get form() {
    return this.loginForm.controls;
  }

  // Méthode appelée à la soumission du formulaire
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    // Appel du service d'authentification pour tenter de connecter l'utilisateur
    this.authService.login({
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? ''
    }).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);

        // TODO: rediriger l'utilisateur vers une page protégée (/upload ou /history)
        // une fois les écrans métier et le guard implémentés.
        console.log('Connexion réussie, redirection à implémenter.');
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Erreur lors de la connexion.';
      }
    });
  }
}