# Suivi voyage Madagascar

Application web statique mobile-friendly pour centraliser :
- accueil / tableau de bord
- convertisseur AR ↔ €
- suivi des dépenses
- feuille de route modifiable par notes
- réservations
- agenda
- infos utiles

## Structure

- `index.html` : accueil / tableau de bord
- `pages/` : pages métier
- `assets/css/style.css` : styles communs
- `assets/js/` : logique par page
- `assets/data/` : données statiques JSON

## Mise en ligne GitHub Pages

1. Garde `index.html` à la racine.
2. Envoie à la racine du dépôt : `index.html`, `pages/`, `assets/`, `README.md`, `.nojekyll`
3. Active Pages sur `main / (root)`.
4. Attends le déploiement puis recharge l’URL.

## Données

- `localStorage` : dépenses, notes feuille de route, dernier taux mémorisé.
- `assets/data/*.json` : agenda, réservations, infos utiles.
- Le convertisseur et la météo tentent une mise à jour réseau quand la connexion est disponible.
