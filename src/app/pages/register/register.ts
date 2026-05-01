import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})

// Composant de la page d'inscription
export class Register {
  private formBuilder = inject(FormBuilder);

  submitted = false;

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

    if (this.registerForm.invalid) {
      return;
    }

    console.log('Register payload:', this.registerForm.value);
  }
}