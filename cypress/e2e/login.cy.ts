describe('Login', () => {
  const password = 'password1234';
  let email: string;

  beforeEach(() => {
    email = `cypress_login_${Date.now()}@datashare.com`;

    cy.request('POST', '/api/auth/register', {
      email,
      password
    }).then((response) => {
      expect(response.status).to.eq(201);
    });

    cy.visit('/login');
  });

  it('should display an error on invalid credentials', () => {
    cy.get('#email').type(email);
    cy.get('#password').type('wrongpassword');
    cy.contains('button', 'Se connecter').click();

    cy.contains('Email ou mot de passe incorrect').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should login successfully with valid credentials', () => {
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.contains('button', 'Se connecter').click();

    cy.url().should('include', '/upload');
    cy.contains('Upload de fichier').should('be.visible');
  });
});