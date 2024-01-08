// Sélectionnez le formulaire et les champs d'entrée
const form = document.querySelector('form'); // Sélectionne le formulaire du document
const emailInput = document.getElementById('email'); // Sélectionne le champ d'entrée pour l'email
const passwordInput = document.getElementById('password'); // Sélectionne le champ d'entrée pour le mot de passe

// Ajoutez un écouteur d'événements pour la soumission du formulaire
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Empêche le comportement par défaut du formulaire

  // Récupérez les valeurs des champs email et password
  const email = emailInput.value;
  const password = passwordInput.value;

  // Vérifiez si les champs sont vides
  if (!email || !password) {
    alert('Veuillez remplir tous les champs.'); // Alerte l'utilisateur si les champs sont vides
    return;
  }

  // Validation d'email simple (vous pouvez utiliser une expression régulière plus avancée)
  if (!isValidEmail(email)) {
    alert('Veuillez saisir une adresse e-mail valide.'); // Alerte l'utilisateur si l'email n'est pas valide
    return;
  }

  // Effectuez une requête POST pour l'authentification
  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // Gérez la réponse du serveur après l'authentification
      if (data.token) {
        // Authentification réussie : rediriger l'utilisateur vers la page d'accueil
        window.location.href = 'index.html';
        // Stockage du token dans le localStorage (assurez-vous que c'est sécurisé dans votre cas)
        localStorage.setItem('token', data.token);
      } else {
        // Authentification échouée : afficher un message d'erreur
        alert('Échec de la connexion. Veuillez vérifier vos informations.');
      }
    })
    .catch(error => {
      console.error('Erreur lors de l\'authentification :', error);
      alert('Une erreur est survenue lors de l\'authentification.');
    });
});

// Fonction de validation d'email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expression régulière simple pour valider un email
  return emailRegex.test(email);
}

// Sélectionnez le lien "Mot de passe oublié" et ajoutez un écouteur d'événements
const forgotPasswordLink = document.querySelector('.mp-forget'); // Sélectionne le lien "Mot de passe oublié"
forgotPasswordLink.addEventListener('click', function (event) {
  event.preventDefault();
  alert('Lien de réinitialisation du mot de passe envoyé par e-mail.'); // Alerte l'utilisateur sur le clic du lien
});
