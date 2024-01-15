import { displayProjects } from "./script.js";


// Déclaration des variables DOM
const modal = document.getElementById("myModal");
const addPhotoModal = document.getElementById("addPhotoModal");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const closeMainModalBtn = document.querySelector("#myModal .close");
const modifierSpan = document.querySelector(".modifier");
const addPhotoForm = document.querySelector("#addPhotoModal form");
const photoPreview = document.getElementById("photoPreview");

// Fonction pour ouvrir la modal
function ouvrirModal() {
    modal.style.display = "block";
}

// Gestionnaire d'événement pour le clic sur le bouton "Modifier"
document.getElementById("modifiertest").addEventListener("click", function () {
    afficherProjetsDansModal(); // Appelle la fonction pour afficher les projets dans la modal
    ouvrirModal(); // Ouvre la modal après avoir affiché les projets
});

// Fonction pour afficher les projets dans la modal
function afficherProjetsDansModal() {
    const apiUrl = "http://localhost:5678/api/works";
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des projets depuis l'API.");
            }
            return response.json();
        })
        .then(projects => {
            displayProjects(projects);
            ouvrirModal(); // Ouvre la modal après avoir récupéré et affiché les projets
        })
        .catch(error => {
            console.error("Erreur lors de la récupération et de l'affichage des projets :", error);
        });
}

// Fonction pour supprimer un projet
async function deleteProject(projectId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${projectId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        });

        if (response.status === 204) {
            console.log("Succès : Le projet a été supprimé.");
            afficherProjetsDansModal();
        } else {
            console.error("Erreur : Échec de la suppression du projet.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
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
// Fonction pour valider et envoyer les données du formulaire de téléchargement d'une photo à l'API
// Fonction pour valider et envoyer les données du formulaire de téléchargement d'une photo à l'API
async function validatePhoto() {
    // Récupère les éléments du formulaire
    const titleInput = document.getElementById("titleInput");
    const categorySelect = document.getElementById("categorySelect");
    const imageInput = document.getElementById("imageInput");

    // Vérifie si les éléments nécessaires sont définis et non vides
    if (!titleInput || !categorySelect || !imageInput || imageInput.files.length === 0) {
        console.log("Échec de la validation : un champ du formulaire est indéfini ou vide.");
        return;
    }

    // Récupère les valeurs des champs du formulaire
    const title = titleInput.value;
    const category = categorySelect.value;
    const photoFile = imageInput.files[0];

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

    try {
        // Envoie une requête POST à l'API avec les données du formulaire
        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        // Vérifie si la requête a réussi
        if (response.ok) {
            console.log("Photo ajoutée avec succès.");
            afficherProjetsDansModal();
            closeAddPhotoModal(); // Ferme la modal d'ajout de photo après avoir ajouté la photo
            
        } else {
            console.error("Erreur lors de l'ajout de la photo. Statut de la réponse :", response.status);
        }
    } catch (error) {
        console.error("Erreur lors de la requête POST :", error);
    }
}


const validatePhotoBtn = document.getElementById("validatePhotoBtn");

// Ajoutez un gestionnaire d'événements pour chaque changement dans les champs
titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("input", checkFormValidity);
imageInput.addEventListener("change", checkFormValidity);

// Fonction pour vérifier la validité du formulaire et mettre à jour le bouton "Valider"
function checkFormValidity() {
    // Vérifiez si tous les champs nécessaires sont remplis
    const isFormValid = titleInput.value.trim() !== "" && categorySelect.value !== "" && imageInput.files.length > 0;

    // Mettez à jour la couleur du bouton en fonction de la validité du formulaire
    validatePhotoBtn.style.backgroundColor = isFormValid ? "green" : ""; // Vert si le formulaire est valide, sinon pas de couleur

    return isFormValid; // Renvoie la validité du formulaire
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


