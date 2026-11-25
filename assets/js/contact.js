/**
 * Formulaire de contact sans serveur (compatible GitHub Pages) :
 * le message est préparé puis ouvert dans la messagerie ou dans WhatsApp.
 */
(function () {
  "use strict";

  const EMAIL = "mbalastns@gmail.com";
  const WHATSAPP = "243812779730";

  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = form.querySelector(".form-status");
  let channel = "email";

  form.querySelectorAll("button[data-channel]").forEach((btn) => {
    btn.addEventListener("click", () => {
      channel = btn.getAttribute("data-channel");
    });
  });

  function setStatus(text, type) {
    status.textContent = text;
    status.className = "form-status" + (type ? " " + type : "");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const name = (data.name || "").trim();
    const message = (data.message || "").trim();
    const email = (data.email || "").trim();

    if (!name || !message) {
      setStatus("Merci d'indiquer au moins votre nom et votre message.", "error");
      (name ? form.querySelector("#cf-message") : form.querySelector("#cf-name")).focus();
      return;
    }
    if (email && !form.querySelector("#cf-email").checkValidity()) {
      setStatus("L'adresse email ne semble pas valide.", "error");
      form.querySelector("#cf-email").focus();
      return;
    }

    const subject = `[${data.type}] Demande de ${name}`;
    const lines = [
      `Bonjour D'elohim,`,
      "",
      message,
      "",
      "—",
      `Nom : ${name}`,
      data.company ? `Entreprise : ${data.company.trim()}` : null,
      email ? `Email : ${email}` : null,
      `Type de projet : ${data.type}`,
    ].filter((l) => l !== null);
    const body = lines.join("\n");

    if (channel === "whatsapp") {
      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(subject + "\n\n" + body)}`;
      window.open(url, "_blank", "noopener");
      setStatus("WhatsApp s'ouvre avec votre message prêt à être envoyé.", "ok");
    } else {
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("Votre messagerie s'ouvre avec le message prêt à être envoyé.", "ok");
    }
  });
})();
