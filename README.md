# DataShare Frontend

Frontend Angular de l’application DataShare.

## Description

Cette application permet à un utilisateur de :

- créer un compte ;
- se connecter ;
- uploader un fichier ;
- consulter l’historique de ses fichiers ;
- télécharger un fichier via un lien public ;
- supprimer un fichier unitairement depuis l’historique ;
- sélectionner plusieurs fichiers et les supprimer en une seule action.

Le frontend communique avec le backend Spring Boot via des endpoints REST.

## Stack technique

- Angular 21
- TypeScript
- SCSS
- Angular Router
- HttpClient
- Angular TestBed avec exécution via Vitest
- Cypress
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
npm start
```

L’application est ensuite disponible sur : `http://localhost:4200`

## Fonctionnalités implémentées

### Authentification

- page d’inscription ;
- page de connexion ;
- stockage du JWT dans le navigateur ;
- protection des routes authentifiées ;
- ajout automatique du header `Authorization` via un interceptor ;
- déconnexion utilisateur ;
- redirection vers `/login` en cas de session expirée sur une route protégée ;
- conservation du `returnUrl` lors de la redirection après expiration de session.

### Gestion des fichiers

- upload de fichier pour l’utilisateur connecté ;
- historique des fichiers envoyés ;
- téléchargement via un lien public ;
- suppression unitaire d’un fichier depuis l’historique ;
- sélection multiple et suppression groupée depuis l’historique.

## Routes principales

- `/login`
- `/register`
- `/upload`
- `/history`

## Sécurité côté frontend

- garde de route (`AuthGuard`) pour les pages protégées ;
- interceptor HTTP pour injecter le JWT ;
- déconnexion utilisateur ;
- redirection vers la page de connexion si l’utilisateur n’est pas authentifié ;
- suppression de la session locale et redirection vers `/login` avec message explicatif en cas de réponse `401` sur une route protégée ;
- accès à la suppression unitaire ou multiple réservé aux parcours authentifiés via le backend protégé.

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
npm run build
```

Les fichiers générés sont produits dans le dossier `dist/`.

## Tests

Lancer les tests frontend :

```bash
npm run test
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

## Notes

- le frontend dépend du backend DataShare pour les fonctionnalités métier ;
- les liens de téléchargement sont construits à partir de la configuration d’environnement ;
- les pages critiques ont été stabilisées avec une gestion d’état réactive adaptée au framework ;
- le frontend s’appuie désormais sur des tests frontend exécutés via Angular/Vitest, des tests end-to-end Cypress et des validations manuelles sur les parcours critiques .