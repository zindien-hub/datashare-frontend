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
- la validation UX des fichiers sélectionnés ;
- l’historique ;
- la suppression unitaire et multiple ;
- la copie du lien de téléchargement ;
- le formatage lisible des tailles de fichiers ;
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
- centraliser l’injection du JWT et la gestion des réponses `401` dans l’interceptor ;
- maintenir une interface cohérente entre desktop et mobile ;
- garder la documentation alignée avec l’état réel du projet ;
- maintenir une base de tests cohérente avec l’outillage actuellement utilisé par le projet.

## Fréquence de maintenance recommandée

### À chaque évolution fonctionnelle

- reconstruire le frontend ;
- exécuter les tests automatisés frontend ;
- vérifier la navigation ;
- vérifier le comportement des pages impactées ;
- vérifier les interactions avec le backend si le contrat API change ;
- mettre à jour la documentation si nécessaire.

### À chaque correction de bug

- reproduire le problème ;
- identifier s’il s’agit d’un problème de composant, de service, de routage, d’interceptor, de guard, de template ou de rendu ;
- corriger dans la bonne couche ;
- revalider manuellement le parcours ;
- adapter ou ajouter un test si pertinent ;
- vérifier si la couverture des parcours critiques doit être renforcée.

### Maintenance mensuelle

- vérifier les dépendances npm ;
- lancer un audit de sécurité ;
- surveiller l’évolution du bundle ;
- vérifier les résultats de couverture ;
- relire les points de dette technique ouverts ;
- vérifier les parcours critiques : login, register, upload, history, download, delete.

### Maintenance immédiate en cas d’alerte critique

Une maintenance immédiate doit être déclenchée en cas de vulnérabilité critique ou élevée concernant :

- Angular ;
- TypeScript ;
- RxJS ;
- le système de build ;
- Cypress ;
- les dépendances liées au rendu ou à la sécurité côté navigateur.

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
    - état local du composant ;
    - gestion de session ;
3. corriger dans la couche appropriée ;
4. revalider manuellement ;
5. compléter ou ajuster les tests si le cas le justifie ;
6. relancer les tests frontend concernés ;
7. mettre à jour la documentation si le comportement utilisateur change.

## Procédure de maintenance évolutive

Lorsqu’une évolution frontend est ajoutée :

1. vérifier si elle impacte :
    - le routage ;
    - l’authentification ;
    - l’API ;
    - les modèles TypeScript ;
    - le rendu responsive ;
    - le lazy loading ;
    - les tests unitaires ou E2E ;
2. vérifier si la documentation utilisateur ou technique doit être mise à jour ;
3. relancer le build ;
4. relancer les tests automatisés ;
5. revalider les pages critiques.

## Dépendances et mises à jour

Le frontend repose principalement sur :

- Angular ;
- TypeScript ;
- RxJS ;
- Vitest via l’intégration de test Angular actuelle ;
- Cypress pour les tests end-to-end.

#### Vérification courante

La maintenance doit inclure au minimum :

```bash
npm install
ng build
npm test
npm run test:coverage
npm run cy:run
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
3. exécuter les tests unitaires et la couverture ;
4. exécuter les tests E2E si les parcours critiques sont impactés ;
5. vérifier manuellement :
    - login ;
    - register ;
    - upload ;
    - history ;
    - download ;
    - delete ;
6. vérifier les redirections liées au guard et à l’expiration de session ;
7. vérifier qu’aucune régression responsive n’a été introduite.

### Automatisation envisagée

Pour une mise en production, un outil comme Dependabot ou Renovate devra être activé afin de proposer automatiquement des pull requests de mise à jour des dépendances.

Les pull requests automatiques devront être validées par :

- build de production ;
- tests unitaires ;
- couverture ;
- tests E2E ;
- audit de sécurité ;
- revue humaine avant merge.

## Matrice de risques techniques

| Zone / dépendance | Risque principal | Impact potentiel | Mesure de maintenance |
|---|---|---|---|
| Angular | Régression framework ou breaking change | Rendu cassé, routage dégradé ou build impossible | Mise à jour contrôlée, build, tests unitaires et E2E |
| Angular Router | Mauvaise protection ou redirection incorrecte | Accès non authentifié à une page protégée ou mauvaise UX | Tests AuthGuard, tests navigation, vérification manuelle |
| HttpClient / Interceptor | Header JWT manquant ou mauvaise gestion du `401` | Requêtes refusées ou session non nettoyée | Tests interceptor, vérification login/logout/session expirée |
| AuthService | Mauvaise gestion du token | Session incohérente ou utilisateur bloqué | Tests unitaires sur token, logout et état connecté |
| Upload | Fichier invalide envoyé au backend | Mauvaise UX ou appels backend inutiles | Validation UX, tests fichiers vides/taille/type |
| History | Mauvaise sélection ou suppression multiple incorrecte | Suppression non souhaitée ou liste incohérente | Tests sélection, suppression groupée, rechargement liste |
| Clipboard API | Copie du lien indisponible ou échouée | Mauvaise expérience utilisateur | Messages d’erreur, tests fallback |
| LocalStorage | Exposition du JWT en cas de XSS | Risque de vol de token | Durcissement production envisagé avec cookie HttpOnly |
| Responsive | Interface dégradée sur mobile | Démonstration ou usage mobile moins fluide | Tests manuels, audit Lighthouse, corrections CSS |
| Dépendances npm | Vulnérabilités ou incompatibilités | Risque sécurité ou build instable | `npm audit`, mises à jour contrôlées, Dependabot/Renovate |

## Zones sensibles du frontend

Les zones suivantes doivent être surveillées en priorité :

### Authentification

- stockage du JWT ;
- déconnexion ;
- protection des routes ;
- redirection après session expirée ;
- gestion du `returnUrl` ;
- cohérence entre état connecté et navigation.

### Intégration API

- appels backend ;
- gestion des erreurs ;
- injection des headers d’authentification ;
- cohérence des modèles côté client.

### Upload et historique

- état visuel après soumission ;
- validation UX des fichiers avant upload ;
- formatage des tailles de fichiers ;
- rendu asynchrone ;
- rafraîchissement de l’historique ;
- sélection multiple ;
- suppression groupée ;
- copie du lien public ;
- lisibilité de la page history sur mobile.

### Performance et rendu

- poids du bundle initial ;
- lazy loading des pages ;
- comportement Lighthouse desktop/mobile ;
- cohérence du responsive.

## Dette technique actuelle

Les points suivants restent des sujets de maintenance :

- la couverture de tests frontend progresse mais reste partielle à l’échelle de l’ensemble des templates et comportements visuels ;
- la performance mobile est inférieure à la performance desktop ;
- la pagination de l’historique n’est pas encore implémentée ;
- le stockage du JWT en `localStorage` reste acceptable pour le MVP mais devra être durci pour une mise en production ;
- les scénarios UI avancés et certains cas limites restent à renforcer ;
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
- `npm test` passe ;
- `npm run test:coverage` a été vérifié si la modification touche le comportement applicatif ou les tests ;
- `npm run cy:run` passe si les parcours critiques sont impactés ;
- les pages impactées ont été testées manuellement ;
- le comportement responsive n’est pas dégradé ;
- les éventuels impacts documentation ont été traités ;
- les changements de contrat API sont alignés avec le backend ;
- les changements de dépendances sont accompagnés d’un audit ou d’une vérification de sécurité.

## Conclusion

Le frontend DataShare dispose d’une base maintenable pour un MVP, avec une architecture claire, une séparation des responsabilités, une gestion centralisée de l’authentification et un socle de tests frontend renforcé.

Les priorités actuelles sont :

- poursuivre le renforcement de la couverture de tests ;
- améliorer les performances mobiles ;
- préparer la pagination de l’historique ;
- surveiller l’évolution du bundle ;
- durcir la gestion du token pour un usage production ;
- conserver une cohérence entre architecture, sécurité, responsive, contrat API et documentation.
