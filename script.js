const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("#lead-form");
const successMessage = document.querySelector("#success-message");
const commentField = document.querySelector("[data-comment]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");

    const interest = link.getAttribute("data-interest");
    if (interest && commentField) {
      const currentValue = commentField.value.trim();
      commentField.value = currentValue ? `${currentValue}\n${interest}` : interest;
    }
  });
});

const validateField = (field) => {
  const isValid = field.checkValidity();
  field.classList.toggle("is-invalid", !isValid);
  return isValid;
};

form.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    if (field.classList.contains("is-invalid")) {
      validateField(field);
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  successMessage.classList.remove("is-visible");

  const requiredFields = Array.from(form.querySelectorAll("[required]"));
  const validationResults = requiredFields.map(validateField);
  const isValid = validationResults.every(Boolean);

  if (!isValid) {
    const firstInvalid = form.querySelector(".is-invalid");
    firstInvalid?.focus();
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Отправляем...";

  window.setTimeout(() => {
    successMessage.classList.add("is-visible");
    form.reset();
    submitButton.disabled = false;
    submitButton.textContent = "Получить демо";
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 650);
});
