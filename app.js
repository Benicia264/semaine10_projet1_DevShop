// --- CONFIGURATION API & DOM ---
const URL_API = "https://fakestoreapi.com/products";

const elLoader = document.getElementById("loader");
const elGrille = document.getElementById("grille-produits");
const elErreur = document.getElementById("message-erreur");
const elRecherche = document.getElementById("barre-recherche");
const elFiltresCat = document.getElementById("filtres-categories");
const elSelectTri = document.getElementById("select-tri");

// Panier & Tiroir (Off-canvas)
const btnPanier = document.getElementById("btn-panier");
const tiroirPanier = document.getElementById("tiroir-panier");
const btnFermerPanier = document.getElementById("btn-fermer-panier");
const contenuPanier = document.getElementById("contenu-panier");
const totalPrixPanier = document.getElementById("total-prix");
const countPanier = document.getElementById("count-panier");

// Variables globales d'état
let tousLesProduits = [];
let produitsFiltres = [];
let panier = JSON.parse(localStorage.getItem("devshop_panier")) || [];
let categorieActuelle = "tous";

// --- NOTIFICATION TOAST ---

function afficherNotification(message) {
  const toast = document.getElementById("toast-notification");
  if (!toast) return;

  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
  toast.classList.add("affiche");

  setTimeout(() => {
    toast.classList.remove("affiche");
  }, 2500);
}

// --- UTILS & PANIER ---

function mettreAJourPanier() {
  localStorage.setItem("devshop_panier", JSON.stringify(panier));
  
  const totalArticles = panier.reduce((acc, item) => acc + item.quantite, 0);
  if (countPanier) countPanier.textContent = totalArticles;

  afficherContenuPanier();
}

function ajouterAuPanier(produit) {
  const index = panier.findIndex((item) => item.id === produit.id);
  if (index !== -1) {
    panier[index].quantite += 1;
  } else {
    panier.push({ ...produit, quantite: 1 });
  }
  mettreAJourPanier();
  afficherNotification("Produit ajouté au panier avec succès !");
}

function modifierQuantite(id, changement) {
  const index = panier.findIndex((item) => item.id === id);
  if (index !== -1) {
    panier[index].quantite += changement;
    if (panier[index].quantite <= 0) {
      panier.splice(index, 1);
    }
    mettreAJourPanier();
  }
}

function supprimerDuPanier(id) {
  panier = panier.filter((item) => item.id !== id);
  mettreAJourPanier();
}

function afficherContenuPanier() {
  if (!contenuPanier) return;
  contenuPanier.innerHTML = "";

  if (panier.length === 0) {
    contenuPanier.innerHTML = "<p class='panier-vide'><i class='fa-solid fa-basket-shopping'></i> Votre panier est vide.</p>";
    if (totalPrixPanier) totalPrixPanier.textContent = "0.00 €";
    return;
  }

  let total = 0;

  panier.forEach((item) => {
    total += item.price * item.quantite;

    const divItem = document.createElement("div");
    divItem.classList.add("item-panier");
    divItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="info-item-panier">
        <h4>${item.title}</h4>
        <p class="prix-item">${item.price.toFixed(2)} €</p>
        <div class="controles-quantite">
          <button class="btn-qte-moins"><i class="fa-solid fa-minus"></i></button>
          <span>${item.quantite}</span>
          <button class="btn-qte-plus"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
      <button class="btn-supprimer"><i class="fa-solid fa-trash-can"></i></button>
    `;

    divItem.querySelector(".btn-qte-moins").addEventListener("click", () => modifierQuantite(item.id, -1));
    divItem.querySelector(".btn-qte-plus").addEventListener("click", () => modifierQuantite(item.id, 1));
    divItem.querySelector(".btn-supprimer").addEventListener("click", () => supprimerDuPanier(item.id));

    contenuPanier.appendChild(divItem);
  });

  if (totalPrixPanier) totalPrixPanier.textContent = `${total.toFixed(2)} €`;
}

// --- AFFICHAGE DES PRODUITS ---

function afficherProduits(liste) {
  if (!elGrille) return;
  elGrille.innerHTML = "";

  if (liste.length === 0) {
    elGrille.innerHTML = "<p class='aucun-resultat'><i class='fa-solid fa-magnifying-glass'></i> Aucun produit ne correspond à votre recherche.</p>";
    return;
  }

  liste.forEach((produit) => {
    const { title, price, category, image } = produit;

    const carte = document.createElement("div");
    carte.classList.add("carte-produit");
    carte.innerHTML = `
      <div class="image-conteneur">
        <img src="${image}" alt="${title}">
      </div>
      <div class="info-produit">
        <span class="categorie-badge">${category}</span>
        <h3>${title}</h3>
        <div class="bas-carte">
          <span class="prix">${price.toFixed(2)} €</span>
          <button class="btn-ajouter-panier">
            <i class="fa-solid fa-cart-plus"></i> Ajouter
          </button>
        </div>
      </div>
    `;

    carte.querySelector(".btn-ajouter-panier").addEventListener("click", (e) => {
      e.stopPropagation();
      ajouterAuPanier(produit);
    });

    elGrille.appendChild(carte);
  });
}

// --- FILTRES, RECHERCHE & TRI ---

function filtrerEtRechercher() {
  const termeRecherche = elRecherche ? elRecherche.value.toLowerCase().trim() : "";
  const optionTri = elSelectTri ? elSelectTri.value : "defaut";

  // 1. Filtrage par catégorie et mot-clé
  produitsFiltres = tousLesProduits.filter((produit) => {
    const correspondCategorie = categorieActuelle === "tous" || produit.category === categorieActuelle;
    const correspondRecherche = produit.title.toLowerCase().includes(termeRecherche);
    return correspondCategorie && correspondRecherche;
  });

  // 2. Tri par prix
  if (optionTri === "prix-croissant") {
    produitsFiltres.sort((a, b) => a.price - b.price);
  } else if (optionTri === "prix-decroissant") {
    produitsFiltres.sort((a, b) => b.price - a.price);
  }

  // 3. Rendu du DOM
  afficherProduits(produitsFiltres);
}

function initialiserFiltresCategories(produits) {
  if (!elFiltresCat) return;

  const categories = ["tous", ...new Set(produits.map((p) => p.category))];
  elFiltresCat.innerHTML = "";

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.classList.add("btn-filtre");
    if (cat === "tous") btn.classList.add("actif");
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);

    btn.addEventListener("click", () => {
      document.querySelectorAll(".btn-filtre").forEach((b) => b.classList.remove("actif"));
      btn.classList.add("actif");
      categorieActuelle = cat;
      filtrerEtRechercher();
    });

    elFiltresCat.appendChild(btn);
  });
}

// --- APIS & EVENEMENTS ---

async function chargerProduits() {
  if (elErreur) elErreur.textContent = "";
  if (elLoader) elLoader.style.display = "flex";

  try {
    const reponse = await fetch(URL_API);
    if (!reponse.ok) throw new Error(`Erreur réseau : ${reponse.status}`);

    tousLesProduits = await reponse.json();
    produitsFiltres = [...tousLesProduits];

    if (elLoader) elLoader.style.display = "none";

    initialiserFiltresCategories(tousLesProduits);
    afficherProduits(produitsFiltres);
  } catch (error) {
    if (elLoader) elLoader.style.display = "none";
    if (elErreur) {
      elErreur.innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Impossible de charger les produits.";
    }
    console.error("Détail de l'erreur :", error);
  }
}

// Écouteurs d'événements
if (elRecherche) {
  elRecherche.addEventListener("input", filtrerEtRechercher);
}

if (elSelectTri) {
  elSelectTri.addEventListener("change", filtrerEtRechercher);
}

// Ouverture / fermeture du Tiroir Panier
if (btnPanier && tiroirPanier) {
  btnPanier.addEventListener("click", () => {
    tiroirPanier.classList.add("ouvert");
  });
}

if (btnFermerPanier && tiroirPanier) {
  btnFermerPanier.addEventListener("click", () => {
    tiroirPanier.classList.remove("ouvert");
  });
}

// --- INITIALISATION ---
mettreAJourPanier();
chargerProduits();