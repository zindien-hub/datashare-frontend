import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})

// Composant de la page d'inscription
export class Register {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  submitted = false;
  errorMessage = '';
  successMessage = '';

  // Création du formulaire d'inscription avec validation
  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

// Getter pour accéder facilement aux contrôles du formulaire dans le template
  get form() {
    return this.registerForm.controls;
  }

  // Méthode appelée à la soumission du formulaire
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

// Appel du service d'authentification pour enregistrer le nouvel utilisateur    
    this.authService.register({
      email: this.registerForm.value.email ?? '',
      password: this.registerForm.value.password ?? ''
    }).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Compte créé avec succès.';
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Erreur lors de la création du compte.';
      }
    });
  }
}