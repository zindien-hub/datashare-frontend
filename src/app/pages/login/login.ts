import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  submitted = signal(false);
  errorMessage = signal('');
  infoMessage = signal('');

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
    const reason = this.route.snapshot.queryParamMap.get('reason');

    if (reason === 'session_expired') {
      this.infoMessage.set('Votre session a expiré. Veuillez vous reconnecter.');
    }
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.infoMessage.set('');

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login({
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? ''
    }).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);

        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') || '/upload';

        this.router.navigate([returnUrl]);
      },
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.errorMessage.set('Email ou mot de passe incorrect');
            return;
          }

          if (error.status === 0) {
            this.errorMessage.set('Impossible de contacter le serveur.');
            return;
          }

          this.errorMessage.set(
            error.error?.message || 'Erreur lors de la connexion.'
          );
          return;
        }

        if (error instanceof Error) {
          this.errorMessage.set(error.message || 'Erreur lors de la connexion.');
          return;
        }

        this.errorMessage.set('Erreur lors de la connexion.');
      }
    });
  }
}