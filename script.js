// =========================================================
// script.js — hela sidans logik, uppdelad i tydliga block.
// Öppna webbläsarens konsol (F12 → Console) om något krånglar.
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // =========================================================
  // 1. LADDNINGSSKÄRM
  // Simulerar en progressbar och döljer sedan skärmen.
  // =========================================================
  const loadingScreen = document.getElementById("loadingScreen");
  const loadingBarFill = document.getElementById("loadingBarFill");
  const loadingStatus = document.getElementById("loadingStatus");

  // Lås scroll medan laddningsskärmen visas
  document.body.style.overflow = "hidden";

  const LOADING_DURATION_MS = 2400;
  const loadingStartedAt = performance.now();
  const loadingInterval = setInterval(() => {
    const elapsed = performance.now() - loadingStartedAt;
    const progress = Math.min((elapsed / LOADING_DURATION_MS) * 100, 100);
    loadingBarFill.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(loadingInterval);
      loadingStatus.textContent = "Klar!";
      loadingScreen.classList.add("is-hidden");
      document.body.style.overflow = "";
    }
  }, 100);

  // =========================================================
  // 1b. KINETISK TYPOGRAFI
  // Delar upp hero-titelns text ("MASUUD ALI") i en <span> per
  // bokstav, så CSS (.kinetic-letter i style.css) kan animera in
  // varje bokstav för sig med en liten fördröjning mellan dem.
  // =========================================================
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle && !prefersReducedMotion) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = ""; // töm elementet, vi bygger upp det igen med spans

    originalText.split("").forEach((char, index) => {
      const letterSpan = document.createElement("span");
      letterSpan.className = "kinetic-letter";
      // Mellanslag måste vara ett "non-breaking space", annars
      // kollapsar webbläsaren bort det osynliga mellanslaget
      letterSpan.textContent = char === " " ? "\u00A0" : char;
      // Ju längre fram bokstaven är i ordet, desto senare startar den
      letterSpan.style.animationDelay = `${300 + index * 35}ms`;
      heroTitle.appendChild(letterSpan);
    });
  }

  // =========================================================
  // 2. HEADER: byt stil vid scroll
  // =========================================================
  const siteHeader = document.getElementById("siteHeader");
  function updateHeaderStyle() {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", updateHeaderStyle, { passive: true });
  updateHeaderStyle();

  // =========================================================
  // 4. MOBILMENY
  // =========================================================
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen);
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", false);
    });
  });

  // =========================================================
  // 5. AKTIV NAV-LÄNK VID SCROLL
  // Håller koll på vilken sektion som är synlig och markerar
  // motsvarande länk i menyn.
  // =========================================================
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.dataset.nav === id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" }); // triggar när sektionen är nära mitten av skärmen

  sections.forEach((section) => navObserver.observe(section));

  // =========================================================
  // 6. SCROLL REVEAL (fade / slide-up / slide-right / scale)
  // Varje element med klassen .reveal animeras in när det blir
  // synligt. data-delay styr en liten fördröjning för staggered-känsla.
  // =========================================================
  const revealItems = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    // Visa allt direkt, ingen animation
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.delay || 0);
          setTimeout(() => entry.target.classList.add("is-visible"), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealItems.forEach((el) => revealObserver.observe(el));
  }

  // =========================================================
  // 7. KONTAKTFORMULÄR: validering + Formspree-inskickning
  // =========================================================
  const contactForm = document.getElementById("contactForm");
  const formSubmitBtn = document.getElementById("formSubmitBtn");
  const formStatus = document.getElementById("formStatus");

  const fields = {
    name: { input: document.getElementById("name"), error: document.getElementById("nameError") },
    email: { input: document.getElementById("email"), error: document.getElementById("emailError") },
    message: { input: document.getElementById("message"), error: document.getElementById("messageError") },
  };

  function setFieldError(field, message) {
    field.input.closest(".form-field").classList.toggle("has-error", Boolean(message));
    field.error.textContent = message || "";
  }

  function isValidEmail(value) {
    // Enkel men tillräcklig kontroll av e-postformat
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateForm() {
    let valid = true;

    if (!fields.name.input.value.trim()) {
      setFieldError(fields.name, "Vänligen fyll i ditt namn.");
      valid = false;
    } else {
      setFieldError(fields.name, "");
    }

    if (!isValidEmail(fields.email.input.value.trim())) {
      setFieldError(fields.email, "Vänligen ange en giltig e-postadress.");
      valid = false;
    } else {
      setFieldError(fields.email, "");
    }

    if (!fields.message.input.value.trim()) {
      setFieldError(fields.message, "Vänligen skriv ett meddelande.");
      valid = false;
    } else {
      setFieldError(fields.message, "");
    }

    return valid;
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      formStatus.textContent = "";
      formStatus.className = "form-status";
      return;
    }

    formSubmitBtn.disabled = true;
    formSubmitBtn.textContent = "Skickar meddelande...";
    formStatus.textContent = "";
    formStatus.className = "form-status";

    const subject = encodeURIComponent("Meddelande från Masuud Ali - Portfolio");
    const body = encodeURIComponent(
      `Namn: ${fields.name.input.value.trim()}\nE-post: ${fields.email.input.value.trim()}\n\n${fields.message.input.value.trim()}`
    );
    window.location.href = `${contactForm.action}?subject=${subject}&body=${body}`;
    formStatus.textContent = "Din e-postapp öppnas med meddelandet färdigt.";
    formStatus.className = "form-status is-success";
    formSubmitBtn.disabled = false;
    formSubmitBtn.textContent = "Skicka meddelande";
  });

  // =========================================================
  // 8. TILL TOPPEN-KNAPP
  // =========================================================
  document.getElementById("backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  // =========================================================
  // 9. ÅRTAL I FOOTERN
  // =========================================================
  document.getElementById("year").textContent = new Date().getFullYear();

  // Effekterna nedan (cursor-glow, magnetiska knappar, 3D-tilt) är
  // rena "extra touch"-detaljer. De körs bara på datorer med mus
  // (inte mobiler/pekskärmar) och bara om användaren inte bett om
  // minskad rörelse — annars är de bara avstängda, resten av sidan
  // fungerar exakt som vanligt.
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  // =========================================================
  // 10. CURSOR-GLOW
  // Ett runt ljussken (.cursor-glow i style.css) som följer musen.
  // Vi flyttar bara elementets position — CSS sköter själva utseendet.
  // =========================================================
  if (hasFinePointer && !prefersReducedMotion) {
    const cursorGlow = document.getElementById("cursorGlow");

    window.addEventListener("mousemove", (event) => {
      cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
      cursorGlow.classList.add("is-active");
    });

    // Dölj glowen när musen lämnar webbläsarfönstret helt
    document.addEventListener("mouseleave", () => {
      cursorGlow.classList.remove("is-active");
    });
  }

  // =========================================================
  // 11. MAGNETISKA KNAPPAR
  // Knapparna "dras" lätt mot muspekaren när den är nära — som om
  // knappen har en svag magnet i sig. Vi räknar ut hur långt musen
  // är från knappens mitt och flyttar knappen en bråkdel av det.
  // =========================================================
  if (hasFinePointer && !prefersReducedMotion) {
    document.querySelectorAll(".btn").forEach((button) => {
      button.addEventListener("mousemove", (event) => {
        const rect = button.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;
        // 0.25 = styrkan på magneten. Högre värde = knappen rör sig mer.
        button.style.transform = `translate(${offsetX * 0.25}px, ${offsetY * 0.25}px)`;
      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = ""; // hoppa tillbaka till ursprungsläget
      });
    });
  }

  // =========================================================
  // 12. PROFILBILDENS TILT + SCROLL-ANIMATION
  // Två separata rörelser kombineras till EN transform-sträng:
  //   a) TILT — bilden lutar sig lätt i 3D mot muspekaren (bara i hero)
  //   b) SCROLL — bilden glider uppåt, krymper och tonas bort när
  //      man scrollar förbi hero-sektionen (som att den "sjunker in
  //      i bakgrunden")
  // Vi sparar värdena i variabler och räknar om HELA transformen
  // varje gång något av dem ändras, annars skulle den ena rörelsen
  // skriva över den andra.
  // =========================================================
  const profileFrame = document.getElementById("profileFrame");
  const heroSection = document.getElementById("hero");

  if (profileFrame && heroSection && !prefersReducedMotion) {
    let tiltX = 0;      // rotation kring Y-axeln (styrs av musens X-position)
    let tiltY = 0;      // rotation kring X-axeln (styrs av musens Y-position)
    let scrollOffsetY = 0;
    let scrollScale = 1;
    let scrollOpacity = 1;

    function applyProfileTransform() {
      profileFrame.style.transform =
        `translateY(${scrollOffsetY}px) scale(${scrollScale}) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
      profileFrame.style.opacity = scrollOpacity;
    }

    // --- a) TILT vid musrörelse (bara på skärmar med riktig mus) ---
    if (hasFinePointer) {
      heroSection.addEventListener("mousemove", (event) => {
        const rect = heroSection.getBoundingClientRect();
        // relX/relY går från -0.5 (vänster/topp) till 0.5 (höger/botten)
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        const MAX_TILT_DEGREES = 16;
        tiltX = relX * MAX_TILT_DEGREES;
        tiltY = -relY * MAX_TILT_DEGREES;
        applyProfileTransform();
      });

      heroSection.addEventListener("mouseleave", () => {
        tiltX = 0;
        tiltY = 0;
        applyProfileTransform();
      });
    }

    // --- b) PARALLAX + KRYMP vid scroll ---
    function updateProfileScrollEffect() {
      const heroHeight = heroSection.offsetHeight;
      // progress går från 0 (högst upp i hero) till 1 (helt scrollad förbi hero)
      const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);

      scrollOffsetY = progress * 60;       // glider 60px uppåt
      scrollScale = 1 - progress * 0.2;    // krymper till 80% av storleken
      scrollOpacity = 1 - progress * 0.8;  // tonas nästan bort

      applyProfileTransform();
    }

    window.addEventListener("scroll", updateProfileScrollEffect, { passive: true });
    updateProfileScrollEffect(); // kör en gång direkt, ifall sidan laddas mitt i scroll-läge
  }

});
