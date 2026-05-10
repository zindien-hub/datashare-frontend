# AI-USAGE.md

## Objectif

Ce document décrit l’usage de l’intelligence artificielle pendant le développement de DataShare, conformément aux attendus du projet.

L’objectif est de préciser :
- quelles tâches ont été confiées à l’IA ;
- quel a été le rôle de supervision humaine ;
- quels ajustements ont été nécessaires avant intégration.

## User story retenue

User story retenue : **amélioration de l’expérience utilisateur sur la page d’historique des fichiers**.

Cette user story couvre :
- la navigation depuis l’historique vers la page d’upload ;
- la copie du lien de téléchargement depuis l’historique ;
- l’amélioration de l’ergonomie des actions disponibles sur la page.

## Tâches confiées à l’IA

L’IA a été utilisée comme assistant sur plusieurs tâches liées à cette user story :

- proposition d’une amélioration UX sur la page `/history` ;
- ajout d’un bouton de retour vers la page `/upload` ;
- ajout d’une action de copie du lien de téléchargement.

## Rôle de supervision humaine

Mon rôle a consisté à encadrer et valider les propositions de l’IA à chaque étape.

Concrètement, j’ai :
- sélectionné les solutions pertinentes parmi les propositions ;
- adapté le code à l’architecture réelle du projet ;
- exécuté les tests manuels ;
- vérifié le comportement de l’interface ;
- décidé des versions finales réellement conservées dans le projet.

L’IA a donc été utilisée comme outil d’assistance, mais pas comme mécanisme d’intégration automatique.

## Ajustements et correctifs réalisés

Plusieurs ajustements ont été nécessaires après les premières propositions de l’IA.

Les ajustements finalement retenus ont consisté à :
- supprimer les commentaires explicites liés à l’IA dans le code source ;
- harmoniser visuellement les boutons pour rester cohérent avec le style existant ;
- ajouter un contrôle plus robuste autour de l’usage du presse-papiers ;
- ajouter des attributs `title` pour améliorer l’usage.

Cela montre que les propositions initiales de l’IA ont nécessité une phase réelle de relecture, de test et de correction avant intégration.

## Traçabilité dans Git

La traçabilité de cette user story est visible dans l’historique Git à travers :
- les branches de travail dédiées à l’historique ;
- les commits frontend liés à la page `/history`.

Exemples de commits représentatifs :
- `feat(ai): add history navigation and copy link actions`
- `fix: refine history actions styling and document ai usage`

## Bilan

L’IA a apporté une aide utile pour :
- accélérer la structuration technique ;
- proposer une base d’implémentation ;
- aider à la documentation.

En revanche, le résultat final repose sur :
- une supervision humaine continue ;
- des tests manuels répétés ;
- des ajustements techniques réels ;
- des arbitrages faits en fonction du comportement observé dans l’application.

L’usage de l’IA a donc été celui d’un assistant de développement, sous contrôle humain, et non d’un générateur de solution intégré sans validation.
