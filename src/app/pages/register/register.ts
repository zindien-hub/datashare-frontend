import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  submitted = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  get form() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.registerForm.invalid) {
      return;
    }

    this.authService.register({
      email: this.registerForm.value.email ?? '',
      password: this.registerForm.value.password ?? ''
    }).subscribe({
      next: (response) => {
        this.successMessage.set(response.message || 'Compte créé avec succès.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Erreur lors de la création du compte.'
        );
      }
    });
  }
}