# PERF.md

## Objectif

Ce document décrit les premiers éléments de performance observés sur le frontend Angular de DataShare.

L’objectif est de documenter l’état actuel du build frontend et de vérifier que le MVP reste léger et exploitable dans un contexte de démonstration.

## Méthode utilisée

La mesure a été réalisée à partir du build de production Angular avec la commande :

```bash
ng build
```

Cette étape permet d’obtenir :

- la taille du bundle principal ;
- la taille totale des ressources initiales ;
- une estimation de la taille transférée au navigateur.

## Résultats observés

### Build frontend

Résultat obtenu :

- bundle principal `main` : 299.29 kB
- taille estimée transférée : 77.83 kB
- fichier `styles` : 0 byte
- total initial : 299.29 kB
- temps de génération du bundle : 2.978 secondes

### Lecture des résultats

Ces résultats montrent que :

- le frontend reste relativement léger pour un MVP ;
- le chargement initial est concentré sur un bundle principal unique ;
- la taille estimée transférée reste modérée ;
- le build de production se génère rapidement dans l’environnement local.

## Interprétation

À ce stade du projet :

- le frontend présente un poids compatible avec un prototype de démonstration ;
- la structure reste simple, sans multiplication excessive des bundles ;
- aucune alerte bloquante n’a été relevée lors du build observé.

Le budget de performance n’a pas été dépassé sur ce build.

## Limites actuelles

Les mesures actuelles restent limitées :

- absence de campagne Lighthouse complète ;
- absence de comparaison entre plusieurs versions du build ;
- absence de mesure en conditions réseau simulées ;
- absence de suivi détaillé des Web Vitals.

Ces résultats doivent donc être interprétés comme une première photographie technique du frontend, et non comme un audit de performance complet.

## Optimisations et approfondissements possibles

Les améliorations envisagées sont :

- mesurer les performances avec Lighthouse ;
- suivre les Core Web Vitals ;
- surveiller l’évolution de la taille du bundle au fil des fonctionnalités ajoutées ;
- envisager du lazy loading si le frontend grossit davantage ;
- mieux répartir les ressources statiques si le projet évolue vers une version plus riche.
