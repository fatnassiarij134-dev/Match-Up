/* ===== Matching Up : compte + candidatures (SIMULÉ) =====
   IMPORTANT : prototype local pour une démonstration.
   - L'authentification, la vérification e-mail et la session sont SIMULÉES (pas sécurisées).
   - Les données restent dans le navigateur (localStorage), jamais envoyées nulle part.
   - Utilise uniquement un mot de passe FICTIF (ex. demo1234).
   - Pas de paiement ni de livraison : ce site met en relation candidats et entreprises. */

const CLES = { users: "mu_users", user: "mu_current_user", panier: "mu_cart", commandes: "mu_orders", attente: "mu_pending_email" };
const CODE_DEMO = "123456"; // code de vérification fictif

// ----- Stockage -----
function lire(cle, defaut) {
  try {
    const v = JSON.parse(localStorage.getItem(cle));
    return v === null ? defaut : v;
  } catch (e) { return defaut; }
}
function ecrire(cle, valeur) {
  try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) {}
}
function echapperHtml(t) {
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ----- Authentification simulée -----
// Faux "hash" de démonstration : PAS sécurisé, ne jamais utiliser en vrai.
function hashDemo(texte) {
  let h = 0;
  for (let i = 0; i < texte.length; i++) { h = (h * 31 + texte.charCodeAt(i)) | 0; }
  return "demo" + h;
}
function getUsers() { return lire(CLES.users, []); }
function saveUsers(liste) { ecrire(CLES.users, liste); }
function getCurrentUser() {
  const email = lire(CLES.user, null);
  return email ? (getUsers().find(function (u) { return u.email === email; }) || null) : null;
}
function login(email) { ecrire(CLES.user, email); }
function logout() {
  try { localStorage.removeItem(CLES.user); } catch (e) {}
  window.location.href = "index.html";
}
// Protection SIMULÉE : ce n'est PAS une vraie sécurité (n'importe qui peut modifier le JavaScript).
function requireLogin() {
  if (!getCurrentUser()) {
    const page = window.location.pathname.split("/").pop();
    window.location.href = "connexion.html?retour=" + encodeURIComponent(page);
    return false;
  }
  return true;
}

// ----- Candidatures (équivalent du panier) : une offre ne peut être ajoutée qu'une fois -----
function getCart() { return lire(CLES.panier, []); }
function saveCart(c) { ecrire(CLES.panier, c); updateCartCount(); }
function estDansPanier(titre) { return getCart().some(function (i) { return i.titre === titre; }); }
function ajouterAuPanier(offre) {
  if (estDansPanier(offre.titre)) return;
  const c = getCart();
  c.push({ titre: offre.titre, entreprise: offre.entreprise, type: offre.type, niveau: offre.niveau });
  saveCart(c);
}
function retirerDuPanier(titre) {
  saveCart(getCart().filter(function (i) { return i.titre !== titre; }));
}
function updateCartCount() {
  document.querySelectorAll(".compteur-panier").forEach(function (el) { el.textContent = getCart().length; });
}

// ----- Candidatures confirmées (équivalent des commandes) -----
function getOrders() { return lire(CLES.commandes, []); }
function saveOrder(o) { const l = getOrders(); l.unshift(o); ecrire(CLES.commandes, l); }

// ----- Navigation : ajoute Mes candidatures (compteur) et Compte sur toutes les pages -----
function initNav() {
  const nav = document.querySelector("header nav");
  if (!nav) return;
  const user = getCurrentUser();
  nav.insertAdjacentHTML("beforeend",
    '<a href="candidatures.html">Mes candidatures (<span class="compteur-panier">0</span>)</a>' +
    '<a href="' + (user ? "compte.html" : "connexion.html") + '">' +
    (user ? "👤 " + echapperHtml(user.prenom) : "Compte") + "</a>");
  updateCartCount();
}
initNav();
