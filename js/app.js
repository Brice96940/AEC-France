(function () {
  const VIEWS = {
    accueil: "view-accueil",
    ressources: "view-ressources",
    boutique: "view-boutique",
    premium: "view-premium",
    impact: "view-impact",
    proposer: "view-proposer",
    contact: "view-contact"
  };
  const TITLES = {
    accueil: "AEC France – Accueil | Orientation, CV, Méthodes & Parcours PRO",
    ressources: "AEC France – Ressources gratuites | CV, orientation, méthodes",
    boutique: "AEC France – Boutique | Packs Starter, PRO et Pro+",
    premium: "AEC France – Premium | Accès, activation et comparaison",
    impact: "AEC France – Impact | Objectifs, cap et résultats",
    proposer: "AEC France – Proposer une ressource",
    contact: "AEC France – Contact | WhatsApp, email, LinkedIn"
  };
  const DESCRIPTIONS = {
    accueil: "Plateforme AEC France : ressources gratuites, templates CV et méthodes concrètes pour étudiants et jeunes diplômés.",
    ressources: "Découvre les ressources gratuites AEC France : base Notion, méthodes, CV, mails et parcours guidés.",
    boutique: "Achète les packs AEC France sur Gumroad : Starter, Base PRO et Pro+ pour structurer orientation et candidatures.",
    premium: "Comprends comment accéder au Premium AEC France : achat, formulaire d’accès, activation et comparaison des offres.",
    impact: "Suis le cap, la vision et les indicateurs du projet AEC France.",
    proposer: "Soumets une ressource pertinente à AEC France via le formulaire dédié.",
    contact: "Contacte AEC France sur WhatsApp, email ou LinkedIn."
  };
  function updateSeo(name) {
    // LOT "audit et remplacement du dépôt public" : le canonical et og:url
    // restent volontairement intouchés par ce routeur. Les réécrire ici
    // (vers l'ancienne adresse github.io) annulait silencieusement, à
    // chaque navigation interne, le canonical croisé vers le site officiel
    // mis en place sur ce dépôt. Titre et description seuls restent
    // ajustés par vue, sans toucher au signal de canonicalisation.
    document.title = TITLES[name] || TITLES.accueil;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', DESCRIPTIONS[name] || DESCRIPTIONS.accueil);
  }
  function showView(name) {
    const safeName = VIEWS[name] ? name : 'accueil';
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    const target = document.getElementById(VIEWS[safeName]);
    if (target) target.classList.add('active');
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.classList.toggle('active', link.dataset.nav === safeName);
      link.setAttribute('aria-current', link.dataset.nav === safeName ? 'page' : 'false');
    });
    updateSeo(safeName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.AECTracking) {
      window.AECTracking.trackEvent('page_view', {
        page_name: safeName,
        page_location: location.href
      });
    }
  }
  function route() {
    const name = location.hash.replace(/^#\//, '') || 'accueil';
    showView(name);
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', route);
  const menuButton = document.getElementById('menuBtn');
  const menuPanel = document.getElementById('menuPanel');
  if (menuButton && menuPanel) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuPanel.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      if (window.AECTracking) window.AECTracking.trackEvent('menu_toggle', { state: isOpen ? 'open' : 'close' });
    });
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', () => {
        menuPanel.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
