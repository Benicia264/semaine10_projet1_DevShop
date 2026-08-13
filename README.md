#  DevShop - Application E-Commerce JS Vanilla

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow.svg)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg?logo=html5&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg?logo=css3&logoColor=white)](https://developer.mozilla.org/fr/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**DevShop** est une application web e-commerce moderne, rapide et entièrement réactive (*responsive design*). Développée sans aucun framework lourd (100% Vanilla JS), elle consomme l'API REST publique [FakeStoreAPI](https://fakestoreapi.com/) pour gérer dynamiquement un catalogue de produits en temps réel, un système de filtres avancés et un panier d'achat interactif.

---

##  Sommaire

- [Démo & Aperçu](#-démo--aperçu)
- [Fonctionnalités Clés](#-fonctionnalités-clés)
- [Technologies Utilisées](#-technologies-utilisées)
- [Architecture du Projet](#-architecture-du-projet)
- [Guide d'Installation](#-guide-dinstallation)
  - [Prérequis](#1-prérequis)
  - [Installation Pas à Pas](#2-installation-pas-à-pas)
  - [Lancement Local](#3-lancement-local)
- [Guide d'Utilisation](#-guide-dutilisation)
- [Améliorations Futures (Feuille de route)](#-améliorations-futures-feuille-de-route)
- [Dépannage (Troubleshooting)](#-dépannage-troubleshooting)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## Démo & Aperçu

> **Design Adaptive & Responsive :** L'interface s'adapte parfaitement aux smartphones, tablettes et grands écrans d'ordinateurs (avec contrainte de largeur maximale pour éviter l'étirement).

* **Mode Mobile :** Navigation compacte, grille sur 1 à 2 colonnes, tiroir panier plein écran.
* **Mode Desktop :** Grille fluide multi-colonnes, barre de recherche large, tiroir panier latéral.

---

##  Fonctionnalités Clés

###  Catalogue & Produits
* **Chargement Asynchrone :** Récupération dynamique des données via l'API REST `FakeStoreAPI` (`async/await`).
* **Affichage Dynamique :** Cartes de produits nettoyées avec tronquage des titres longs et gestion propre des images (`object-fit: contain`).
* **Indicateur de chargement :** Spinner CSS pendant la récupération des données.
* **Gestion des erreurs :** Message clair affiché à l'utilisateur si l'API est indisponible.

### Recherche, Filtres & Tri
* **Recherche Textuelle en Temps Réel :** Filtrage instantané à chaque frappe dans la barre de recherche.
* **Filtres par Catégorie :** Génération dynamique de boutons de filtres basés sur les catégories renvoyées par l'API.
* **Tri Dynamique par Prix :**
  * Du moins cher au plus cher (ordre croissant).
  * Du plus cher au moins cher (ordre décroissant).
  * Réinitialisation sur l'ordre par défaut.

### 🛒 Panier d'Achat (Off-Canvas / Tiroir)
* **Tiroir Latéral (Slide-in) :** Ouverture/Fermeture fluide sans rechargement de page.
* **Gestion des Quantités :** Boutons `+` et `-` pour modifier la quantité d'un produit directement depuis le panier.
* **Calcul Automatique :** Mise à jour en temps réel du total en Euros (`€`) et du compteur du badge panier dans la barre de navigation.
* **Persistance LocalStorage :** Le panier est sauvegardé dans le navigateur. Il ne se vide pas si vous rafraîchissez la page !
* **Feedback Utilisateur (Toasts) :** Notification flottante temporaire à chaque ajout d'un article au panier.

---

##  Technologies Utilisées

* **HTML5** : Structure sémantique accessible (`header`, `main`, `section`, `nav`).
* **CSS3 moderne** :
  * Variables CSS (`:root`) pour un thème personnalisable.
  * Flexbox & CSS Grid (`auto-fill`, `minmax`) pour le responsive.
  * Transitions & Animations fluides pour le tiroir et les toasts.
* **JavaScript Vanilla (ES6+)** :
  * Manipulation avancée du DOM.
  * Fetch API pour les requêtes HTTP.
  * Methodes de tableaux modernes (`filter()`, `sort()`, `reduce()`, `find()`, `map()`).
  * `localStorage` pour la persistance locale des données.
* **Icons** : [FontAwesome v6](https://fontawesome.com/) (chargé via CDN).

---

##  Architecture du Projet

```text
devshop/
│
├── index.html        # Squelette HTML5 et éléments d'interface
├── style.css         # Feuille de style globale, variables, responsive design
├── app.js            # Logique applicative, appels API, événements, gestion du panier
└── README.md         # Documentation complète du projet