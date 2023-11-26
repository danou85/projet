// Déclarez openAddPhotoModal en dehors de l'écouteur d'événements DOMContentLoaded
function openAddPhotoModal() {
    addPhotoModal.style.display = "block";
}

// Déclarez closeAddPhotoBtn en dehors de l'écouteur d'événements DOMContentLoaded
let closeAddPhotoBtn;

// Fonction pour valider la photo (ajoutez votre logique de validation ici)
function validatePhoto(file) {
    // Ajoutez votre logique de validation ici
    console.log("Validation de la photo...");
    console.log(file)
   // return file != undefined && file != null && file.length > 0;
   return false ;
}

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("myModal");
    const addPhotoModal = document.getElementById("addPhotoModal");
    const addPhotoBtn = document.getElementById("addPhotoBtn");
    closeAddPhotoBtn = document.querySelector(".modal-content.projet-modal-content .close");
    const modifierSpan = document.querySelector(".modifier");
    const addPhotoForm = document.getElementById("addPhotoForm");
    const photoPreview = document.getElementById("photoPreview");

    // Assurez-vous que la modal n'est pas affichée au démarrage
    modal.style.display = "none";
    addPhotoModal.style.display = "none";

    // Fonction pour ouvrir la modal principale
    function openModal() {
        modal.style.display = "block";
        displayWorks();
    }

    // Fonction pour fermer la modal principale
    function closeModal() {
        modal.style.display = "none";
    }

    // Fonction pour afficher les œuvres dans la modal principale
    function displayWorks() {
        // Remplacez l'URL ci-dessous par l'URL de votre API
        const apiUrl = "http://localhost:5678/api/works";

        // Faites une requête fetch vers l'API
        fetch(apiUrl)
            .then(response => response.json())
            .then(works => {
                const worksContainer = document.getElementById("worksContainer");

                // Videz le contenu précédent de l'élément
                worksContainer.innerHTML = "";

                // Boucle à travers les œuvres et les ajoute à l'élément
                works.forEach(function (work) {
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
            })
            .catch(error => {
                console.error("Error fetching works:", error);
            });
    }

    // Obtenez le span de modification et ajoutez un écouteur d'événements de clic
    if (modifierSpan) {
        modifierSpan.addEventListener("click", openModal);
    }

    // Ajoutez un écouteur d'événements pour fermer la modal principale en cliquant en dehors
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Ajoutez un écouteur d'événements pour ouvrir la modal principale
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener("click", openAddPhotoModal);
    }

    // Ajoutez un gestionnaire d'événements pour le formulaire
    if (addPhotoForm) {
        addPhotoForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Empêche le rechargement de la page

            // Récupérez le fichier image sélectionné par l'utilisateur
            const fileInput = document.getElementById("imageInput");
            const photoFile = fileInput.files[0];

            // Assurez-vous qu'un fichier a été sélectionné
            if (photoFile) {
                // Affichez l'aperçu de la photo avant de l'ajouter
                displayPhotoPreview(photoFile);

                // Utilisez la fonction validatePhoto ici
                if (validatePhoto(photoFile)) {
                    // Créez un objet FormData pour envoyer le fichier
                    const formData = new FormData();
                    formData.append("photo", photoFile);

                    // Remplacez l'URL ci-dessous par l'URL de votre API pour l'ajout de photo
                    const apiUrl = "http://localhost:5678/api/works";
                   const token =  localStorage.getItem('token');
                    // Faites une requête fetch pour envoyer le fichier à l'API
                    fetch(apiUrl, {
                        method: "POST",
                        body: formData,
                        headers: {
                            'Authorization':'Bearer ' + token
                        }
                
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Photo ajoutée avec succès :", data);
                        // Ajoutez le code supplémentaire ici pour gérer la réussite de l'ajout de la photo
                        closeAddPhotoModal(); // Fermez la modal après l'ajout de la photo
                        refreshHomePage(); // Rafraîchissez la page d'accueil
                    })
                    .catch(error => {
                        console.error("Erreur lors de l'ajout de la photo :", error);
                        // Ajoutez le code supplémentaire ici pour gérer les erreurs
                    });
                } else {
                    console.log("Échec de la validation de la photo.");
                }
            } else {
                console.error("Aucun fichier sélectionné.");
                // Ajoutez le code supplémentaire ici pour gérer le cas où aucun fichier n'est sélectionné
            }
        });
    }

    // Fonction pour afficher l'aperçu de la photo
    function displayPhotoPreview(file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            photoPreview.src = e.target.result;
        };

        // Lecture du contenu du fichier en tant que URL de données
        reader.readAsDataURL(file);
    }

    // Fonction pour fermer la modal d'ajout de photo
    function closeAddPhotoModal() {
        addPhotoModal.style.display = "none";
    }

    // Ajoutez un écouteur d'événements pour fermer la modal d'ajout de photo
    if (closeAddPhotoBtn) {
        closeAddPhotoBtn.addEventListener("click", function () {
            addPhotoModal.style.display = "none";
        });
    }

    // Ajoutez cette fonction dans votre fichier JavaScript
function goBack() {
    // Ajoutez le code pour revenir en arrière, par exemple :
    window.history.back();
}

});


