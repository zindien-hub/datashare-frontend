# TESTING.md

## Objectif

Ce document décrit l’état actuel des vérifications réalisées sur le frontend Angular de DataShare.

L’objectif est de sécuriser les parcours critiques de l’interface :
- authentification ;
- protection des routes ;
- upload de fichier ;
- affichage de l’historique ;
- suppression d’un fichier.

## Stratégie retenue

À ce stade du projet, la validation du frontend repose sur trois approches complémentaires :

- des tests unitaires ciblés sur le socle applicatif ;
- des tests end-to-end Cypress sur les parcours critiques du MVP ;
- des validations manuelles complémentaires sur l’interface et le responsive.

Cette stratégie permet de couvrir à la fois le comportement local des briques frontend, les parcours utilisateur de bout en bout et les vérifications visuelles nécessaires à un MVP.

## Outils

- Angular
- Angular TestBed
- Cypress
- navigateur local pour les validations manuelles

## Exécution des tests

Lancer les tests unitaires frontend :

```bash
ng test
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

Couverture actuelle des tests unitaires :

#### Application

- création de l’application Angular

#### AuthService

- envoi de la requête d’inscription ;
- envoi de la requête de connexion ;
- sauvegarde du token ;
- récupération du token ;
- suppression du token à la déconnexion.

#### AuthGuard

- autorisation d’accès si l’utilisateur est connecté ;
- redirection vers `/login` si l’utilisateur n’est pas connecté.

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

- **3 fichiers de tests unitaires frontend**
- **7 tests unitaires frontend au vert**
- **5 specs Cypress**
- **9 tests E2E au vert**

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

Le frontend dispose désormais d’un premier socle de tests automatisés unitaires et end-to-end, mais plusieurs points restent perfectibles :

- la couverture unitaire des composants métier reste limitée ;
- l’interceptor HTTP n’est pas encore testé de manière dédiée ;
- les cas d’erreur réseau avancés restent peu couverts ;
- le responsive et les performances frontend restent vérifiés principalement par audit et validation manuelle.

## Améliorations prévues

Les améliorations envisagées sont :

- renforcer les tests unitaires sur les composants métier ;
- ajouter des tests ciblés sur l’interceptor HTTP ;
- compléter les scénarios E2E sur les cas d’erreur et les comportements limites ;
- clarifier et stabiliser la stratégie de test frontend entre Angular TestBed et l’outillage complémentaire ;
- produire un suivi de couverture frontend plus structuré.

