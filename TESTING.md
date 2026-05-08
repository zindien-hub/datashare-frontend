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

À ce stade du projet, la validation du frontend repose sur deux approches complémentaires :

- des tests automatisés ciblés sur le socle d’authentification ;
- des tests manuels fonctionnels sur les parcours critiques du MVP.

Cette stratégie a permis de prioriser la stabilité de l’application tout en mettant en place un premier socle de tests automatisés cohérent avec l’état actuel du projet.

## Outils

- Angular
- Vitest
- Angular TestBed

## Exécution des tests

Lancer les tests frontend :

```bash
ng test
```

## Tests automatisés actuellement en place

### Fichiers de test

- `src/app/app.spec.ts`
- `src/app/core/service/auth.service.spec.ts`
- `src/app/core/guard/auth.guard.spec.ts`

### Couverture actuelle

Les tests automatisés couvrent actuellement :

#### Application

- création de l’application Angular.

#### AuthService

- envoi de la requête d’inscription ;
- envoi de la requête de connexion ;
- sauvegarde du token ;
- récupération du token ;
- suppression du token à la déconnexion.

#### AuthGuard

- autorisation d’accès si l’utilisateur est connecté ;
- redirection vers `/login` si l’utilisateur n’est pas connecté.

## Résultat actuel

À ce stade :

- 3 fichiers de test frontend ;
- 7 tests frontend automatisés au vert.

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

Le frontend ne dispose pas encore de tests automatisés métier complets sur tous les composants.

En particulier, il reste à renforcer la couverture sur :

- le composant `Upload` ;
- le composant `History` ;
- l’interceptor HTTP ;
- les cas d’erreur utilisateur et réseau.

## Améliorations prévues

Les améliorations envisagées sont :

- ajouter des tests automatisés sur les composants critiques ;
- ajouter des tests sur l’interceptor JWT ;
- renforcer la couverture des parcours d’upload et d’historique ;
- produire un rapport de couverture consolidé.
