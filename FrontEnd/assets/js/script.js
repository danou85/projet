// Récupération des éléments du DOM
const boutonDeconnexion = document.getElementById("logout");
const login = document.getElementById("login");
const filtre = document.getElementById("categoryList");
const modifier = document.getElementById("modifiertest")
const modeEdition = document.getElementById("edition")

// Vérifier si l'utilisateur est connecté
if (estConnecte()) {
  // Masquer les éléments liés à la connexion
  filtre.style.display = "none";
  login.style.display = "none";
  modifier.style.display = "";
  modeEdition.style.display = "";
  boutonDeconnexion.style.display = "";
} else {
  // Masquer les éléments liés à la déconnexion
  filtre.style.display = "";
  login.style.display = "";
  modifier.style.display = "none";
  modeEdition.style.display = "none";
  boutonDeconnexion.style.display = "none";
}

// Ajouter un gestionnaire d'événements au bouton de déconnexion
boutonDeconnexion.addEventListener("click", () => {
  effectuerDeconnexion();
});

// Fonction pour effectuer la déconnexion
function effectuerDeconnexion() {
  const token = localStorage.getItem("token");
  if (token !== null) {
    localStorage.removeItem("token");
  }

  // Rétablir l'affichage par défaut après la déconnexion
  filtre.style.display = "";
  login.style.display = "";
  modifier.style.display = "none";
  boutonDeconnexion.style.display = "none";
}

// Fonction pour vérifier si l'utilisateur est connecté
function estConnecte() {
  const token = localStorage.getItem("token");
  return token !== null;
}

// Fonction pour récupérer et afficher les projets depuis une API
function fetchDataFromAPI(category) {
  const apiUrl = "http://localhost:5678/api/works";
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("La requête a échoué");
      return response.json();
    })
    .then((data) => {
      const gallery = document.querySelector(".gallery");

      // Filtrer les projets par catégorie si la catégorie est fournie
      const filteredData = category
        ? data.filter((item) => item.categoryId === category.id)
        : data;

      // Afficher les projets dans la galerie
      gallery.innerHTML = filteredData
        .map(
          (item) => `
        <div class="data-item">
          <img src="${item.imageUrl}" alt="${item.title}">
          <p>${item.title}</p>
        </div>
      `
        )
        .join("");
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données :", error);
    });
}

// Fonction pour récupérer et afficher les catégories depuis une API
function fetchCategoriesFromAPI() {
  categoryList.innerHTML = "";
  const categoryItem = document.createElement("div");
  categoryItem.classList.add("category-item");
  categoryItem.textContent = "Tous";
  // Ajouter un écouteur d'événements pour filtrer par catégorie lors du clic
  categoryItem.addEventListener("click", () => {
    fetchDataFromAPI();
  });
  categoryList.appendChild(categoryItem);

  const apiUrl = "http://localhost:5678/api/categories";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("La requête a échoué");
      return response.json();
    })
    .then((data) => {
      const categoryList = document.querySelector(".category-list");

      data.forEach((category) => {
        const categoryItem = document.createElement("div");
        categoryItem.classList.add("category-item");
        categoryItem.textContent = category.name;

        // Ajouter un écouteur d'événements pour filtrer par catégorie lors du clic
        categoryItem.addEventListener("click", () => {
          // Retirer la classe 'selected' de tous les éléments de catégorie
          const categoryItems = document.querySelectorAll(".category-item");
          categoryItems.forEach((item) => {
            item.classList.remove("selected");
          });

          // Ajouter la classe 'selected' à l'élément de catégorie actuel
          categoryItem.classList.add("selected");

          // Appeler la fonction fetchDataFromAPI avec la catégorie sélectionnée
          fetchDataFromAPI(category);
        });

        categoryList.appendChild(categoryItem);
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des catégories :", error);
    });
}

// Exécuter ces fonctions lorsque le contenu DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  fetchCategoriesFromAPI();
  fetchDataFromAPI(); // Afficher tous les projets initialement
});

// Données d'exemple pour les projets
const elements = [
  { nom: "Projet 1", categorie: 1 },
  { nom: "Projet 2", categorie: 2 },
  { nom: "Projet 3", categorie: 3 },
  // Ajoutez d'autres projets avec leurs catégories
];

// Fonction pour afficher les éléments dans la liste
function afficherElements(liste) {
  const portfolioSection = document.getElementById("portfolio");
  const elementsDiv = document.createElement("div");

  liste.forEach((element) => {
    const elementDiv = document.createElement("div");
    elementDiv.textContent = element.nom;
    elementsDiv.appendChild(elementDiv);
  });

  // Supprimez les éléments existants et ajoutez les nouveaux
  portfolioSection.innerHTML = "";
  portfolioSection.appendChild(elementsDiv);
}

// Fonction pour filtrer les éléments par catégorie
function filtrerParCategorie(categorie) {
  if (categorie === "Tous") {
    // Afficher tous les éléments si la catégorie sélectionnée est "Tous"
    afficherElements(elements);
  } else {
    // Filtrer les éléments par la catégorie sélectionnée
    const elementsFiltres = elements.filter(
      (element) => element.categorie.toString() === categorie
    );
    afficherElements(elementsFiltres);
  }
}

// Fonction appelée lorsque le bouton "Tout" est cliqué
function afficherToutesCategories() {
  filtrerParCategorie("Tous");
}

// Ajoutez un gestionnaire d'événements aux boutons de catégorie
document.querySelectorAll(".category-item").forEach((button) => {
  button.addEventListener("click", function () {
    const categorie = this.getAttribute("data-category");
    filtrerParCategorie(categorie);
  });
});

// Fonction pour récupérer et afficher les projets depuis une API
function fetchDataFromAPI(category) {
  const apiUrl = "http://localhost:5678/api/works";
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("La requête a échoué");
      return response.json();
    })
    .then((data) => {
      const gallery = document.querySelector(".gallery");

      // Filtrer les projets par catégorie si la catégorie est fournie
      const filteredData =
        category && category !== "all"
          ? data.filter((item) => item.categoryId === category.id)
          : data;

      // Afficher les projets dans la galerie
      gallery.innerHTML = filteredData
        .map(
          (item) => `
        <div class="data-item">
          <img src="${item.imageUrl}" alt="${item.title}">
          <p>${item.title}</p>
        </div>
      `
        )
        .join("");
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données :", error);
    });
}

// Fonction pour vérifier si l'utilisateur est connecté
function estConnecter() {
  const token = localStorage.getItem("token");
  console.log(token);
  return token !== null;
}
