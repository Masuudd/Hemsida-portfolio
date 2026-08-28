// =========================================================
// script.js
// Varje del är kommenterad så du förstår VAD den gör och VARFÖR.
// Tips: öppna webbläsarens konsol (F12 → "Console") om något
// inte fungerar — felmeddelanden dyker upp där.
// =========================================================

// Vänta tills hela HTML-sidan är inläst innan vi kör vår kod.
// Annars kan JavaScript försöka hitta element som inte finns än.
document.addEventListener("DOMContentLoaded", () => {

  // ---------- 1. Mobilmeny (hamburgarmeny) ----------
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", () => {
    // classList.toggle lägger till klassen om den saknas,
    // och tar bort den om den redan finns. Perfekt för av/på.
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  // Stäng menyn automatiskt när man klickar en länk (bra på mobil)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
    });
  });

  // ---------- 2. Statuskortet i hero-sektionen ----------
  // Visas efter en kort fördröjning, som om ett kort "läggs fram".
  const statusCard = document.getElementById("statusCard");
  setTimeout(() => {
    statusCard.style.display = "inline-flex";
  }, 600);

  // ---------- 3. Flip-cards för projekt ----------
  // Varje projektkort vänder sig när man klickar på det.
  const flipCards = document.querySelectorAll(".flip-card");
  flipCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });
  });

  // ---------- 4. Animerade "kunskaps-staplar" ----------
  // Vi vill att stapeln fylls i FÖRST när man scrollar fram till den,
  // inte direkt när sidan laddas. Det gör IntersectionObserver:
  // den "håller koll" på om ett element är synligt i fönstret.
  const skillCards = document.querySelectorAll(".skill-card");

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const level = card.dataset.level; // hämtar t.ex. data-level="70"
        const fill = card.querySelector(".skill-fill");
        fill.style.width = level + "%";

        // Vi behöver bara animera varje kort en gång,
        // så vi slutar observera det efteråt.
        skillObserver.unobserve(card);
      }
    });
  }, { threshold: 0.4 }); // 0.4 = kortet ska synas till 40 % innan det triggas

  skillCards.forEach((card) => skillObserver.observe(card));

  // ---------- 5. Kopiera e-post med ett klick ----------
  const copyBtn = document.getElementById("copyEmailBtn");
  const copyFeedback = document.getElementById("copyFeedback");

  copyBtn.addEventListener("click", async () => {
    const email = copyBtn.dataset.email; // hämtar från data-email="..."
    try {
      // navigator.clipboard är webbläsarens inbyggda "klippbord"-API
      await navigator.clipboard.writeText(email);
      copyFeedback.textContent = "E-postadressen är kopierad! ✓";
    } catch (err) {
      // Om kopiering skulle misslyckas (t.ex. gammal webbläsare)
      copyFeedback.textContent = "Kunde inte kopiera — maila mig manuellt.";
    }

    // Rensa meddelandet efter ett par sekunder
    setTimeout(() => { copyFeedback.textContent = ""; }, 3000);
  });

  // ---------- 6. Årtal i footern ----------
  // Så du aldrig behöver uppdatera copyright-året manuellt.
  document.getElementById("year").textContent = new Date().getFullYear();

});
