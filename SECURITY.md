# SECURITY.md

## Objectif

Ce document décrit les principales mesures de sécurité mises en place sur le frontend Angular de DataShare.

L’objectif est de sécuriser l’accès aux fonctionnalités du MVP et de limiter les usages non autorisés côté client :

- authentification ;
- protection des routes ;
- transmission du JWT ;
- gestion de la session utilisateur ;
- gestion des erreurs d’authentification ;
- validation UX des fichiers avant upload ;
- limitation des appels inutiles au backend.

## Mesures de sécurité mises en place

Le frontend met en place les mécanismes suivants :

- stockage du token JWT côté navigateur ;
- garde de route pour les pages protégées ;
- ajout automatique du header `Authorization` sur les appels API protégés ;
- déconnexion utilisateur ;
- séparation entre routes publiques et routes authentifiées ;
- redirection automatique vers `/login` en cas de session invalide ou expirée ;
- conservation de l’URL de retour (`returnUrl`) pour renvoyer l’utilisateur vers la page initialement demandée après reconnexion ;
- affichage d’un message informatif lorsque la session a expiré ;
- validation côté interface des fichiers vides, trop volumineux ou de type non autorisé ;
- construction des liens de téléchargement à partir de la configuration d’environnement ;
- gestion des messages d’erreur utilisateur sur les parcours critiques.

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

En cas de réponse `401` sur une requête protégée, l’interceptor HTTP :
- supprime la session locale ;
- redirige l’utilisateur vers `/login` ;
- transmet un paramètre `reason=session_expired` ;
- transmet également un paramètre `returnUrl` correspondant à la route en cours.

La page de connexion exploite ensuite ces paramètres pour :
- afficher un message informatif de session expirée ;
- renvoyer l’utilisateur vers la page demandée après reconnexion réussie.

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

Les routes d’authentification restent exclues du comportement de redirection automatique afin de ne pas perturber l’affichage des erreurs de connexion, notamment en cas d’identifiants invalides.

## Gestion de la session

Le frontend propose :

- la sauvegarde du token après connexion ;
- la récupération du token pour les appels protégés ;
- la suppression du token lors de la déconnexion ;
- la suppression automatique du token en cas de réponse `401` sur une route protégée ;
- la redirection vers la page de connexion lorsque la session n’est plus valide ;
- l’affichage d’un message utilisateur lorsque la session a expiré.

La déconnexion invalide donc la session côté client en supprimant le JWT stocké dans le navigateur.

## Validation des fichiers avant upload

Le frontend applique une validation UX avant l’envoi d’un fichier au backend.

Les contrôles effectués côté interface sont :

- rejet d’un fichier vide ;
- rejet d’un fichier dépassant la taille maximale autorisée ;
- rejet d’un type MIME non autorisé ;
- limitation de la sélection via l’attribut `accept` sur l’input fichier ;
- affichage d’un message d’erreur compréhensible pour l’utilisateur.

Les formats autorisés côté interface sont alignés avec le backend :

- PNG ;
- JPG / JPEG ;
- PDF ;
- TXT.

Cette validation améliore l’expérience utilisateur et évite certains appels inutiles au backend.

Elle ne remplace pas les contrôles serveur : le backend reste la source de vérité pour la validation de sécurité.

## Téléchargement public

Le téléchargement public repose sur une URL publique renvoyée par le backend.

Le frontend construit le lien à partir :

- des métadonnées renvoyées dans l’historique ;
- de la configuration d’environnement pour l’URL de base du backend.

Cette approche évite de coder en dur l’URL du backend dans les composants.

L’utilisateur peut également copier le lien public depuis l’historique. Le frontend utilise l’API Clipboard du navigateur lorsque celle-ci est disponible et affiche un message de succès ou d’erreur selon le résultat.

## Limites de sécurité côté client

Les contrôles réalisés côté frontend améliorent l’expérience utilisateur mais ne constituent pas une barrière de sécurité suffisante à eux seuls.

Les règles critiques restent validées côté backend :

- authentification ;
- autorisation ;
- contrôle propriétaire ;
- validation de fichier ;
- expiration des liens ;
- suppression des fichiers.

Le frontend ne doit donc pas être considéré comme une source de vérité de sécurité. Il complète les protections backend en réduisant les erreurs utilisateur et les appels invalides.

## Vérifications réalisées

Les vérifications suivantes ont été réalisées pendant le développement :

- accès refusé aux routes protégées sans authentification ;
- redirection vers `/login` en absence de token ;
- ajout correct du JWT dans les requêtes protégées ;
- absence d’ajout du JWT lorsqu’aucun token n’est disponible ;
- accès autorisé aux pages protégées après connexion ;
- déconnexion effective avec suppression du token ;
- redirection automatique vers `/login` en cas de `401` sur une route protégée ;
- absence de redirection automatique sur un `401` provenant de `/api/auth/login` ;
- transmission correcte de `returnUrl` lors de l’expiration de session ;
- affichage du message de session expirée sur la page de connexion ;
- rejet côté interface d’un fichier vide ;
- rejet côté interface d’un fichier trop volumineux ;
- rejet côté interface d’un type MIME non autorisé ;
- téléchargement correct d’un fichier via le lien public depuis l’historique ;
- copie du lien public depuis l’historique ;
- affichage d’un message si l’API Clipboard n’est pas disponible.

## Limites actuelles

À ce stade du prototype, certaines limites subsistent :

- le JWT est stocké côté navigateur dans `localStorage`, ce qui reste moins robuste qu’un cookie `HttpOnly`, `Secure`, `SameSite` pour une mise en production ;
- il n’existe pas encore de gestion avancée de rôles ou de permissions côté interface ;
- les messages d’erreur de sécurité peuvent encore être améliorés ;
- le frontend gère la redirection après session invalide ou expirée, mais ne met pas encore en œuvre de mécanisme de rafraîchissement automatique du token ;
- la protection côté frontend complète mais ne remplace pas les contrôles de sécurité côté backend ;
- l’accessibilité des messages d’erreur peut encore être auditée plus finement ;
- la gestion actuelle reste adaptée à un MVP et non à un durcissement complet de niveau production.

## Améliorations prévues

Les améliorations envisagées sont :

- mieux gérer l’expiration du JWT côté interface ;
- ajouter une gestion plus fine des erreurs `401 Unauthorized` et `403 Forbidden` ;
- renforcer encore les tests automatisés liés à l’interceptor, au guard et aux scénarios de session expirée ;
- améliorer la signalisation visuelle des états de session expirée ;
- envisager une stratégie plus robuste de gestion du token, par exemple via cookie `HttpOnly`, `Secure`, `SameSite` ;
- renforcer l’accessibilité des messages d’erreur et des états de formulaire ;
- aligner davantage le comportement frontend avec un durcissement sécurité de niveau production.
