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

  // =========================================================
  // 2. INTRO-MUSIK (10 sekunder, ingen loop)
  // =========================================================
  const introAudio = document.getElementById("introAudio");
  const enableSoundBtn = document.getElementById("enableSoundBtn");
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const soundIcon = document.getElementById("soundIcon");

  const MUSIC_DURATION_MS = 10000;
  let musicTimer = null;

  const loadingStartedAt = performance.now();
  const loadingInterval = setInterval(() => {
    const elapsed = performance.now() - loadingStartedAt;
    const progress = Math.min((elapsed / MUSIC_DURATION_MS) * 100, 100);
    loadingBarFill.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(loadingInterval);
      loadingStatus.textContent = "Klar!";
      loadingScreen.classList.add("is-hidden");
      document.body.style.overflow = "";
    }
  }, 100);

  function stopIntroMusic() {
    introAudio.pause();
    introAudio.currentTime = 0;
    if (musicTimer) clearTimeout(musicTimer);
    soundIcon.textContent = "🔈";
  }

  function playIntroMusic() {
    introAudio.currentTime = 0;
    const playPromise = introAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          soundIcon.textContent = "🔊";
          enableSoundBtn.hidden = true;
          musicTimer = setTimeout(stopIntroMusic, MUSIC_DURATION_MS);
        })
        .catch(() => {
          // Webbläsaren blockerade autoplay — visa fallback-knappen.
          // Vi försöker INTE kringgå detta, det är webbläsarens säkerhetsregel.
          enableSoundBtn.hidden = false;
        });
    }
  }

  // Försök spela automatiskt när sidan är redo (bara om filen faktiskt finns)
  introAudio.addEventListener("error", () => {
    // Ingen musikfil hittades — det är okej, sidan fungerar ändå.
    enableSoundBtn.hidden = true;
  });
  playIntroMusic();

  enableSoundBtn.addEventListener("click", () => {
    playIntroMusic();
  });

  // Ett klick på laddningsskärmen räknas som användarinteraktion och kan låsa upp ljudet.
  loadingScreen.addEventListener("click", playIntroMusic);

  // Permanent ljudkontroll: klick startar/stoppar musiken manuellt
  soundToggleBtn.addEventListener("click", () => {
    if (introAudio.paused) {
      playIntroMusic();
    } else {
      stopIntroMusic();
    }
  });

  // =========================================================
  // 3. HEADER: byt stil vid scroll
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

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formStatus.textContent = "Tack! Ditt meddelande har skickats.";
        formStatus.className = "form-status is-success";
        contactForm.reset();
      } else {
        formStatus.textContent = "Det gick inte att skicka meddelandet. Försök igen.";
        formStatus.className = "form-status is-error";
      }
    } catch (err) {
      formStatus.textContent = "Det gick inte att skicka meddelandet. Försök igen.";
      formStatus.className = "form-status is-error";
    } finally {
      formSubmitBtn.disabled = false;
      formSubmitBtn.textContent = "Skicka meddelande";
    }
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

});
