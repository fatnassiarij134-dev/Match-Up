/* ===== Matching Up : affichage d'une page catégorie ===== */
const idCategorie = document.body.dataset.categorie;
const conteneurOffres = document.getElementById("liste-offres");
const conteneurAutres = document.getElementById("autres-categories");

function creerCarteOffre(offre) {
  const competences = offre.competences
    .map(function (competence) {
      return '<span class="tag">' + echapper(competence) + "</span>";
    })
    .join("");

  // Le lien ouvre l'espace candidats avec le titre de l'offre dans la recherche
  const lien = "candidat.html?q=" + encodeURIComponent(offre.titre);

  return (
    '<article class="job-card">' +
      "<h3>" + echapper(offre.titre) + "</h3>" +
      "<p><strong>Entreprise :</strong> " + echapper(offre.entreprise) + "</p>" +
      '<span class="tag">' + echapper(offre.type) + "</span>" +
      '<span class="tag">' + echapper(offre.niveau) + "</span>" +
      "<p>" + echapper(offre.description) + "</p>" +
      '<p class="sous-titre">Compétences recherchées :</p>' +
      competences +
      '<p><a class="button" href="' + lien + '">Voir l\'offre « ' + echapper(offre.titre) + ' »</a></p>' +
    "</article>"
  );
}

const offres = offresDeCategorie(idCategorie);

if (offres.length === 0) {
  conteneurOffres.innerHTML =
    "<p>Aucune offre dans cette catégorie pour le moment. Reviens bientôt !</p>";
} else {
  conteneurOffres.innerHTML = offres.map(creerCarteOffre).join("");
}

// "Découvrez aussi" : les autres catégories (pas celle déjà ouverte)
conteneurAutres.innerHTML = CATEGORIES
  .filter(function (categorie) { return categorie.id !== idCategorie; })
  .slice(0, 3)
  .map(creerCarteCategorie)
  .join("");
