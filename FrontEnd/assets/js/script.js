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
    const apiUrl = 'http://localhost:5678/api/works';
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error('La requête a échoué');
        return response.json();
      })
      .then(data => {
        // Filtrer les données en fonction de la catégorie sélectionnée
        const filteredData = categoryId
          ? data.filter(item => item.categoryId === categoryId)
          : data;

        // Appeler la fonction pour afficher les projets
        displayProjects(filteredData);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données :', error);
      });
  }

  // Fonction pour afficher les projets dans la galerie
  function displayProjects(data) {
    gallery.innerHTML = data
      .map(item => `
        <div class="data-item">
          <img src="${item.imageUrl}" alt="${item.image}">
          <p>${item.title}</p>
        </div>
      `)
      .join('');
  }

  // Fonction pour récupérer et afficher les catégories depuis une API
  function fetchCategoriesFromAPI() {
    const apiUrl = 'http://localhost:5678/api/categories';

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error('La requête a échoué');
        return response.json();
      })
      .then(data => {
        // Créer un élément "Tous" et l'ajouter à la liste des catégories
        const tousCategoryItem = document.createElement('div');
        tousCategoryItem.classList.add('category-item', 'selected');
        tousCategoryItem.textContent = 'Tous';

        // Ajouter un écouteur pour afficher tous les projets si "Tous" est sélectionné
        tousCategoryItem.addEventListener('click', () => {
          const categoryItems = document.querySelectorAll('.category-item');
          categoryItems.forEach(item => {
            item.classList.remove('selected');
          });

          tousCategoryItem.classList.add('selected');
          fetchDataFromAPI(); // Afficher tous les projets si "Tous" est sélectionné
        });

        categoryList.appendChild(tousCategoryItem);

        // Afficher les autres catégories
        displayCategories(data);

        // Sélectionner la catégorie "Tous" par défaut
        tousCategoryItem.click();
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des catégories :', error);
      });
  }

  // Fonction pour afficher les catégories
  function displayCategories(categories) {
    categories.forEach(category => {
      const categoryItem = document.createElement('div');
      categoryItem.classList.add('category-item');
      categoryItem.textContent = category.name;

      // Ajouter un écouteur d'événements pour filtrer par catégorie lors du clic
      categoryItem.addEventListener('click', () => {
        // Retirer la classe 'selected' de tous les éléments de catégorie
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
          item.classList.remove('selected');
        });

        // Ajouter la classe 'selected' à l'élément de catégorie actuel
        categoryItem.classList.add('selected');

        // Appeler la fonction fetchDataFromAPI avec la catégorie sélectionnée
        const categoryId = category.id;
        fetchDataFromAPI(categoryId);
      });

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
    boutonDeconnexion.style.display = 'none';
  });
});
