describe('Upload', () => {
  const password = 'password1234';
  let email: string;

  beforeEach(() => {
    email = `cypress_upload_${Date.now()}@datashare.com`;

    cy.request('POST', '/api/auth/register', {
      email,
      password
    }).then((response) => {
      expect(response.status).to.eq(201);
    });

    cy.visit('/login');
    cy.get('#email').type(email);
    cy.get('#password').type(password);
    cy.contains('button', 'Se connecter').click();
    cy.url().should('include', '/upload');
  });

  it('should upload a file, show it in history, then delete it', () => {
    const fileName = 'test-upload.txt';

    cy.get('#file').selectFile('cypress/fixtures/test-upload.txt');
    cy.contains('button', 'Envoyer le fichier').click();

    cy.contains('Fichier uploadé avec succès.').should('be.visible');
    cy.contains('Upload réussi').should('be.visible');
    cy.contains(fileName).should('be.visible');

    cy.contains('Voir l’historique des fichiers').click();
    cy.url().should('include', '/history');

    cy.contains('Historique des fichiers').should('be.visible');
    cy.contains(fileName).should('be.visible');

    cy.contains('tr', fileName).within(() => {
      cy.contains('Supprimer').click();
    });

    cy.contains('Fichier supprimé avec succès.').should('be.visible');
  });
});