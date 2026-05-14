# MAINTENANCE.md

## Objectif

Ce document décrit les règles de maintenance du frontend Angular de DataShare.

L’objectif est de garantir dans le temps :

- la stabilité du frontend ;
- la lisibilité de l’architecture ;
- la qualité des interactions avec l’API backend ;
- la maîtrise des dépendances front ;
- la capacité à corriger rapidement les bugs d’interface, de routage ou d’état.

## Périmètre

Le frontend couvre principalement :

- l’authentification ;
- l’inscription ;
- l’upload de fichier ;
- l’historique ;
- la navigation entre pages ;
- l’injection du JWT dans les appels API ;
- la protection des routes côté client.

## Organisation du projet

Le frontend est structuré de manière à séparer clairement :

- le cœur applicatif (`core`) ;
- les pages (`pages`) ;
- les modèles ;
- les guards ;
- les interceptors ;
- les services.

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

Les principes suivants guident la maintenance du frontend :

- centraliser les appels HTTP dans des services ;
- limiter la logique métier dans les composants et dans les templates ;
- centraliser la gestion d’authentification ;
- protéger les routes par guard ;
- maintenir une interface cohérente entre desktop et mobile ;
- garder la documentation alignée avec l’état réel du projet.

## Fréquence de maintenance recommandée

### À chaque évolution fonctionnelle

- reconstruire le frontend ;
- vérifier la navigation ;
- vérifier le comportement des pages impactées ;
- mettre à jour la documentation si nécessaire.

### À chaque correction de bug

- reproduire le problème ;
- identifier s’il s’agit d’un problème de composant, de service, de routage ou de rendu ;
- corriger dans la bonne couche ;
- revalider manuellement le parcours ;
- adapter ou ajouter un test si pertinent.

### Au minimum une fois par sprint ou une fois par mois

- vérifier les dépendances npm ;
- lancer un audit de sécurité ;
- surveiller l’évolution du bundle ;
- revoir les points de dette technique ouverts.

## Procédure de maintenance corrective

En cas de bug frontend, la démarche recommandée est :

1. reproduire le problème sur le parcours concerné ;
2. identifier la cause :
    - routing ;
    - guard ;
    - interceptor ;
    - service HTTP ;
    - composant ;
    - template ;
    - styles responsive ;
3. corriger dans la couche appropriée ;
4. revalider manuellement ;
5. compléter les tests si le cas le justifie ;
6. mettre à jour la documentation si le comportement utilisateur change.

## Procédure de maintenance évolutive

Lorsqu’une évolution frontend est ajoutée :

1. vérifier si elle impacte :
    - le routage ;
    - l’authentification ;
    - l’API ;
    - le rendu responsive ;
    - le lazy loading ;
3. vérifier si la documentation utilisateur ou technique doit être mise à jour ;
4. relancer le build ;
5. revalider les pages critiques.

## Dépendances et mises à jour

Le frontend repose principalement sur :

- Angular ;
- TypeScript ;
- RxJS ;
- Vitest.

#### Vérification courante

La maintenance doit inclure au minimum :

```bash
npm install
ng build
ng test
npm audit
```

### Vérification complémentaire

Pour surveiller la structure du bundle :

```bash
ng build --stats-json
```

### Règle de mise à jour

En cas de mise à jour de dépendance :

1. mettre à jour un package ou un groupe cohérent de packages ;
2. reconstruire le frontend ;
3. exécuter les tests ;
4. vérifier manuellement :
    - login ;
    - register ;
    - upload ;
    - history ;
5. redirections liées au guard ;
6. vérifier qu’aucune régression responsive n’a été introduite.

## Zones sensibles du frontend

Les zones suivantes doivent être surveillées en priorité :

### Authentification

- stockage du JWT ;
- déconnexion ;
- protection des routes ;
- cohérence entre état connecté et navigation.

### Intégration API

- appels backend ;
- gestion des erreurs ;
- injection des headers d’authentification ;
- cohérence des modèles côté client.

### Upload et historique

- état visuel après soumission ;
- rendu asynchrone ;
- rafraîchissement de l’historique ;
- lisibilité de la page history sur mobile.

### Performance et rendu

- poids du bundle initial ;
- lazy loading des pages ;
- comportement Lighthouse desktop/mobile ;
- cohérence du responsive.

## Dette technique actuelle

Les points suivants restent des sujets de maintenance :

- la couverture de tests frontend reste partielle ;
- la performance mobile est inférieure à la performance desktop ;
- certaines pages critiques peuvent encore être renforcées côté tests ;
- l’audit Lighthouse n’est pas industrialisé ;
- l’analyse de performance des routes protégées constitue encore un point faible du projet : 
  elle dépend d’audits manuels en session authentifiée et ne bénéficie pas encore d’une automatisation fiable.

## Bonnes pratiques recommandées

Pour maintenir le frontend dans de bonnes conditions :

- conserver une structure claire par responsabilité ;
- éviter la logique complexe dans les templates ;
- utiliser les services pour les échanges avec le backend ;
- vérifier le responsive lors de chaque évolution d’interface ;
- surveiller le poids du build après ajout de fonctionnalités ;
- documenter les changements significatifs dans les fichiers de suivi.

## Critères minimaux avant merge d’un changement frontend

Avant de fusionner une évolution frontend, vérifier au minimum :

- le projet build correctement ;
- `ng test` passe ;
- les pages impactées ont été testées manuellement ;
- le comportement responsive n’est pas dégradé ;
- les éventuels impacts documentation ont été traités.

## Conclusion

Le frontend DataShare dispose d’une base maintenable pour un MVP, avec une architecture claire et une séparation correcte des responsabilités.

Les priorités actuelles sont :

- poursuivre le renforcement des tests ;
- améliorer les performances mobiles ;
- surveiller l’évolution du bundle ;
- conserver une cohérence entre architecture, responsive et documentation.
