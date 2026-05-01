import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

// Composant de la page de connexion
export class Login {
  private formBuilder = inject(FormBuilder);

  submitted = false;

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

    if (this.loginForm.invalid) {
      return;
    }

    console.log('Login payload:', this.loginForm.value);
  }
}