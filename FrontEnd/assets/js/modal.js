// Déclaration des variables DOM
const modal = document.getElementById("myModal"); // Modal principale
const addPhotoModal = document.getElementById("addPhotoModal"); // Modal d'ajout de photo
const addPhotoBtn = document.getElementById("addPhotoBtn"); // Bouton pour ouvrir la modal d'ajout de photo
const closeMainModalBtn = document.querySelector("#myModal .close"); // Bouton de fermeture de la modal principale
const modifierSpan = document.querySelector(".modifier"); // Élément "modifier" dans le DOM
const addPhotoForm = document.querySelector("#addPhotoModal form"); // Formulaire dans la modal d'ajout de photo
const photoPreview = document.getElementById("photoPreview"); // Aperçu de la photo dans la modal d'ajout de photo
let works = []; // Tableau pour stocker les projets

// Fonction pour ouvrir la modal
function ouvrirModal() {
    modal.style.display = "block";
}

// Gestionnaire d'événement pour le clic sur le bouton "Modifier"
document.getElementById("modifiertest").addEventListener("click", function() {
    afficherProjetsDansModal(); // Appelle la fonction pour afficher les projets dans la modal
    ouvrirModal(); // Ouvre la modal après avoir affiché les projets
});

// Fonction pour afficher les projets dans la modal
function afficherProjetsDansModal() {
    const apiUrl = "http://localhost:5678/api/works"; // URL de l'API des projets
    const worksContainer = document.getElementById("worksContainer"); // Conteneur des projets dans la modal

    // Utilisation de fetch pour récupérer les projets depuis l'API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des projets depuis l'API.");
            }
            return response.json();
        })
        .then(projects => {
            worksContainer.innerHTML = ""; // Efface le contenu actuel de worksContainer

            // Affiche chaque projet dans la modal
            projects.forEach(project => {
                const projectElement = createProjectElement(project);
                worksContainer.appendChild(projectElement);
            });

            ouvrirModal(); // Ouvre la modal après avoir récupéré et affiché les projets
        })
        .catch(error => {
            console.error("Erreur lors de la récupération et de l'affichage des projets :", error);
        });
}

// Fonction pour créer un élément de projet dans le DOM
function createProjectElement(project) {
    const projectElement = document.createElement("div"); // Crée un nouvel élément div

    // Définit le contenu HTML de l'élément avec une structure spécifique
    projectElement.innerHTML = `
        <div style="display: flex; justify-content: flex-end;">
            <img src="${project.imageUrl}" alt="${project.title}" style="width: 78.12px; height: 104.08px;">
            <div class="delete-icon" style="margin-left: -15px; z-index:999">
                <i class="fas fa-trash"></i>
            </div>
        </div>
    `;

    projectElement.dataset.id = project.id; // Ajoute un attribut de données pour stocker l'ID du projet

    // Ajoute un gestionnaire d'événement au bouton de suppression pour appeler la fonction deleteProject
    projectElement.querySelector(".delete-icon").addEventListener("click", () => deleteProject(project.id));

    return projectElement; // Retourne l'élément de projet nouvellement créé
}

// Fonction pour supprimer un projet
function deleteProject(projectId) {
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.token}`, // Ajoute le jeton d'authentification
        },
    })
        .then(response => {
            if (response.status === 204) {
                console.log("Succès : Le projet a été supprimé.");
                afficherProjetsDansModal(); // Met à jour l'affichage après la suppression
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
    const input = document.getElementById('imageInput');
    const imagePreview = document.getElementById('photoPreview');
    const imageSizeMessage = document.getElementById('imageSizeMessage');
    const customFileUploadLabel = document.querySelector('.custom-file-upload');

    // Vérifie si des fichiers ont été sélectionnés
if (input.files && input.files[0]) {
    // Crée un nouvel objet FileReader
    const reader = new FileReader();

    // Définit une fonction à exécuter lorsque la lecture du fichier est terminée
    reader.onload = function (e) {
        // Met à jour la source de l'aperçu de l'image avec les données du fichier
        imagePreview.src = e.target.result;

        // Affiche l'aperçu de l'image
        imagePreview.style.display = 'block';

        // Masque le message de taille de l'image (s'il est affiché)
        imageSizeMessage.style.display = 'none';

        // Masque le libellé personnalisé du téléchargement de fichier
        customFileUploadLabel.style.display = 'none';
    };

    // Lit le contenu du fichier sous forme d'URL de données
    reader.readAsDataURL(input.files[0]);
}

    }

// Fonction pour valider et envoyer les données du formulaire de téléchargement d'une photo à l'API
// Fonction de validation du formulaire d'ajout de photo, recueille les données du formulaire,
// vérifie si les champs requis sont définis et non vides, valide le type de fichier image,
// puis envoie une requête POST à l'API avec les données du formulaire.
function validatePhoto() {
    // Récupère les éléments du formulaire
    const titleInput = document.getElementById("titleInput");
    const categorySelect = document.getElementById("categorySelect");
    const fileInput = document.getElementById("imageInput");

    // Vérifie si les éléments nécessaires sont définis et non vides
    if (!titleInput || !categorySelect || !fileInput || fileInput.files.length === 0) {
        console.log("Échec de la validation : un champ du formulaire est indéfini ou vide.");
        return;
    }

    // Récupère les valeurs des champs du formulaire
    const title = titleInput.value;
    const category = categorySelect.value;
    const photoFile = fileInput.files[0];

    // Définit les types d'images autorisés
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"];

    // Vérifie si le type de fichier est une image valide
    if (!allowedImageTypes.includes(photoFile.type)) {
        console.log("Échec de la validation : le fichier n'est pas une image valide.");
        return;
    }

    // Crée un objet FormData et y ajoute les données du formulaire
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", photoFile);

    // Récupère le jeton d'authentification stocké localement
    const authToken = localStorage.getItem("token");

    // Définit l'URL de l'API
    const apiUrl = "http://localhost:5678/api/works";

    console.log("Envoi de la requête à l'API...");

    // Envoie une requête POST à l'API avec les données du formulaire
    fetch(apiUrl, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    })
    .then(response => {
        // Vérifie si la requête a réussi et ferme la modal en cas de succès
        if (response.ok) {
            console.log("Photo ajoutée avec succès.");
            closeAddPhotoModal(); // Ferme la modal d'ajout de photo après avoir ajouté la photo
        } else {
            console.error("Erreur lors de l'ajout de la photo. Statut de la réponse :", response.status);
        }
    })
    .catch(error => {
        console.error("Erreur lors de la requête POST :", error);
    });
}

// Gestionnaire d'événement pour le bouton "Valider" dans la modal d'ajout de photo
document.getElementById("validatePhotoBtn").addEventListener("click", validatePhoto);

// Fonction pour fermer la modal
function fermerModal() {
    modal.style.display = "none";
}

// Gestionnaire d'événement pour le bouton de retour dans la modal d'ajout de photo
document.querySelector("#addPhotoModal .backButton").addEventListener("click", goBack);

// Gestionnaire d'événement pour le clic sur la croix dans la modal d'ajout de photo
closeMainModalBtn.addEventListener("click", fermerModal);

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
    closeAddPhotoModal(); // Ferme la modal d'ajout de photo
}

// Gestionnaire d'événement pour le changement de l'entrée de fichier (sélection de l'image)
const input = document.getElementById('imageInput');
input.addEventListener('change', afficherImage);

// Fonction pour fermer les deux modales (modal principale et modal d'ajout de photo)
function closeAddPhotoModal() {
    modal.style.display = "none";
    addPhotoModal.style.display = "none";
}

// Sélectionne tous les éléments <span class="close">
var boutonsFermeture = document.querySelectorAll('.close');

// Ajoute un gestionnaire d'événements à chaque bouton de fermeture
boutonsFermeture.forEach(function(bouton) {
    bouton.addEventListener('click', function() {
        // Trouve la modal parente en remontant dans la hiérarchie des éléments
        var modal = bouton.closest('.modal');

        // Ferme la modal en ajustant son style
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// Gestionnaire d'événement pour le clic sur la croix dans la modal d'ajout de photo
document.querySelector("#addPhotoModal .close").addEventListener("click", function() {
    closeAddPhotoModal(); // Ferme la modal d'ajout de photo
    fermerModal(); // Ferme la modal principale
});

// Fonction pour revenir en arrière dans l'application
function goBack() {
    addPhotoModal.style.display = "none"; // Ferme la modal d'ajout de photo
}
