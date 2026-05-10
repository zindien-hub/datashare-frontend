# MAINTENANCE.md

## Objectif

Ce document décrit les éléments de maintenance du frontend Angular de DataShare.

L’objectif est de faciliter :
- la compréhension du projet ;
- les évolutions fonctionnelles ;
- la correction de bugs ;
- la stabilité du code dans le temps.

## Organisation du projet

Le frontend est structuré de manière à séparer clairement :
- le cœur applicatif (`core`) ;
- les pages (`pages`) ;
- les modèles ;
- les services ;
- les mécanismes de sécurité côté client.

Structure principale :

```text
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

Cette organisation facilite l’identification des responsabilités de chaque partie du code.

## Principes de maintenance retenus

Les principes suivants ont été appliqués :

- séparation entre logique métier et composants d’interface ;
- centralisation des appels HTTP dans des services ;
- centralisation de la logique d’authentification ;
- protection des routes via un guard ;
- injection automatique du JWT via un interceptor ;
- documentation progressive des fonctionnalités et des choix effectués.

## Zones sensibles du frontend

Les parties les plus sensibles du frontend sont :

### Authentification
- stockage du JWT ;
- contrôle d’accès aux routes protégées ;
- gestion de la déconnexion.

### Upload de fichier
- gestion de l’état visuel après soumission ;
- synchronisation entre état du composant et affichage.

### Historique
- chargement asynchrone ;
- rafraîchissement de l’interface après suppression ;
- stabilité du rendu après mise à jour des données.

## Dette technique actuelle

À ce stade du prototype, plusieurs points peuvent être améliorés :

- la couverture de tests frontend reste partielle ;
- les composants `Upload` et `History` peuvent encore être mieux testés ;
- certains rafraîchissements de vue ont nécessité une détection explicite ;
- la gestion d’erreurs peut encore être enrichie pour améliorer l’expérience utilisateur.

## Maintenance corrective

En cas de bug frontend, la démarche recommandée est :

1. reproduire le problème sur le parcours concerné ;
2. identifier s’il s’agit d’un problème :
    - de routing ;
    - d’appel API ;
    - de gestion d’état ;
    - de rendu Angular ;
3. corriger dans le service ou le composant concerné ;
4. valider par test manuel ;
5. ajouter ou adapter un test automatisé si pertinent.

## Maintenance évolutive

Les évolutions suivantes sont prévues ou envisageables :

- enrichissement des validations formulaire ;
- amélioration des messages d’erreur utilisateur ;
- ajout de nouveaux composants métier ;
- extension de l’historique ;
- amélioration de la gestion de session ;
- renforcement des tests automatisés.

## Dépendances et mises à jour

Le frontend repose principalement sur :

- Angular ;
- TypeScript ;
- Vitest.

La maintenance doit inclure :

- la surveillance des dépendances ;
- l’exécution régulière de `npm audit` ;
- la mise à jour progressive des packages compatibles ;
- la vérification de la non-régression après mise à jour.

## Bonnes pratiques recommandées

Pour maintenir le frontend dans de bonnes conditions :

- conserver une structure claire par responsabilité ;
- limiter la logique métier dans les templates ;
- privilégier les services pour les appels backend ;
- ajouter des tests automatisés sur les fonctionnalités critiques ;
- documenter les changements importants dans les fichiers de suivi.

## Conclusion

Le frontend DataShare dispose d’une structure simple et maintenable pour un MVP.

La priorité de maintenance à court terme est :

- d’augmenter la couverture de test ;
- de renforcer la robustesse des composants critiques ;
- de continuer à documenter les évolutions du projet.
