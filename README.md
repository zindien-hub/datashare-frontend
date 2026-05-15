# DataShare Frontend

Frontend Angular de l’application DataShare.

## Description

Cette application permet à un utilisateur de :

- créer un compte ;
- se connecter ;
- uploader un fichier ;
- consulter l’historique de ses fichiers ;
- télécharger un fichier via un lien public ;
- supprimer un fichier depuis l’historique.

Le frontend communique avec le backend Spring Boot via des endpoints REST.

## Stack technique

- Angular 21
- TypeScript
- SCSS
- Angular Router
- HttpClient
- Proxy Angular en développement

## Pré-requis

- Node.js
- npm
- Angular CLI
- backend DataShare démarré sur `http://localhost:8080`

## Configuration

Le frontend utilise un proxy Angular en développement pour rediriger les appels API vers le backend.

Fichier concerné :

```text
proxy.conf.json
```

Le proxy redirige notamment :

`/api/**`
`/download/**` si nécessaire selon le flux utilisé

Le frontend utilise une configuration d’environnement distincte pour le développement et la production.

Fichiers concernés :

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

En développement local, les appels passent par le proxy Angular défini dans `proxy.conf.json`.

En production, le frontend repose sur des chemins relatifs afin d’éviter toute dépendance à une URL `localhost` codée en dur.

## Démarrage en local

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de développement :

```bash
ng serve
```

L’application est ensuite disponible sur : `http://localhost:4200`

## Fonctionnalités implémentées

### Authentification

- page d’inscription;
- page de connexion;
- stockage du JWT dans le navigateur;
- protection des routes authentifiées;
- ajout automatique du header `Authorization` via un interceptor.

### Gestion des fichiers

- upload de fichier pour l’utilisateur connecté;
- historique des fichiers envoyés;
- téléchargement via un lien public;
- suppression d’un fichier depuis l’historique.

## Routes principales

- `/login`
- `/register`
- `/upload`
- `/history`

## Sécurité côté frontend

- garde de route (`AuthGuard`) pour les pages protégées ;
- interceptor HTTP pour injecter le JWT ;
- déconnexion utilisateur ;
- redirection vers la page de connexion si l’utilisateur n’est pas authentifié.

## Structure du projet

```bash
src/app/
  core/
    guard/
    interceptor/
    models/
    service/
  pages/
    login/
    register/
    upload/
    history/
```

## Build

Créer un build de production :

```bash
ng build
```

Les fichiers générés sont produits dans le dossier `dist/`.

## Tests

Lancer les tests unitaires :

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

## Notes

- le frontend dépend du backend DataShare pour les fonctionnalités métier ;
- les liens de téléchargement sont construits à partir de la configuration d’environnement ;
- les pages critiques ont été stabilisées avec une gestion d’état réactive adaptée au framework ;
- le frontend s’appuie désormais sur des tests unitaires, des tests end-to-end Cypress et des validations manuelles sur les parcours critiques.
