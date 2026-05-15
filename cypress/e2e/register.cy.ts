describe('Register', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should register a new user successfully', () => {
    const uniqueEmail = `cypress_register_${Date.now()}@datashare.com`;
    const password = 'password1234';

    cy.intercept('POST', '/api/auth/register').as('registerRequest');

    cy.get('#email').type(uniqueEmail);
    cy.get('#password').type(password);
    cy.contains('button', 'Créer mon compte').click();

    cy.wait('@registerRequest').then(({ response }) => {
      expect(response?.statusCode).to.eq(201);
      expect(response?.body?.message).to.eq('User registered successfully');
    });

    cy.url().should('include', '/login');
    cy.contains('Connexion').should('be.visible');
  });

  it('should display validation errors when form is invalid', () => {
    cy.contains('button', 'Créer mon compte').click();

    cy.contains('L’email est obligatoire.').should('be.visible');
    cy.contains('Le mot de passe est obligatoire.').should('be.visible');
  });

  it('should reject an already existing email', () => {
    const existingEmail = `cypress_existing_${Date.now()}@datashare.com`;
    const password = 'password1234';

    cy.intercept('POST', '/api/auth/register').as('registerRequest');

    cy.get('#email').type(existingEmail);
    cy.get('#password').type(password);
    cy.contains('button', 'Créer mon compte').click();

    cy.wait('@registerRequest').then(({ response }) => {
      expect(response?.statusCode).to.eq(201);
    });

    cy.url().should('include', '/login');

    cy.visit('/register');

    cy.get('#email').type(existingEmail);
    cy.get('#password').type(password);
    cy.contains('button', 'Créer mon compte').click();

    cy.wait('@registerRequest').then(({ response }) => {
      expect(response?.statusCode).to.eq(400);
      expect(response?.body?.message).to.eq('Email already exists');
    });

    cy.get('.error-banner').should('be.visible');
  });
});