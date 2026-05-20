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

- Angular
- TypeScript
- SCSS
- Angular Router
- HttpClient
- Angular TestBed avec exécution via Vitest
- Cypress
- V8 coverage
- Proxy Angular en développement

## Pré-requis

- Node.js
- npm
- Angular CLI
- backend DataShare démarré sur `http://localhost:8080`

Le backend doit être lancé avant les tests manuels et les tests end-to-end Cypress.

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
- validation côté interface des fichiers vides ;
- validation côté interface de la taille maximale autorisée ;
- validation côté interface des types MIME autorisés ;
- historique des fichiers envoyés ;
- affichage lisible des tailles de fichiers en o / Ko / Mo ;
- téléchargement via un lien public ;
- copie du lien de téléchargement depuis l’historique ;
- suppression unitaire d’un fichier depuis l’historique ;
- sélection multiple et suppression groupée depuis l’historique.

## Routes principales

- `/login`
- `/register`
- `/upload`
- `/history`

## Sécurité côté frontend

- garde de route (`AuthGuard`) pour les pages protégées ;
- interceptor HTTP pour injecter le JWT dans les appels API protégés ;
- déconnexion utilisateur ;
- redirection vers la page de connexion si l’utilisateur n’est pas authentifié ;
- suppression de la session locale et redirection vers `/login` avec message explicatif en cas de réponse `401` sur une route protégée ;
- accès à l’upload, à l’historique et à la suppression réservé aux parcours authentifiés via le backend protégé ;
- validation UX des fichiers avant upload afin d’éviter des appels inutiles au backend ;
- messages d’erreur utilisateur sur les fichiers vides, trop volumineux ou de type non autorisé.

Limite actuelle : le JWT est stocké côté navigateur en `localStorage`, solution simple pour le MVP mais à durcir pour une mise en production.

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

Les tests couvrent notamment :

- les services d’authentification et de fichiers ;
- l’interceptor JWT ;
- le guard d’authentification ;
- les pages login et register ;
- la page upload, avec validation fichier vide, taille maximale et type MIME ;
- la page history, avec sélection multiple, suppression groupée, copie du lien et formatage des tailles ;
- les parcours E2E critiques via Cypress.

### Notes

- le frontend dépend du backend DataShare pour les fonctionnalités métier ;
- les liens de téléchargement sont construits à partir de la configuration d’environnement ;
- les pages critiques utilisent une gestion d’état réactive adaptée au framework ;
- les validations frontend complètent les validations backend, mais ne les remplacent pas ;
- les résultats chiffrés des tests sont centralisés dans `TESTING.md` ;
- les limites et règles de maintenance sont documentées dans `MAINTENANCE.md` et `SECURITY.md`.

## Limites et évolutions identifiées

Les principales évolutions prévues côté frontend sont :

- ajout de la pagination sur l’historique lorsque l’API backend sera paginée ;
- durcissement de la stratégie de stockage du JWT pour un usage production ;
- amélioration de l’accessibilité et audit RGAA/WCAG plus complet ;
- optimisation des performances mobiles ;
- amélioration de l’observabilité côté client si nécessaire ;
- enrichissement des tests visuels et scénarios E2E.