// Déclarez la fonction closeModal dans le contexte global
function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    // Récupère la référence de la modal
    const modal = document.getElementById("myModal");

    // Assurez-vous que la modal n'est pas affichée au démarrage
    modal.style.display = "none";

    // Récupère la référence de l'élément qui contiendra les œuvres
    const worksContainer = document.getElementById("worksContainer");

    // Fonction pour ouvrir la modal
    function openModal() {
        modal.style.display = "block";
        displayWorks();
    }

    // Obtenez le span de modification et ajoutez un écouteur d'événements de clic
    const modifierSpan = document.querySelector(".modifier");
    if (modifierSpan) {
        modifierSpan.addEventListener("click", openModal);
    }
});


// Fonction pour afficher les œuvres dans la modal
function displayWorks() {
    // Votre tableau d'œuvres récupérées depuis l'API
    let allWorks = [
        { id: 1, title: 'Abajour Tahina', imageUrl: 'http://localhost:5678/images/abajour-tahina1651286843956.png', categoryId: 1, userId: 1 },
        { id: 2, title: 'Appartement Paris V', imageUrl: 'http://localhost:5678/images/appartement-paris-v1651287270508.png', categoryId: 2, userId: 1 },
        { id: 3, title: 'Restaurant Sushisen - Londres', imageUrl: 'http://localhost:5678/images/restaurant-sushisen-londres1651287319271.png', categoryId: 3, userId: 1 },
        { id: 4, title: 'Villa “La Balisiere” - Port Louis', imageUrl: 'http://localhost:5678/images/la-balisiere1651287350102.png', categoryId: 2, userId: 1 },
        { id: 5, title: 'Structures Thermopolis', imageUrl: 'http://localhost:5678/images/structures-thermopolis1651287380258.png', categoryId: 1, userId: 1 },
        { id: 6, title: 'Appartement Paris X', imageUrl: 'http://localhost:5678/images/appartement-paris-x1651287435459.png', categoryId: 2, userId: 1 },
        { id: 7, title: 'Pavillon “Le coteau” - Cassis', imageUrl: 'http://localhost:5678/images/le-coteau-cassis1651287469876.png', categoryId: 2, userId: 1 },
        { id: 8, title: 'Villa Ferneze - Isola d’Elba', imageUrl: 'http://localhost:5678/images/villa-ferneze1651287511604.png', categoryId: 2, userId: 1 },
        { id: 9, title: 'Appartement Paris XVIII', imageUrl: 'http://localhost:5678/images/appartement-paris-xviii1651287541053.png', categoryId: 2, userId: 1 },
        { id: 10, title: 'Bar “Lullaby” - Paris', imageUrl: 'http://localhost:5678/images/bar-lullaby-paris1651287567130.png', categoryId: 3, userId: 1 },
        { id: 11, title: 'Hotel First Arte - New Delhi', imageUrl: 'http://localhost:5678/images/hotel-first-arte-new-delhi1651287605585.png', categoryId: 3, userId: 1 },

    ];

// Vide le contenu précédent de l'élément
worksContainer.innerHTML = "";

// Boucle à travers les œuvres et les ajoute à l'élément
allWorks.forEach(function(work) {
    const workElement = document.createElement("div");
    workElement.innerHTML = `
        <div style="display: flex; justify-content: flex-end;">
            <img src="${work.imageUrl}" alt="${work.title}" style="width: 78.12px; height: 104.08px;">
            <div class="delete-icon" style="margin-left: -15px;z-index:999">
                <i class="fas fa-trash"></i>
            </div>
        </div>
    `;
    worksContainer.appendChild(workElement);
});


}

// Appel de la fonction pour afficher les œuvres lors de l'ouverture de la modal
openModal();




// Fonction pour ouvrir la modal d'ajout de photo
function openAddPhotoModal() {
    const addPhotoModal = document.getElementById("addPhotoModal");
    addPhotoModal.style.display = "block";
}

// Fonction pour fermer la modal d'ajout de photo
function closeAddPhotoModal() {
    const addPhotoModal = document.getElementById("addPhotoModal");
    addPhotoModal.style.display = "none";
}

// Fonction pour revenir à la modal principale
function goBack() {
    closeAddPhotoModal(); // Ferme la modal d'ajout de photo
    openModal(); // Réouvre la modal principale
}

// Fonction pour valider la photo (à personnaliser selon vos besoins)
function validatePhoto() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];

    if (file) {
        // Vous pouvez afficher l'image ici ou effectuer d'autres opérations avec le fichier
        const reader = new FileReader();
        reader.onload = function (e) {
            // Créez une balise d'image et attribuez-lui la source de l'image chargée
            const imageElement = document.createElement('img');
            imageElement.src = e.target.result;

            // Ajoutez l'image à l'élément de la modal (à personnaliser selon votre structure HTML)
            const modalContent = document.querySelector('.modal-content.projet-modal-content');
            modalContent.appendChild(imageElement);
        };
        reader.readAsDataURL(file);
    }

    // Ajoutez ici d'autres actions à effectuer lors de la validation de la photo
}

// Fonction pour activer le sélecteur de fichier lors du clic sur le bouton personnalisé
document.querySelector('.custom-file-upload').addEventListener('click', function () {
    document.getElementById('imageInput').click();
});

// Fonction pour valider la photo (à personnaliser selon vos besoins)
function validatePhoto() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];

    if (file) {
        // Vous pouvez afficher l'image ici ou effectuer d'autres opérations avec le fichier
        const reader = new FileReader();
        reader.onload = function (e) {
            // Créez une balise d'image et attribuez-lui la source de l'image chargée
            const imageElement = document.createElement('img');
            imageElement.src = e.target.result;

            // Ajoutez l'image à l'élément de la modal (à personnaliser selon votre structure HTML)
            const modalContent = document.querySelector('.modal-content.projet-modal-content');
            modalContent.appendChild(imageElement);
        };
        reader.readAsDataURL(file);
    }

    // Ajoutez ici d'autres actions à effectuer lors de la validation de la photo
}

function validatePhoto() {
    const input = document.getElementById('imageInput');
    const file = input.files[0];

    // Récupérez la valeur du titre
    const title = document.getElementById('titleInput').value;

    // Récupérez l'élément div pour afficher l'image
    const imageDisplay = document.getElementById('imageDisplay');

    if (file) {
        // Créez une balise d'image
        const imageElement = document.createElement('img');
        imageElement.src = URL.createObjectURL(file); // Utilisez l'URL du fichier pour l'afficher

        // Ajoutez le titre en tant que légende
        const captionElement = document.createElement('p');
        captionElement.textContent = title;

        // Effacez le contenu précédent de l'élément imageDisplay
        imageDisplay.innerHTML = "";

        // Ajoutez l'image et la légende à l'élément imageDisplay
        imageDisplay.appendChild(imageElement);
        imageDisplay.appendChild(captionElement);
    }

    // Ajoutez ici d'autres actions à effectuer lors de la validation de la photo
}





