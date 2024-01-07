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
    // Créer un nouvel élément de type div
    const projectElement = document.createElement("div");

    // Définir le contenu HTML de l'élément avec une structure spécifique
    projectElement.innerHTML = `
        <div style="display: flex; justify-content: flex-end;">
            <img src="${project.imageUrl}" alt="${project.title}" style="width: 78.12px; height: 104.08px;">
            <div class="delete-icon" style="margin-left: -15px; z-index:999">
                <i class="fas fa-trash"></i>
            </div>
        </div>
    `;

    // Ajouter un attribut de données (dataset) pour stocker l'ID du projet
    projectElement.dataset.id = project.id;

    // Ajouter un gestionnaire d'événement au bouton de suppression pour appeler la fonction deleteProject
    projectElement.querySelector(".delete-icon").addEventListener("click", () => deleteProject(project.id));

    // Retourner l'élément de projet nouvellement créé
    return projectElement;
}


// Fonction pour supprimer un projet
function deleteProject(projectId) {
    // Effectuer une requête DELETE à l'API pour supprimer le projet spécifié
    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.token}`, // Ajouter le jeton d'authentification
        },
    })
        .then(response => {
            // Vérifier le statut de la réponse
            if (response.status === 204) {
                console.log("Succès : Le projet a été supprimé.");
                // Ajouter ici la logique pour mettre à jour l'affichage des projets dans la modal
                afficherProjetsDansModal();  // Mettre à jour l'affichage après la suppression
            } else {
                console.error("Erreur : Échec de la suppression du projet.");
            }
        })
        .catch(error => {
            // Gérer les erreurs lors de l'envoi de la requête
            console.error("Erreur :", error);
        });
}


// Fonction pour afficher l'image sélectionnée par l'utilisateur
function afficherImage() {
    // Sélectionner l'élément d'entrée de fichier, l'aperçu de l'image et les éléments supplémentaires à masquer
    const input = document.getElementById('imageInput');
    const imagePreview = document.getElementById('photoPreview');
    const imageSizeMessage = document.getElementById('imageSizeMessage');
    const customFileUploadLabel = document.querySelector('.custom-file-upload');

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

            // Masquer les éléments supplémentaires lorsque l'image est affichée
            imageSizeMessage.style.display = 'none';
            customFileUploadLabel.style.display = 'none';
        };

        // Lire le contenu du fichier sous forme d'URL data: URL
        reader.readAsDataURL(input.files[0]);
    }
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
// Gestionnaire d'événement pour le bouton "Valider" dans la modal d'ajout de photo
document.getElementById("validatePhotoBtn").addEventListener("click", validatePhoto);


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
const input = document.getElementById('imageInput');
input.addEventListener('change', afficherImage);





// Fonction pour fermer les deux modales la modal add et la principal
function closeAddPhotoModal() {
    const modal = document.getElementById("myModal");
    const addPhotoModal = document.getElementById("addPhotoModal");
  
    // Masquer les deux modales
    modal.style.display = "none";
    addPhotoModal.style.display = "none";
  }



  // Sélectionnez tous les éléments <span class="close">
var boutonsFermeture = document.querySelectorAll('.close');

// Ajoutez un gestionnaire d'événements à chaque bouton de fermeture
boutonsFermeture.forEach(function(bouton) {
    bouton.addEventListener('click', function() {
        // Trouvez la modal parente en remontant dans la hiérarchie des éléments
        var modal = bouton.closest('.modal');

        // Fermez la modal en ajustant son style
        if (modal) {
            modal.style.display = 'none';
        }
    });
});
// Gestionnaire d'événement pour le clic sur la croix dans la modal d'ajout de photo
document.querySelector("#addPhotoModal .close").addEventListener("click", function() {
    // Fermer la modal d'ajout de photo
    closeAddPhotoModal();
    // Fermer la modal principale
    fermerModal();
});

// Fonction pour revenir en arrière dans l'application
function goBack() {
    // Fermer la modal d'ajout de photo
    addPhotoModal.style.display = "none";
}