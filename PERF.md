# PERF.md

## Objectif

Ce document décrit les principaux éléments de performance observés sur le frontend Angular de DataShare.

L’objectif est d’évaluer le comportement du frontend dans un contexte de démonstration, à partir :
- du build de production ;
- d’une optimisation du routage par lazy loading ;
- d’audits Lighthouse sur les pages principales de l’application.

## Méthode utilisée

Trois types de mesures ont été retenus :

- build Angular avec `npm run build` ;
- comparaison avant / après mise en place du lazy loading par page ;
- audits Lighthouse réalisés manuellement dans Chrome DevTools sur :
  - `/login`
  - `/register`
  - `/upload`
  - `/history`.

Les pages `/upload` et `/history` étant protégées, les audits correspondants sont réalisés avec une session utilisateur valide.

## Résultats du build

### Avant optimisation du routage

```bash
Initial chunk files | Names         |  Raw size | Estimated transfer size
main-HNE2YTYA.js    | main          | 301.15 kB |                78.28 kB
styles-5INURTSO.css | styles        |   0 bytes |                 0 bytes

                    | Initial total | 301.15 kB |                78.28 kB
```

### Après mise en place du lazy loading
```bash
Initial chunk files | Names         |  Raw size | Estimated transfer size
chunk-LLJM4F2C.js   | -             | 247.36 kB |                67.83 kB
main-O6S4LW6F.js    | main          |   1.53 kB |               689 bytes
styles-5INURTSO.css | styles        |   0 bytes |                 0 bytes

                    | Initial total | 248.90 kB |                68.52 kB

Lazy chunk files    | Names         |  Raw size | Estimated transfer size
chunk-LVXKMLHM.js   | history       |   5.76 kB |                 1.99 kB
chunk-UU5WDILA.js   | upload        |   4.65 kB |                 1.65 kB
chunk-6FEH4OUJ.js   | register      |   4.10 kB |                 1.43 kB
chunk-X4G6WJQS.js   | login         |   3.58 kB |                 1.32 kB
```

## Résultat observé

Après mise en place du lazy loading :

- total initial : **248.90 kB** ;
- taille estimée transférée : **68.52 kB** ;
- bundle principal `main` réduit à **1.53 kB** ;
- pages chargées à la demande sous forme de chunks séparés.

Lazy chunks observés :

- `history` : **5.76 kB** ;
- `upload` : **4.65 kB** ;
- `register` : **4.10 kB** ;
- `login` : **3.58 kB**.

## Effet observé

Le passage au lazy loading par page a permis :

- de réduire le bundle initial de **301.15 kB** à **248.90 kB** ;
- de réduire le transfert estimé de **78.28 kB** à **68.52 kB** ;
- de mieux répartir le chargement du frontend entre les différentes routes ;
- de limiter le coût initial du chargement des pages protégées, notamment `upload` et `history`.

## Résultats Lighthouse

Les audits Lighthouse ont été réalisés manuellement depuis Chrome DevTools sur les principales pages de l’application.

### Profils Desktop

#### Page `/login`
- Performance : **82**
- Accessibility : **100**
- Best Practices : **100**
- SEO : **90**
- First Contentful Paint : **1.4 s**
- Largest Contentful Paint : **2.4 s**
- Total Blocking Time : **0 ms**
- Speed Index : **1.4 s**

#### Page `/register`
- Performance : **84**
- Accessibility : **100**
- Best Practices : **100**
- SEO : **90**
- First Contentful Paint : **1.4 s**
- Largest Contentful Paint : **2.3 s**
- Total Blocking Time : **0 ms**
- Speed Index : **1.4 s**

#### Page `/upload`
- Performance : **82**
- Accessibility : **100**
- Best Practices : **100**
- SEO : **90**
- First Contentful Paint : **1.4 s**
- Largest Contentful Paint : **2.4 s**
- Total Blocking Time : **0 ms**
- Speed Index : **1.4 s**

#### Page `/history`
- Performance : **85**
- Accessibility : **100**
- Best Practices : **100**
- SEO : **90**
- First Contentful Paint : **1.3 s**
- Largest Contentful Paint : **2.2 s**
- Total Blocking Time : **0 ms**
- Speed Index : **1.3 s**

### Profils Mobile

#### Page `/login`
- Performance : **58**
- Accessibility : **100**
- Best Practices : **100**
- SEO : **90**
- First Contentful Paint : **7.5 s**
- Largest Contentful Paint : **13.1 s**
- Total Blocking Time : **30 ms**
- Speed Index : **7.5 s**

#### Page `/register`
- Performance : **58**
- Accessibility : **100**
- Best Practices : **100**
- SEO : **90**
- First Contentful Paint : **7.5 s**
- Largest Contentful Paint : **13.1 s**
- Total Blocking Time : **30 ms**
- Speed Index : **7.5 s**

#### Page `/upload`
- Performance : **57**
- Accessibility : **100**
- Best Practices : **100**
- SEO : **90**
- First Contentful Paint : **7.7 s**
- Largest Contentful Paint : **13.4 s**
- Total Blocking Time : **40 ms**
- Speed Index : **7.7 s**

#### Page `/history`
- Performance : **58**
- Accessibility : **100**
- Best Practices : **100**
- SEO : **90**
- First Contentful Paint : **7.3 s**
- Largest Contentful Paint : **12.6 s**
- Total Blocking Time : **40 ms**
- Speed Index : **7.3 s**

Ces résultats montrent que :

- le frontend reste léger pour un MVP ;
- le lazy loading a permis d’alléger le chargement initial ;
- les pages testées présentent un comportement cohérent ;
- en profil desktop, le thread principal n’est pas bloqué de manière significative (`TBT = 0 ms`) ;
- les scores Lighthouse desktop sont bons, avec une performance comprise entre **82 et 85** ;
- les scores Lighthouse mobile sont plus faibles, compris entre **57 et 58**, avec des temps de rendu sensiblement plus élevés ;
- les ajustements responsive ont amélioré l’exploitabilité de l’interface sur petits écrans, en particulier sur la page `history` ;
- les dernières évolutions UX, comme la validation frontend des fichiers et l’affichage lisible des tailles, n’ont pas introduit de signal de dégradation bloquante sur le périmètre testé.

## Interprétation

À ce stade du projet :

- le frontend présente un poids compatible avec une démonstration ;
- la structure du routage a été améliorée avec un chargement à la demande ;
- l’expérience desktop apparaît satisfaisante sur les pages principales ;
- l’interface mobile est désormais plus cohérente visuellement, mais les audits Lighthouse montrent que la performance mobile reste une marge d’amélioration ;
- aucune alerte bloquante n’a été relevée, mais un écart net subsiste entre les profils desktop et mobile ;
- les améliorations UX récentes restent compatibles avec le périmètre de performance actuel.

Le frontend apparaît donc adapté au périmètre actuel du MVP, avec une base saine côté desktop et une marge d’optimisation encore réelle côté mobile.

## Limites actuelles

Les mesures actuelles restent limitées :

- audits réalisés en environnement local ;
- absence d’automatisation Lighthouse complète sur les routes protégées ;
- comparaison réalisée via les profils Lighthouse desktop et mobile, mais sans campagne sur plusieurs appareils physiques ;
- absence de suivi détaillé des Web Vitals dans le temps ;
- absence de mesure automatisée après chaque merge ;
- absence de test spécifique sur un historique volumineux, la pagination n’étant pas encore implémentée.

Ces résultats doivent donc être interprétés comme une évaluation locale sérieuse du frontend, et non comme un audit de performance complet en conditions réelles de production.

## Optimisations et approfondissements possibles

Les améliorations envisageables sont :

- surveiller l’évolution de la taille du bundle dans le temps ;
- approfondir l’optimisation des performances mobiles ;
- suivre plus systématiquement les Core Web Vitals ;
- automatiser Lighthouse dans une étape CI ou via script dédié ;
- tester le comportement de la page `history` avec un volume important de fichiers ;
- mettre en place une pagination côté interface lorsque l’API backend sera paginée ;
- conserver le lazy loading comme base de croissance du frontend ;
- réévaluer la stratégie de découpage si le nombre de pages ou de composants augmente.
