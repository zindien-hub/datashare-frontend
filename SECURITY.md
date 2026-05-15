# SECURITY.md

## Objectif

Ce document décrit les principales mesures de sécurité mises en place sur le frontend Angular de DataShare.

L’objectif est de sécuriser l’accès aux fonctionnalités du MVP et de limiter les usages non autorisés côté client :
- authentification ;
- protection des routes ;
- transmission du JWT ;
- gestion de la session utilisateur.

## Mesures de sécurité mises en place

Le frontend met en place les mécanismes suivants :

- stockage du token JWT côté navigateur ;
- garde de route pour les pages protégées ;
- ajout automatique du header `Authorization` sur les appels API protégés ;
- déconnexion utilisateur ;
- séparation entre routes publiques et routes authentifiées.

## Authentification côté frontend

Le frontend communique avec le backend pour :

- l’inscription utilisateur ;
- la connexion ;
- la récupération du JWT.

### Endpoints utilisés
- `POST /api/auth/register`
- `POST /api/auth/login`

Après connexion, le token JWT renvoyé par le backend est stocké dans le navigateur afin d’être réutilisé pour les appels nécessitant une authentification.

## Gestion des accès

Le frontend protège les pages nécessitant une authentification grâce à un `AuthGuard`.
En cas de tentative d’accès à une route protégée sans session valide, le frontend redirige l’utilisateur vers `/login`.
En cas de réponse `401` sur une requête protégée, la session locale est supprimée et l’utilisateur est redirigé vers la page de connexion avec un message explicatif.

### Routes publiques
- `/login`
- `/register`

### Routes protégées
- `/upload`
- `/history`

Si l’utilisateur n’est pas authentifié, l’accès aux routes protégées est refusé et une redirection vers `/login` est effectuée.

## Transmission du JWT

Le frontend utilise un interceptor HTTP pour ajouter automatiquement le header :

```http
Authorization: Bearer <token>
```
sur les requêtes API nécessitant une authentification.

Cela évite de dupliquer cette logique dans chaque composant.

## Gestion de la session

Le frontend propose :

- la sauvegarde du token après connexion ;
- la récupération du token pour les appels protégés ;
- la suppression du token lors de la déconnexion.

La déconnexion invalide donc la session côté client en supprimant le JWT stocké dans le navigateur.

## Téléchargement public

Le téléchargement public repose sur une URL publique renvoyée par le backend.

Le frontend construit le lien à partir :

- des métadonnées renvoyées dans l’historique ;
- de la configuration d’environnement (environment.ts) pour l’URL de base du backend.

Cette approche évite de coder en dur l’URL du backend dans les composants.

## Vérifications réalisées

Les vérifications suivantes ont été réalisées pendant le développement :

- accès refusé aux routes protégées sans authentification ;
- redirection vers `/login` en absence de token ;
- ajout correct du JWT dans les requêtes protégées ;
- accès autorisé aux pages protégées après connexion ;
- déconnexion effective avec suppression du token ;
- téléchargement correct d’un fichier via le lien public depuis l’historique.

## Limites actuelles

À ce stade du prototype, certaines limites subsistent :

- le JWT est stocké côté navigateur, ce qui reste moins robuste qu’un stockage sécurisé côté serveur ;
- il n’existe pas encore de gestion avancée de rôles ou de permissions côté interface ;
- les messages d’erreur de sécurité peuvent encore être améliorés ;
- le frontend gère désormais la redirection après session invalide ou expirée, mais ne met pas encore en œuvre de mécanisme de rafraîchissement automatique du token ;

## Améliorations prévues

Les améliorations envisagées sont :

- mieux gérer l’expiration du JWT côté interface ;
- ajouter une gestion plus fine des erreurs 401/403 ;
- renforcer les tests automatisés liés à l’interceptor et aux accès protégés ;
- améliorer la signalisation visuelle des états de session expirée ;
- aligner davantage le comportement frontend avec un durcissement sécurité de niveau production.
