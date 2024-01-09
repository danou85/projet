// Attendre que le DOM soit chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {

  // Sélectionner les éléments du DOM nécessaires
  const categoryList = document.querySelector('.category-list');
  const gallery = document.querySelector('.gallery');
  const boutonDeconnexion = document.getElementById('logout');
  const login = document.getElementById('login');
  const modifier = document.getElementById('modifiertest');
  const modeEdition = document.getElementById('edition');

 // Fonction pour récupérer et afficher les projets depuis une API
function fetchDataFromAPI(categoryId) {
  // Définir l'URL de l'API des projets
  const apiUrl = 'http://localhost:5678/api/works';

  // Utiliser fetch pour effectuer une requête GET à l'API
  fetch(apiUrl)
      .then(response => {
          // Vérifier si la réponse de la requête est OK
          if (!response.ok) throw new Error('La requête a échoué');
          // Convertir la réponse en JSON
          return response.json();
      })
      .then(data => {
          // Filtrer les données en fonction de la catégorie sélectionnée
          const filteredData = categoryId
              ? data.filter(item => item.categoryId === categoryId)
              : data;

          // Appeler la fonction pour afficher les projets avec les données filtrées
          displayProjects(filteredData);
      })
      .catch(error => {
          // Gérer les erreurs, afficher un message dans la console
          console.error('Erreur lors de la récupération des données :', error);
      });
}

 // Fonction pour afficher les projets dans la galerie
function displayProjects(data) {
    // Mettre à jour le contenu HTML de la galerie en utilisant les données fournies
    gallery.innerHTML = data
      // Mapper chaque élément de données pour créer un élément visuel
      .map(item => `
        <div class="data-item">
          <!-- Afficher l'image du projet avec l'URL fournie dans les données -->
          <img src="${item.imageUrl}" alt="${item.image}">
          <!-- Afficher le titre du projet avec le titre fourni dans les données -->
          <p>${item.title}</p>
        </div>
      `)
      // Joindre tous les éléments visuels en une seule chaîne de caractères
      .join('');
}

// Fonction pour récupérer les catégories depuis une API
function fetchCategoriesFromAPI() {
    // Définir l'URL de l'API des catégories
    const apiUrl = 'http://localhost:5678/api/categories';

    // Effectuer une requête fetch pour obtenir les catégories depuis l'API
    fetch(apiUrl)
      .then(response => {
        // Vérifier si la réponse est réussie, sinon rejeter une erreur
        if (!response.ok) throw new Error('La requête a échoué');
        
        // Convertir la réponse en format JSON
        return response.json();
      })
      .then(data => {
        // Créer un élément "Tous" et l'ajouter à la liste des catégories
        const tousCategoryItem = document.createElement('div');
        tousCategoryItem.classList.add('category-item', 'selected');
        tousCategoryItem.textContent = 'Tous';

        // Ajouter un écouteur d'événements pour afficher tous les projets si "Tous" est sélectionné
        tousCategoryItem.addEventListener('click', () => {
          // Retirer la classe 'selected' de tous les éléments de catégorie
          const categoryItems = document.querySelectorAll('.category-item');
          categoryItems.forEach(item => {
            item.classList.remove('selected');
          });

          // Ajouter la classe 'selected' à l'élément "Tous"
          tousCategoryItem.classList.add('selected');

          // Appeler la fonction fetchDataFromAPI pour afficher tous les projets
          fetchDataFromAPI();
        });

        // Ajouter l'élément "Tous" à la liste des catégories dans l'interface utilisateur
        categoryList.appendChild(tousCategoryItem);

        // Afficher les autres catégories en utilisant la fonction displayCategories
        displayCategories(data);

        // Sélectionner la catégorie "Tous" par défaut en simulant un clic sur l'élément "Tous"
        tousCategoryItem.click();
      })
      .catch(error => {
        // Afficher une erreur dans la console en cas d'échec de la récupération des catégories
        console.error('Erreur lors de la récupération des catégories :', error);
      });
  }


  // Fonction pour afficher les catégories dans l'interface utilisateur
function displayCategories(categories) {
    // Parcourir toutes les catégories fournies en paramètre
    categories.forEach(category => {
        // Créer un nouvel élément div pour représenter une catégorie
        const categoryItem = document.createElement('div');

        // Ajouter la classe 'category-item' à l'élément div créé
        categoryItem.classList.add('category-item');

        // Définir le texte de l'élément div avec le nom de la catégorie
        categoryItem.textContent = category.name;

        // Ajouter un écouteur d'événements pour le clic sur la catégorie
        categoryItem.addEventListener('click', () => {
            // Retirer la classe 'selected' de tous les éléments de catégorie
            const categoryItems = document.querySelectorAll('.category-item');
            categoryItems.forEach(item => {
                item.classList.remove('selected');
            });

            // Ajouter la classe 'selected' à l'élément de catégorie actuel
            categoryItem.classList.add('selected');

            // Récupérer l'identifiant de la catégorie sélectionnée
            const categoryId = category.id;

            // Appeler la fonction fetchDataFromAPI avec l'identifiant de la catégorie sélectionnée
            fetchDataFromAPI(categoryId);
        });

        // Ajouter l'élément de catégorie à la liste des catégories dans l'interface utilisateur
        categoryList.appendChild(categoryItem);
    });
}

  // Exécuter ces fonctions lorsque le contenu DOM est chargé
  fetchCategoriesFromAPI();

  // Vérifier si l'utilisateur est connecté
  const estConnecte = () => localStorage.getItem('token') !== null;

  if (estConnecte()) {
    // Masquer les éléments liés à la connexion et afficher ceux liés à la déconnexion
    categoryList.style.display = 'none';
    login.style.display = 'none';
    modifier.style.display = '';
    modeEdition.style.display = '';
    boutonDeconnexion.style.display = '';
  } else {
    // Masquer les éléments liés à la déconnexion et afficher ceux liés à la connexion
    categoryList.style.display = '';
    login.style.display = '';
    modifier.style.display = 'none';
    modeEdition.style.display = 'none';
    boutonDeconnexion.style.display = 'none';
  }

  // Ajouter un gestionnaire d'événements au bouton de déconnexion
  boutonDeconnexion.addEventListener('click', () => {
    // Supprimer le jeton d'authentification lors de la déconnexion
    localStorage.removeItem('token');

    
    // Rétablir l'affichage par défaut après la déconnexion
    categoryList.style.display = '';
    login.style.display = '';
    modifier.style.display = 'none';
    modeEdition.style.display ='none';
    boutonDeconnexion.style.display = 'none';

    console.log('categoryList.style.display:', categoryList.style.display);
    console.log('login.style.display:', login.style.display);
    console.log('modifier.style.display:', modifier.style.display);
    console.log('modeEdition.style.display:', modeEdition.style.display);
  });
});