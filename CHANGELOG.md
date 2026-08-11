# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

## [2026-08-09]

### Corrigé

- **Modal détail exercice** : le bouton fermer (X) n'était pas cliquable car l'image de l'exercice (position absolute, z-index auto) le recouvrait et interceptait les clics. Ajout d'un `z-index` supérieur au bouton `.modal-close` pour qu'il reste au-dessus de l'image (mobile + desktop). (issue #18)
