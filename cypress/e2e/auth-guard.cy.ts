describe('Auth guard', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('should redirect to /login when visiting /upload without authentication', () => {
    cy.visit('/upload');

    cy.url().should('include', '/login');
    cy.contains('Connexion').should('be.visible');
  });

  it('should redirect to /login when visiting /history without authentication', () => {
    cy.visit('/history');

    cy.url().should('include', '/login');
    cy.contains('Connexion').should('be.visible');
  });
});