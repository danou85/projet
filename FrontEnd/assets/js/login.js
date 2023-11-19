const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  // Validation d'email simple (vous pouvez utiliser une expression régulière plus avancée)
  if (!isValidEmail(email)) {
    alert('Veuillez saisir une adresse e-mail valide.');
    return;
  }

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

const forgotPasswordLink = document.querySelector('.mp-forget');
forgotPasswordLink.addEventListener('click', function (event) {
  event.preventDefault();
  alert('Lien de réinitialisation du mot de passe envoyé par e-mail.');
});

function isValidEmail(email) {
  // Validation d'email simple (vous pouvez utiliser une expression régulière plus avancée)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
