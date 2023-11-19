// Fonction pour récupérer et afficher les projets
function fetchDataFromAPI(category) {
  const apiUrl = 'http://localhost:5678/api/works';
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('La requête a échoué');
      return response.json();
    })
    .then(data => {
      const gallery = document.querySelector('.gallery');
      
      // Filtrer les projets par catégorie si la catégorie est fournie
      const filteredData = category ?
       data.filter(item => { 
        console.log(item)
       console.log(item.categoryId === category.id)
       return item.categoryId === category.id}) : data;
       
      
      gallery.innerHTML = filteredData.map(item => `
        <div class="data-item">
          <img src="${item.imageUrl}" alt="${item.title}">
          <p>${item.title}</p>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des données :', error);
    });
}

// Fonction pour récupérer et afficher les catégories
function fetchCategoriesFromAPI() {
  const apiUrl = 'http://localhost:5678/api/categories';

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error('La requête a échoué');
      return response.json();
    })
    .then(data => {
      const categoryList = document.querySelector('.category-list');
      
      // Clear existing content in case this function is called multiple times
      categoryList.innerHTML = '';

      data.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');
        categoryItem.textContent = category.name;

        // Ajouter un écouteur d'événements pour filtrer par catégorie lors du clic
        categoryItem.addEventListener('click', () => {
          console.log('')
          fetchDataFromAPI(category);
        });
        
        categoryList.appendChild(categoryItem);
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des catégories :', error);
    });
}

// Exécuter ces fonctions lorsque le contenu DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  fetchCategoriesFromAPI();
  fetchDataFromAPI(); // Afficher tous les projets initialement
});
