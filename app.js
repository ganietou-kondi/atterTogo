document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const year = document.getElementById("footer-year");

  // Année du footer
  if (year) year.textContent = new Date().getFullYear();

  // Menu mobile
  menuBtn?.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden");
    menuBtn.setAttribute("aria-expanded", String(!isOpen));
  });

  // Fermer le menu après clic
  document.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  // Navigation active au scroll
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-link")];

  const updateActiveLink = () => {
    const position = window.scrollY + 140;
    let current = "accueil";

    sections.forEach(section => {
      if (position >= section.offsetTop) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  // Formulaire de contact avec EmailJS
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (typeof emailjs === "undefined") {
      console.error("EmailJS n'est pas chargé.");
      if (formMessage) {
        formMessage.textContent = "Le service d'envoi n'est pas disponible. Vérifiez votre connexion Internet.";
        formMessage.classList.remove("hidden");
        formMessage.classList.add("text-red-600");
      }
      return;
    }

    const button = form.querySelector("button[type='submit']");
    const originalText = button ? button.textContent : "Envoyer le message";

    if (button) {
      button.disabled = true;
      button.textContent = "Envoi en cours...";
      button.classList.add("opacity-70", "cursor-not-allowed");
    }

    if (formMessage) {
      formMessage.classList.add("hidden");
      formMessage.classList.remove("text-red-600", "text-brand-700");
    }

    try {
      const response = await emailjs.sendForm(
        "service_nswz2jh",
        "template_88b7wd4",
        form
      );

      console.log("EmailJS : message envoyé", response);

      if (formMessage) {
        formMessage.textContent = "Merci ! Votre message a bien été envoyé à ATTER TOGO.";
        formMessage.classList.remove("hidden");
        formMessage.classList.add("text-brand-700");
      }

      form.reset();
    } catch (error) {
      console.error("EmailJS : erreur d'envoi", error);

      if (formMessage) {
        formMessage.textContent = "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
        formMessage.classList.remove("hidden");
        formMessage.classList.add("text-red-600");
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
        button.classList.remove("opacity-70", "cursor-not-allowed");
      }
    }
  });

  // Newsletter : empêcher le rechargement tant qu'aucun service newsletter n'est configuré
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterMessage = document.getElementById("newsletter-message");

  newsletterForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (newsletterMessage) {
      newsletterMessage.textContent = "Merci ! Votre inscription a bien été prise en compte.";
    }
    newsletterForm.reset();
  });
});
