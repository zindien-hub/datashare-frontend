describe('Public download', () => {
  const password = 'password1234';
  let email: string;

  beforeEach(() => {
    email = `cypress_download_${Date.now()}@datashare.com`;

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

  it('should access the public download link of an uploaded file', () => {
    const fileName = 'test-upload.txt';

    cy.get('#file').selectFile('cypress/fixtures/test-upload.txt');
    cy.contains('button', 'Envoyer le fichier').click();

    cy.contains('Fichier uploadé avec succès.').should('be.visible');

    cy.contains('Voir l’historique des fichiers').click();
    cy.url().should('include', '/history');

    cy.contains('tr', fileName).within(() => {
      cy.contains('Télécharger')
        .should('have.attr', 'href')
        .then((href) => {
          if (!href) {
            throw new Error('Download link href is missing');
          }

          expect(href).to.match(/\/download\//);

          cy.request({
            url: href,
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(200);
          });
        });
    });

    cy.contains('tr', fileName).within(() => {
      cy.contains('Supprimer').click();
    });

    cy.contains('Fichier supprimé avec succès.').should('be.visible');
  });
});