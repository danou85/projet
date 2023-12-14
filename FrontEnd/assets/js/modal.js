const modal = document.getElementById("myModal");
const addPhotoModal = document.getElementById("addPhotoModal");
const addPhotoBtn = document.getElementById("addPhotoBtn");
const closeAddPhotoBtn = document.querySelector(".modal-content.projet-modal-content .close");
const modifierSpan = document.querySelector(".modifier");
const addPhotoForm = document.querySelector("#addPhotoModal form");
const photoPreview = document.getElementById("photoPreview");
let works = [];  // Ajout de la variable works pour stocker les projets

async function fetchWorks() {
    const apiUrl = "http://localhost:5678/api/works";
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des projets.");
    }

    return response.json();
}

function createWorkElement(work) {
    const workElement = document.createElement("div");
    workElement.innerHTML = `
        <div style="display: flex; justify-content: flex-end;">
            <img src="${work.imageUrl}" alt="${work.title}" style="width: 78.12px; height: 104.08px;">
            <div class="delete-icon" style="margin-left: -15px; z-index:999">
                <i class="fas fa-trash"></i>
            </div>
        </div>
    `;

    workElement.dataset.id = work.id;
    workElement.querySelector(".delete-icon").addEventListener("click", () => deleteProject(work.id));

    return workElement;
}

async function displayWorks() {
    const worksContainer = document.getElementById("worksContainer");

    try {
        const works = await fetchWorks();
        worksContainer.innerHTML = "";
        works.forEach((work) => {
            const workElement = createWorkElement(work);
            worksContainer.appendChild(workElement);
        });
    } catch (error) {
        console.error("Erreur lors de l'affichage des œuvres :", error);
    }
}

async function deleteProject(itemId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${itemId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        });
        if (response.status === 204) {
            console.log("Succès : Le projet a été supprimé.");
            works = works.filter((work) => work.id !== itemId);
            displayWorks();
            chargerProjets();
        } else {
            console.error("Erreur : Échec de la suppression du projet.");
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

function openModal() {
    modal.style.display = "block";
    displayWorks();
}

function closeModals() {
    modal.style.display = "none";
    addPhotoModal.style.display = "none";
}

if (modifierSpan) {
    modifierSpan.addEventListener("click", openModal);
}

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

if (addPhotoBtn) {
    addPhotoBtn.addEventListener("click", openAddPhotoModal);
}

if (closeAddPhotoBtn) {
    closeAddPhotoBtn.addEventListener("click", closeAddPhotoModal);
}

if (addPhotoForm) {
    addPhotoForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (validatePhoto()) {
            try {
                const formData = new FormData();
                const title = document.getElementById("titleInput").value;
                const category = document.getElementById("categorySelect").value;
                formData.append("title", title);
                formData.append("category", category);
                const fileInput = document.getElementById("imageInput");
                const photoFile = fileInput.files[0];
                formData.append("photo", photoFile);

                const apiUrl = "http://localhost:5678/api/works";
                const token = localStorage.getItem("token");

                console.log("Envoi de la requête à l'API...");

                const response = await fetch(apiUrl, {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Réponse de l'API :", response);

                if (!response.ok) {
                    console.error("Erreur lors de l'ajout de la photo.", response.status, response.statusText);

                    try {
                        const responseBody = await response.json();
                        console.error("Contenu de la réponse d'erreur :", responseBody);
                    } catch (jsonError) {
                        console.error("Erreur lors de la lecture du contenu JSON de la réponse d'erreur :", jsonError);
                    }

                    throw new Error("Erreur lors de l'ajout de la photo.");
                }

                const data = await response.json();
                console.log("Photo ajoutée avec succès :", data);

                closeAddPhotoModal();
                refreshHomePage();
            } catch (error) {
                console.error("Erreur lors de l'ajout de la photo :", error);
            }
        } else {
            console.error("La photo n'est pas valide.");
        }
    });
}

async function validatePhoto() {
    console.log("Validation de la photo...");

    const titleInput = document.getElementById("titleInput");
    const categorySelect = document.getElementById("categorySelect");
    const fileInput = document.getElementById("imageInput");

    if (!titleInput || !categorySelect || !fileInput || fileInput.files.length === 0) {
        console.log("Échec de la validation : un champ du formulaire est indéfini ou vide.");
        return false;
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
        return false;
    }

    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("image", photoFile);

        const authToken = localStorage.getItem("token");  // Récupération du token depuis le stockage local
        const apiUrl = "http://localhost:5678/api/works";

        console.log("Envoi de la requête à l'API...");

        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        console.log("Réponse de l'API :", response);

        if (response.ok) {
            const data = await response.json();
            console.log("Photo ajoutée avec succès :", data);
            return true;
        } else {
            console.error("Erreur lors de l'ajout de la photo. Statut de la réponse :", response.status);
            return false;
        }
    } catch (error) {
        console.error("Erreur lors de la requête POST :", error);
        return false;
    }
}

function displayPhotoPreview(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        photoPreview.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

function refreshHomePage() {
    displayWorks();
}
function openAddPhotoModal() {
    modal.style.display = "none";
    addPhotoModal.style.display = "block";
}



function afficherImage() {
    var input = document.getElementById('imageInput');
    var imagePreview = document.getElementById('photoPreview');
    console.log(afficherImage)
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };

        reader.readAsDataURL(input.files[0]);
    }
}