/* Maquette interactive - donnees PROVISOIRES. Vitrine fixe : histoires d'adoption (a remplacer par de vraies histoires), pas d'annonces qui changent. */
const HISTOIRES = [
  { nom: "Tibet", annee: "", photo: "img/tibe.jpg", mot: "Récupérée dans un village où les chats étaient livrés à eux-mêmes et mangeaient dans les poubelles. Aujourd'hui, elle a trouvé une famille pour la vie.", famille: "" },
  { nom: "Indy", annee: "2026", photo: "img/indy.jpg", mot: "Le frère de Tibet, 5 mois. Il vient de trouver sa famille : une famille réunionnaise tout juste installée en France.", famille: "" },
  { nom: "Galio, Mel, Bonney et Vivi", annee: "", photo: "img/portee-primeur.jpg", mot: "Recueillis par un primeur après l'accident de leur maman. Les quatre chatons ont été adoptés deux par deux : deux adoptions doubles, pour ne jamais être seuls.", famille: "" },
  { nom: "Tigrette et Jack", annee: "", photo: "img/tigrete-jack.jpg", mot: "Récupérés dans la rue, sur un site où vivaient beaucoup de chatons sauvages. Ils ont été adoptés ensemble et ne se quittent plus.", famille: "" },
];
const PRODUITS = [
  { nom: "T-shirt", prix: "Prix à fixer", desc: "Coton bio, logo des 3 Petits Chats." },
  { nom: "Tote bag", prix: "Prix à fixer", desc: "Pour les courses et les croquettes." },
  { nom: "Mug", prix: "Prix à fixer", desc: "Le café du matin, avec un chat dessus." },
  { nom: "Stickers", prix: "Prix à fixer", desc: "Pour l'ordi, la gourde, le frigo." },
];
const IMPACT = { 10: "10 € : environ une semaine de croquettes pour un chat.", 25: "25 € : participe à l'identification d'un chat.", 50: "50 € : participe à une stérilisation.", 100: "100 € : soigne un chat blessé ou malade." };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const photo = (t = "Photo") => `<div class="photo"><span>${esc(t)}</span></div>`;
const img = (h, t) => h.photo ? `<img class="photo-vraie" src="${h.photo}" alt="${esc(h.nom)}" loading="lazy">` : photo(t);
const dlg = $("#fiche");

function ouvrir(html) { $("#fiche-corps").innerHTML = html; dlg.showModal(); }
dlg?.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest(".fermer")) dlg.close(); });

function carteHistoire(h, i) {
  return `<article class="card cliquable" tabindex="0" data-i="${i}">${img(h)}<div class="t"><h3>${esc(h.nom)}</h3>
  <p class="meta">${h.annee ? "Adopté·e en " + esc(h.annee) : "A trouvé sa famille"}</p><p class="mot">« ${esc(h.mot)} »</p></div></article>`;
}
function ficheHistoire(h) {
  return `<div class="fiche">${img(h, "Photo de " + h.nom + " dans sa famille")}<div><p class="kicker">${h.annee ? "Adopté·e en " + esc(h.annee) : "A trouvé sa famille"}</p>
  <h2 id="fiche-titre">${esc(h.nom)}</h2><p class="mot">« ${esc(h.mot)} »</p>${h.famille ? `<p class="sub">${esc(h.famille)}</p>` : ""}
  <p>Vous aussi, offrez une famille à un chat : nos chats à l'adoption sont sur nos réseaux.</p>
  <a class="btn plein" href="adopter.html">Adopter un chat</a></div></div>`;
}
function brancher(conteneur, liste) {
  conteneur.innerHTML = liste.map(({ h, i }) => carteHistoire(h, i)).join("");
  $$(".cliquable", conteneur).forEach(el => {
    const go = () => ouvrir(ficheHistoire(HISTOIRES[el.dataset.i]));
    el.addEventListener("click", go);
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });
}
const toutes = HISTOIRES.map((h, i) => ({ h, i }));
const acc = $("#histoires-accueil"); if (acc) brancher(acc, toutes.slice(0, 4));
const liste = $("#histoires-liste"); if (liste) brancher(liste, toutes);

// Nous aider : choix du montant
const impact = $("#impact");
if (impact) {
  const maj = (m) => { impact.textContent = IMPACT[m]; $("#btn-don").textContent = `Donner ${m} € sur Leetchi`; };
  $$(".montant").forEach(b => b.addEventListener("click", () => { $$(".montant").forEach(x => x.classList.toggle("actif", x === b)); maj(b.dataset.m); }));
  maj(25);
}

// Boutique : produits + apercu
const prod = $("#produits");
if (prod) {
  prod.innerHTML = PRODUITS.map((p, i) => `<article class="card cliquable" tabindex="0" data-i="${i}">${photo(p.nom)}<div class="t"><h3>${esc(p.nom)}</h3><p class="meta">${esc(p.prix)}</p><span class="lien">Aperçu →</span></div></article>`).join("");
  $$(".cliquable", prod).forEach(el => {
    const p = PRODUITS[el.dataset.i];
    const go = () => ouvrir(`<div class="fiche">${photo(p.nom)}<div><p class="kicker">Boutique solidaire</p><h2 id="fiche-titre">${esc(p.nom)}</h2><p>${esc(p.desc)}</p><p><b>${esc(p.prix)}</b></p><p class="sub">Une partie de chaque vente est reversée à l'association.</p><a class="btn plein" href="#">Acheter sur la boutique</a></div></div>`);
    el.addEventListener("click", go);
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });
}

// Apparition douce au defilement
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vu"); io.unobserve(e.target); } }), { threshold: .12 });
  $$("main section, .chiffres").forEach(el => { el.classList.add("apparait"); io.observe(el); });
}

// Liens "appeler" : sur telephone, ouvre l'appli Telephone avec le numero pre-rempli (lien tel:) ;
// sur ordinateur, ouvre une petite fenetre avec le numero a copier.
const mobile = matchMedia("(pointer: coarse)").matches;
$$('a[href^="tel:"]').forEach(a => a.addEventListener("click", (e) => {
  if (mobile) return;
  e.preventDefault();
  ouvrir(`<div class="appel"><p class="kicker">Appeler l'association</p><h2 id="fiche-titre">${esc(LIENS.tel)}</h2>
  <p>Virginie, présidente</p><div class="ctas"><button class="btn plein" id="copier">Copier le numéro</button>
  <a class="btn contour" href="${a.getAttribute("href")}">Appeler avec une appli</a></div></div>`);
  $("#copier").addEventListener("click", async (ev) => {
    try { await navigator.clipboard.writeText(LIENS.tel); ev.target.textContent = "Numéro copié ✓"; }
    catch { ev.target.textContent = LIENS.tel; }
  });
}));

// Formulaire "ticket" : envoye a l'equipe par Web3Forms (service gratuit, sans serveur a nous).
// Tant que la cle n'est pas renseignee, repli sur la messagerie.
const ticket = $("#ticket");
ticket?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(ticket), retour = $("#retour"), btn = ticket.querySelector("button");
  if (f.get("botcheck")) return;                       // piege a robots
  const propre = (v, n) => String(v || "").replace(/[\r\n]+/g, " ").trim().slice(0, n);
  const num = "T-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  const sujet = `[Ticket ${num}] ${propre(f.get("sujet"), 80)}`;
  const message = `Ticket : ${num}\nSujet : ${propre(f.get("sujet"), 80)}\nNom : ${propre(f.get("nom"), 80)}\nE-mail : ${propre(f.get("email"), 120)}\nConcerne : ${propre(f.get("ref"), 120) || "-"}\n\n${String(f.get("message") || "").slice(0, 2000)}`;
  if (!LIENS.cle) { location.href = `mailto:${LIENS.equipe}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(message)}`; return; }
  btn.disabled = true; retour.textContent = "Envoi en cours…";
  try {
    const r = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: LIENS.cle, subject: sujet, from_name: "Site 3 Petits Chats", name: propre(f.get("nom"), 80), email: propre(f.get("email"), 120), replyto: propre(f.get("email"), 120), message }) });
    const j = await r.json();
    if (!j.success) throw new Error(j.message);
    ticket.reset(); retour.textContent = `Merci ! Votre ticket ${num} est bien envoyé. Nous vous répondons par e-mail.`;
    // suivi sans cookie : compte l'envoi du formulaire (aucune donnée personnelle transmise)
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "formulaire-envoye", title: sujet, event: true });
  } catch { retour.textContent = `L'envoi n'a pas marché. Écrivez-nous à ${LIENS.equipe} en indiquant ${num}.`; }
  finally { btn.disabled = false; }
});

// Compteur "familles accompagnees" : estimation calculee depuis la creation (27/07/2020),
// 0 a 2 par jour (moyenne ~0,82, soit ~300 adoptions par an d apres la presidente). Tirage FIXE pour chaque jour :
// meme nombre pour tous les visiteurs et a chaque visite, il augmente seul chaque jour.
const compteur = $("#compteur");
if (compteur) {
  const debut = Date.UTC(2020, 6, 27), jour = 86400000;
  const auj = Math.floor((Date.now() - debut) / jour);
  const parJour = (n) => { let x = (n * 2654435761) >>> 0; x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0; x = (x ^ (x >>> 13)) >>> 0; return [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2][x % 11]; };
  let total = 0; for (let n = 0; n <= auj; n++) total += parJour(n);
  const fmt = (v) => v.toLocaleString("fr-FR");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) compteur.textContent = fmt(total);
  else {
    compteur.textContent = fmt(total);   // valeur finale affichee d'office, animation en bonus
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now(), dur = 1600;
      const id = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / dur); compteur.textContent = fmt(Math.round(total * (1 - Math.pow(1 - k, 3)))); if (k >= 1) clearInterval(id); }, 30);
    });
    io.observe(compteur);
  }
}

// Boutique = site externe (Printify / Shopify) : nouvel onglet ; tant que l'adresse n'existe pas, petit message.
document.querySelectorAll('a[href^="http"]').forEach((a) => { if (!a.href.startsWith(location.origin)) { a.target = "_blank"; a.rel = "noopener"; } });
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href="#bientot"]'); if (!a) return; e.preventDefault();
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.textContent = "La boutique ouvre très bientôt !"; t.classList.add("vu"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("vu"), 2600);
});
