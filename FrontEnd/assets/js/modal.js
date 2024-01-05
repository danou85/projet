// Déclaration des variables DOM
const modal = document.getElementById("myModal");
const addPhotoModal = document.getElementById("addPhotoModal");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const closeMainModalBtn = document.querySelector("#myModal .close");  // Utilisation du sélecteur approprié
const modifierSpan = document.querySelector(".modifier");
const addPhotoForm = document.querySelector("#addPhotoModal form");
const photoPreview = document.getElementById("photoPreview");
let works = [];

// Fonction pour ouvrir la modal
function ouvrirModal() {
    // Ouvrir la modal
    modal.style.display = "block";
}

// Gestionnaire d'événement pour le clic sur le bouton "Modifier"
document.getElementById("modifiertest").addEventListener("click", function() {
    console.log("Clic sur l'élément modifiertest");
    afficherProjetsDansModal();  // Ajoutez cet appel pour afficher les projets dans la modal
    ouvrirModal();
});

// Fonction pour afficher les projets dans la modal
function afficherProjetsDansModal() {
    const apiUrl = "http://localhost:5678/api/works"; // URL de l'API
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

// Fonction pour afficher l'image sélectionnée par l'utilisateur
function afficherImage() {
    // Sélectionner l'élément d'entrée de fichier et l'aperçu de l'image
    const input = document.getElementById('imageInput');
    const imagePreview = document.getElementById('photoPreview');

    // Vérifier si un fichier a été sélectionné
    if (input.files && input.files[0]) {
        // Créer un objet FileReader pour lire le contenu du fichier
        const reader = new FileReader();

        // Définir une fonction de rappel à exécuter lorsque la lecture est terminée
        reader.onload = function (e) {
            // Mettre à jour la source de l'aperçu de l'image avec les données du fichier
            imagePreview.src = e.target.result;

            // Afficher l'aperçu de l'image
            imagePreview.style.display = 'block';
        };

        // Lire le contenu du fichier sous forme d'URL data: URL
        reader.readAsDataURL(input.files[0]);
    }
}

// Fonction pour fermer la modal d'ajout de photo
function closeAddPhotoModal() {
    addPhotoModal.style.display = "none";
}

// Fonction pour valider et envoyer les données du formulaire de téléchargement d'une photo à l'API
function validatePhoto() {
    // Sélectionner les éléments du formulaire
    const titleInput = document.getElementById("titleInput");
    const categorySelect = document.getElementById("categorySelect");
    const fileInput = document.getElementById("imageInput");

    // Vérifier si tous les champs nécessaires sont définis et non vides
    if (!titleInput || !categorySelect || !fileInput || fileInput.files.length === 0) {
        console.log("Échec de la validation : un champ du formulaire est indéfini ou vide.");
        return;
    }

    // Récupérer les valeurs des champs du formulaire
    const title = titleInput.value;
    const category = categorySelect.value;
    const photoFile = fileInput.files[0];

    // Définir les types d'images autorisés
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];

    // Vérifier si le type de fichier est autorisé
    if (!allowedImageTypes.includes(photoFile.type)) {
        console.log("Échec de la validation : le fichier n'est pas une image valide.");
        return;
    }

    // Créer un objet FormData pour envoyer les données du formulaire sous forme de formulaire multipart
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", photoFile);

    // Récupérer le jeton d'authentification depuis le stockage local
    const authToken = localStorage.getItem("token");

    // Définir l'URL de l'API
    const apiUrl = "http://localhost:5678/api/works";

    // Afficher un message indiquant l'envoi de la requête à l'API
    console.log("Envoi de la requête à l'API...");

    // Envoyer la requête POST à l'API avec les données du formulaire
    fetch(apiUrl, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    })
        .then(response => {
            // Vérifier si la requête a réussi
            if (response.ok) {
                console.log("Photo ajoutée avec succès.");
                // Fermer la modal après avoir ajouté la photo
                closeAddPhotoModal();
            } else {
                // Afficher une erreur en cas d'échec de la requête
                console.error("Erreur lors de l'ajout de la photo. Statut de la réponse :", response.status);
            }
        })
        .catch(error => {
            // Afficher une erreur en cas d'échec de la requête POST
            console.error("Erreur lors de la requête POST :", error);
        });
}

// Fonction pour fermer la modal
function fermerModal() {
    modal.style.display = "none";
}

// Gestionnaire d'événement pour le bouton de retour dans la modal d'ajout de photo
document.querySelector("#addPhotoModal .backButton").addEventListener("click", goBack);


// Gestionnaire d'événement pour le clic sur la croix dans la modal d'ajout de photo
closeMainModalBtn.addEventListener("click", fermerModal);  // Utilisation du bouton correct

// Appeler la fonction au chargement de la page si nécessaire
document.addEventListener("DOMContentLoaded", function() {
    // Ajoutez cette ligne si vous voulez que la modal s'ouvre automatiquement avec les projets
    // afficherProjetsDansModal();
});

// Gestionnaire d'événement pour le clic sur le bouton "Ajouter une photo"
addPhotoBtn.addEventListener("click", ouvrirAddPhotoModal);

// Fonction pour ouvrir la modal d'ajout de photo
function ouvrirAddPhotoModal() {
    addPhotoModal.style.display = "block";
}

// Fonction pour revenir en arrière dans l'application
function goBack() {
    // Fermer la modal d'ajout de photo
    closeAddPhotoModal();
}
