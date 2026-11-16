/* ===== Matching Up : données + logique de matching ===== */

// 1) Offres d'entreprises (données de départ)
const OFFRES_PAR_DEFAUT = [
  {
    titre: "Stage en Marketing Digital",
    categorie: "marketing",
    entreprise: "Startup créative",
    type: "Stage",
    niveau: "Débutant accepté",
    description: "Participez à la création de contenu et aux campagnes digitales.",
    competences: ["Marketing", "Communication", "Création de contenu", "Réseaux sociaux"]
  },
  {
    titre: "Assistant en Informatique de Gestion",
    categorie: "gestion",
    entreprise: "Petite entreprise",
    type: "Stage",
    niveau: "Débutant accepté",
    description: "Découvrez les outils informatiques utilisés pour gérer une entreprise.",
    competences: ["Informatique", "Gestion", "Excel", "Bases de données"]
  },
  {
    titre: "Assistant Comptable",
    categorie: "gestion",
    entreprise: "Cabinet de comptabilité",
    type: "Emploi",
    niveau: "Débutant accepté",
    description: "Aidez à organiser les documents comptables et à suivre les opérations.",
    competences: ["Comptabilité", "Excel", "Organisation", "Facturation"]
  },
  {
    titre: "Stagiaire Business Intelligence",
    categorie: "bi",
    entreprise: "Société de conseil",
    type: "Stage",
    niveau: "Débutant accepté",
    description: "Construisez des tableaux de bord pour aider les décideurs.",
    competences: ["SQL", "Power BI", "Excel", "Analyse de données"]
  },
  {
    titre: "Développeur Web Junior",
    categorie: "web",
    entreprise: "Agence web",
    type: "Emploi",
    niveau: "1 an d'expérience",
    description: "Développez des pages web et des formulaires pour nos clients.",
    competences: ["HTML", "CSS", "JavaScript", "Git"]
  }
];

// 2) Candidats (pour la page entreprise)
const CANDIDATS = [
  {
    nom: "Salma B.",
    formation: "Licence Informatique de Gestion",
    competences: ["SQL", "Excel", "Power BI", "Analyse de données"]
  },
  {
    nom: "Yassine K.",
    formation: "Licence Marketing",
    competences: ["Marketing", "Communication", "Réseaux sociaux", "Création de contenu"]
  },
  {
    nom: "Mariem T.",
    formation: "Licence Comptabilité",
    competences: ["Comptabilité", "Excel", "Facturation", "Organisation"]
  },
  {
    nom: "Omar H.",
    formation: "Licence Informatique",
    competences: ["HTML", "CSS", "JavaScript", "Git", "SQL"]
  }
];

// 3) Fonctions utiles

// Enlève les accents, majuscules et espaces : "Création" -> "creation"
function normaliser(texte) {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Empêche d'injecter du HTML par erreur (sécurité)
function echapper(texte) {
  return String(texte)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Transforme "Excel, SQL , Power BI" en ["Excel", "SQL", "Power BI"]
function separerCompetences(texte) {
  return texte
    .split(",")
    .map(function (mot) {
      return mot.trim();
    })
    .filter(function (mot) {
      return mot !== "";
    });
}

// Coeur du matching : compare les compétences cherchées et celles du profil
// Score = compétences en commun / compétences cherchées x 100
function calculerMatching(competencesCherchees, competencesProfil) {
  const communes = competencesCherchees.filter(function (cherchee) {
    const a = normaliser(cherchee);
    return competencesProfil.some(function (propre) {
      const b = normaliser(propre);
      return a === b || (b.length >= 3 && a.includes(b)) || (a.length >= 3 && b.includes(a));
    });
  });

  const score = competencesCherchees.length === 0
    ? 0
    : Math.round((communes.length / competencesCherchees.length) * 100);

  return { score: score, communes: communes };
}

// 4) Sauvegarde dans le navigateur (localStorage)
const CLE_OFFRES = "matchingUpOffres";

function lireOffresPubliees() {
  try {
    return JSON.parse(localStorage.getItem(CLE_OFFRES)) || [];
  } catch (erreur) {
    return [];
  }
}

function publierOffre(offre) {
  const liste = lireOffresPubliees();
  liste.unshift(offre);
  try {
    localStorage.setItem(CLE_OFFRES, JSON.stringify(liste));
  } catch (erreur) {
    // Si le stockage est bloqué, l'offre reste visible seulement dans cette page
  }
}

// Offres publiées par les entreprises + offres de départ
function toutesLesOffres() {
  return lireOffresPubliees().concat(OFFRES_PAR_DEFAUT);
}

// 5) Catégories (une page dédiée par catégorie)
const CATEGORIES = [
  {
    id: "marketing",
    nom: "Marketing & Communication",
    fichier: "categorie-marketing.html",
    icone: "📣",
    description: "Contenu, réseaux sociaux et campagnes digitales.",
    sousTitre: "Des stages et des emplois pour créer du contenu, animer les réseaux sociaux et lancer des campagnes."
  },
  {
    id: "gestion",
    nom: "Gestion & Comptabilité",
    fichier: "categorie-gestion.html",
    icone: "💼",
    description: "Outils de gestion, documents comptables et suivi des opérations.",
    sousTitre: "Des offres pour découvrir les outils informatiques de gestion et l'organisation comptable d'une entreprise."
  },
  {
    id: "bi",
    nom: "Business Intelligence",
    fichier: "categorie-bi.html",
    icone: "📊",
    description: "Analyse de données, SQL et tableaux de bord.",
    sousTitre: "Des offres pour transformer les données en tableaux de bord utiles aux décideurs."
  },
  {
    id: "web",
    nom: "Développement web",
    fichier: "categorie-web.html",
    icone: "💻",
    description: "Pages web, formulaires et interfaces pour les clients.",
    sousTitre: "Des offres pour développer des sites et des interfaces web."
  }
];

// Offres d'une catégorie (offres de départ + offres publiées)
function offresDeCategorie(idCategorie) {
  return toutesLesOffres().filter(function (offre) {
    return offre.categorie === idCategorie;
  });
}

// Carte cliquable d'une catégorie (utilisée sur plusieurs pages)
function creerCarteCategorie(categorie) {
  const nombre = offresDeCategorie(categorie.id).length;
  return (
    '<div class="carte-categorie">' +
      '<span class="icone" aria-hidden="true">' + categorie.icone + "</span>" +
      "<h3>" + echapper(categorie.nom) + "</h3>" +
      "<p>" + echapper(categorie.description) + "</p>" +
      '<p class="aide">' + nombre + " offre(s)</p>" +
      '<a class="button" href="' + categorie.fichier + '">Découvrir</a>' +
    "</div>"
  );
}
