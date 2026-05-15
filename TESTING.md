# TESTING.md

## Objectif

Ce document décrit l’état actuel des vérifications réalisées sur le frontend Angular de DataShare.

L’objectif est de sécuriser les parcours critiques de l’interface :
- authentification ;
- protection des routes ;
- gestion de session ;
- upload de fichier ;
- affichage de l’historique ;
- suppression d’un fichier ;
- génération et copie du lien de téléchargement.

## Stratégie retenue

À ce stade du projet, la validation du frontend repose sur trois approches complémentaires :

- des tests unitaires sur le socle applicatif, les services, l’interceptor, le guard et les pages critiques ;
- des tests end-to-end Cypress sur les parcours critiques du MVP ;
- des validations manuelles complémentaires sur l’interface, les messages utilisateur et le responsive.

Cette stratégie permet de couvrir à la fois :
- le comportement local des briques frontend ;
- les parcours utilisateur de bout en bout ;
- les vérifications visuelles et fonctionnelles nécessaires à un MVP.

## Outils

- Angular 21
- Vitest
- Angular TestBed
- V8 Coverage via `@vitest/coverage-v8`
- Cypress
- navigateur local pour les validations manuelles

## Exécution des tests

Lancer les tests frontend en exécution simple :

```bash
npm test
```

Lancer les tests frontend en mode watch :

```bash
npm run test:watch
```

Lancer les tests frontend avec couverture :

```bash
npm run test:coverage
```

Lancer les tests end-to-end :

```bash
npm run cy:run
```

Ouvrir Cypress en mode interactif :

```bash
npm run cy:open
```

## Tests automatisés actuellement en place

### Tests unitaires

Fichiers de test unitaires présents :

- `src/app/app.spec.ts`
- `src/app/core/service/auth.service.spec.ts`
- `src/app/core/guard/auth.guard.spec.ts`
- `src/app/core/service/file.service.spec.ts`
- `src/app/core/interceptor/auth.interceptor.spec.ts`
- `src/app/pages/login/login.spec.ts`
- `src/app/pages/register/register.spec.ts`
- `src/app/pages/upload/upload.spec.ts`
- `src/app/pages/history/history.spec.ts`

Couverture actuelle des tests unitaires :

#### Application

- création de l’application Angular

#### AuthService

- envoi de la requête d’inscription ;
- envoi de la requête de connexion ;
- sauvegarde du token ;
- récupération du token ;
- suppression du token à la déconnexion;
- vérification de l’état de connexion.

### FileService

- envoi d’un fichier au backend via `multipart/form-data` ;
- récupération de la liste des fichiers de l’utilisateur ;
- suppression d’un fichier par identifiant.

#### AuthGuard

- autorisation d’accès si l’utilisateur est connecté ;
- redirection vers `/login` si l’utilisateur n’est pas connecté.

### AuthInterceptor

- ajout du header `Authorization` lorsqu’un token existe ;
- absence de modification de la requête lorsqu’aucun token n’est disponible ;
- déconnexion et redirection vers `/login` en cas de `401` hors routes d’authentification ;
- absence de redirection sur un `401` provenant de `/api/auth/login`.

### Page Login

- création du composant ;
- affichage du message informatif si la session a expiré ;
- non-soumission si le formulaire est invalide ;
- connexion réussie ;
- sauvegarde du token ;
- redirection vers `returnUrl` si présent ;
- redirection par défaut vers `/upload` ;
- gestion des erreurs `401` ;
- gestion des erreurs réseau ;
- gestion des messages d’erreur backend ;
- gestion d’une erreur générique.

### Page Register

- création du composant ;
- soumission marquée comme effectuée ;
- remise à zéro des messages avant soumission ;
- absence d’appel backend si le formulaire est invalide ;
- appel du service d’inscription avec les bonnes données ;
- affichage du message de succès backend ;
- affichage du message de succès par défaut ;
- redirection vers `/login` après succès ;
- affichage du message d’erreur backend ;
- affichage du message d’erreur par défaut.

### Page Upload

- création du composant ;
- sélection d’un fichier ;
- gestion du cas sans fichier sélectionné ;
- upload réussi ;
- stockage de la réponse d’upload ;
- remise à zéro du champ fichier après succès ;
- gestion du message d’erreur backend ;
- gestion du message d’erreur par défaut ;
- déconnexion et redirection vers `/login`.

### Tests end-to-end Cypress

Spécifications E2E présentes :

- `cypress/e2e/auth-guard.cy.ts`
- `cypress/e2e/login.cy.ts`
- `cypress/e2e/register.cy.ts`
- `cypress/e2e/upload.cy.ts`
- `cypress/e2e/download.cy.ts`

Parcours couverts :

- redirection vers `/login` lors d’un accès non authentifié à `/upload` ;
- redirection vers `/login` lors d’un accès non authentifié à `/history` ;
- affichage d’une erreur en cas d’identifiants invalides ;
- connexion réussie ;
- inscription réussie ;
- validation du formulaire d’inscription ;
- rejet d’un email déjà existant ;
- upload d’un fichier ;
- présence du fichier dans l’historique ;
- suppression d’un fichier depuis l’historique ;
- accès au téléchargement public via le lien généré.

## Résultat actuel

À ce stade :

- **9 fichiers de tests unitaires frontend**
- **57 tests unitaires frontend au vert**
- **5 specs Cypress**
- **9 tests E2E au vert**

## Couverture actuelle

Le lancement de la couverture frontend s’effectue avec :

```bash
npm run test:coverage
```

Résultat actuel :

- **Statements : `73.02 %`**
- **Branches : `69.78 %`**
- **Functions : `81.03 %`**
- **Lines : `80.58 %`**

### Points actuellement couverts à 100 %

- `app/core/service/auth.service.ts`
- `app/core/service/file.service.ts`
- `app/core/guard/auth.guard.ts`
- `app/core/interceptor/auth.interceptor.ts`
- `app/pages/history/history.ts`

### Points encore partiellement couverts

La couverture restante concerne principalement :

- les templates HTML des pages ;
- certains embranchements secondaires dans `login.ts`, `register.ts` et `upload.ts` ;
- les comportements visuels liés au rendu des composants.

## Vérifications manuelles réalisées

Les scénarios suivants ont été validés manuellement dans le navigateur :

### 1. Inscription

- accès à la page `/register` ;
- soumission du formulaire d’inscription ;
- redirection vers la page de connexion.

### 2. Connexion

- accès à la page `/login` ;
- soumission du formulaire de connexion ;
- récupération et stockage du JWT dans le localStorage.

### 3. Protection des routes

- refus d’accès aux pages protégées sans authentification ;
- redirection vers `/login` ;
- accès autorisé après connexion.

### 4. Upload

- accès à `/upload` ;
- sélection d’un fichier ;
- soumission du formulaire ;
- affichage du résultat d’upload ;
- remise à zéro correcte de l’état visuel après soumission.

### 5. Historique

- accès à `/history` ;
- chargement de la liste des fichiers de l’utilisateur connecté ;
- affichage des métadonnées principales.

### 6. Téléchargement

- clic sur le lien de téléchargement depuis l’historique ;
- ouverture correcte du lien public renvoyé par le backend.

### 7. Suppression

- clic sur l’action Supprimer depuis l’historique ;
- mise à jour de la liste après suppression ;
- affichage du message de succès.

## Limites actuelles

Le frontend dispose désormais d’un socle de tests automatisés plus complet, mais plusieurs points restent perfectibles :

- la couverture des templates HTML reste partielle ;
- certains scénarios limites UI restent surtout couverts par validation manuelle ;
- les cas d’erreur avancés côté interface peuvent encore être enrichis ;
- le responsive et les performances frontend restent vérifiés principalement par audit et validation manuelle.

## Améliorations prévues

Les améliorations envisagées sont :

- renforcer la couverture des templates et des interactions DOM ;
- compléter les scénarios unitaires sur les branches secondaires encore non couvertes ;
- enrichir les scénarios E2E sur les cas d’erreur et comportements limites ;
- consolider le suivi de couverture frontend dans la documentation projet ;
- maintenir l’alignement entre les tests unitaires Vitest, les tests E2E Cypress et les comportements réellement livrés.

