// Declaration des variable dom 

const modal = document.getElementById("myModal");
const addPhotoModal = document.getElementById("addPhotoModal");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const closeAddPhotoBtn = document.querySelector(".modal-content.projet-modal-content .close");
const modifierSpan = document.querySelector(".modifier");
const addPhotoForm = document.querySelector("#addPhotoModal form");
const photoPreview = document.getElementById("photoPreview");
let works = [];


// ouverture et fermeture modal 

// Fonction pour ouvrir la modal
function ouvrirModal() {
    // Ouvrir la modal
    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}

// Gestionnaire d'événement pour le clic sur le bouton "Modifier"
document.getElementById("modifiertest").addEventListener("click", function() {
    console.log("Clic sur l'élément modifiertest");
    ouvrirModal();
});



// Fonction pour afficher les projets dans la modal
function afficherProjetsDansModal() {
    const apiUrl = "http://localhost:5678/api/works"; // URL de l' API 
    const worksContainer = document.getElementById("worksContainer");

    // Utilisation de fetch pour récupérer les projets depuis l'API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des projets depuis l'API.");
            }
            return response.json();
        })
        .then(projects => {
            // Effacement du contenu actuel de worksContainer
            worksContainer.innerHTML = "";

            // Affichage des projets dans la modal
            projects.forEach(project => {
                const projectElement = createProjectElement(project);
                worksContainer.appendChild(projectElement);
            });

            // Ouvrir la modal après avoir récupéré et affiché les projets
            ouvrirModal();
        })
        .catch(error => {
            console.error("Erreur lors de la récupération et de l'affichage des projets :", error);
        });
}

// Fonction pour créer un élément de projet dans le DOM
function createProjectElement(project) {
    const projectElement = document.createElement("div");
    projectElement.innerHTML = `
        <div style="display: flex; justify-content: flex-end;">
            <img src="${project.imageUrl}" alt="${project.title}" style="width: 78.12px; height: 104.08px;">
            <div class="delete-icon" style="margin-left: -15px; z-index:999">
                <i class="fas fa-trash"></i>
            </div>
        </div>
    `;

    projectElement.dataset.id = project.id;
    projectElement.querySelector(".delete-icon").addEventListener("click", () => deleteProject(project.id));

    return projectElement;
}

// Fonction pour supprimer un projet
function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.token}`,
        },
    })
    .then(response => {
        if (response.status === 204) {
            console.log("Succès : Le projet a été supprimé.");
            // Vous pouvez ajouter ici la logique pour mettre à jour l'affichage des projets dans la modal
            afficherProjetsDansModal();  // Mettez à jour l'affichage après la suppression
        } else {
            console.error("Erreur : Échec de la suppression du projet.");
        }
    })
    .catch(error => {
        console.error("Erreur :", error);
    });
}




function afficherImage() {
    const input = document.getElementById('imageInput');
    const imagePreview = document.getElementById('photoPreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// Fonction pour fermer la modal d'ajout de photo
function closeAddPhotoModal() {
    const addPhotoModal = document.getElementById("addPhotoModal");
    addPhotoModal.style.display = "none";
}

// Fonction pour valider une photo avant de l'envoyer à l'API
function validatePhoto() {
    const titleInput = document.getElementById("titleInput");
    const categorySelect = document.getElementById("categorySelect");
    const fileInput = document.getElementById("imageInput");

    if (!titleInput || !categorySelect || !fileInput || fileInput.files.length === 0) {
        console.log("Échec de la validation : un champ du formulaire est indéfini ou vide.");
        return;
    }

    const title = titleInput.value;
    const category = categorySelect.value;
    const photoFile = fileInput.files[0];

    console.log("Titre :", title);
    console.log("Catégorie :", category);
    console.log("Fichier :", photoFile);

    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedImageTypes.includes(photoFile.type)) {
        console.log("Échec de la validation : le fichier n'est pas une image valide.");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", photoFile);

    const authToken = localStorage.getItem("token");
    const apiUrl = "http://localhost:5678/api/works";

    console.log("Envoi de la requête à l'API...");

    fetch(apiUrl, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    })
    .then(response => {
        if (response.ok) {
            console.log("Photo ajoutée avec succès.");
            // Fermer la modal après avoir ajouté la photo
            closeAddPhotoModal();
        } else {
            console.error("Erreur lors de l'ajout de la photo. Statut de la réponse :", response.status);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la requête POST :", error);
    });
}











// Appeler la fonction au chargement de la page si nécessaire
document.addEventListener("DOMContentLoaded", function() {
    // Ajoutez cette ligne si vous voulez que la modal s'ouvre automatiquement avec les projets
    // afficherProjetsDansModal();
});

// Gestionnaire d'événement pour le clic sur le bouton "Modifier"
document.getElementById("modifiertest").addEventListener("click", function() {
    console.log("Clic sur l'élément modifiertest");
    afficherProjetsDansModal();
});




// Fonction pour fermer la modal
function fermerModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// Gestionnaire d'événement pour le clic sur la croix
document.querySelector(".modal-content .close").addEventListener("click", fermerModal);




// ouverture de la deuxieme modal au click du bouton 


// Fonction pour ouvrir la modal d'ajout de photo
function ouvrirAddPhotoModal() {
    const addPhotoModal = document.getElementById("addPhotoModal");
    addPhotoModal.style.display = "block";
}

// Fonction pour fermer la modal d'ajout de photo
function fermerAddPhotoModal() {
    const addPhotoModal = document.getElementById("addPhotoModal");
    addPhotoModal.style.display = "none";
}

// Gestionnaire d'événement pour le clic sur le bouton "Ajouter une photo"
document.getElementById("addPhotoBtn").addEventListener("click", ouvrirAddPhotoModal);



// Fonction pour revenir en arrière dans l'application
function goBack() {
    // Fermer la modal d'ajout de photo
    fermerAddPhotoModal();
}

