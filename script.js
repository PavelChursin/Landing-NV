const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const detailedForm = document.querySelector("#lead-form");
const detailedSuccessMessage = document.querySelector("#success-message");
const commentField = document.querySelector("[data-comment]");
const modal = document.querySelector("[data-modal]");
const modalInterest = document.querySelector("[data-modal-interest]");
const modalTitle = document.querySelector("#modal-title");

const successText = "Спасибо! Мы получили заявку и свяжемся с вами, чтобы обсудить ваш KYC-сценарий";

const interestTitles = {
  "Демо NeuroVision": "Получить демо NeuroVision",
  "Аудит KYC-flow": "Получить аудит KYC-flow",
  "Демо face match": "Получить демо face match",
  "Тестовый сценарий проверки документов": "Проверить документы на тестовом сценарии",
  "AML-сценарий": "Обсудить AML-сценарий",
  "Fraud-аудит": "Получить fraud-аудит",
  "Консультация по KYC-сценарию": "Получить консультацию по вашему KYC-сценарию",
  "Onboarding-flow": "Посмотреть KYC-flow для вашего онбординга",
  "Техническая консультация": "Получить техническую консультацию",
  "Security и integration overview": "Запросить security и integration overview",
  "Пилот без полной миграции": "Запустить пилот без полной миграции",
  "Пилот NeuroVision": "Запросить пилот NeuroVision",
};

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

const closeMenu = () => {
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

const validateField = (field) => {
  const isValid = field.checkValidity();
  field.classList.toggle("is-invalid", !isValid);
  return isValid;
};

const prepareValidation = (form) => {
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) {
        validateField(field);
      }
    });
  });
};

const handleFormSubmit = (form, successElement, resetButtonText) => {
  successElement?.classList.remove("is-visible");

  const requiredFields = Array.from(form.querySelectorAll("[required]"));
  const isValid = requiredFields.map(validateField).every(Boolean);

  if (!isValid) {
    form.querySelector(".is-invalid")?.focus();
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Отправляем...";

  window.setTimeout(() => {
    if (successElement) {
      successElement.textContent = successText;
      successElement.classList.add("is-visible");
    }
    form.reset();
    submitButton.disabled = false;
    submitButton.textContent = resetButtonText;
  }, 550);
};

const openModal = (interest = "Демо NeuroVision") => {
  closeMenu();
  modalInterest.value = interest;
  modalTitle.textContent = interestTitles[interest] || "Получить демо NeuroVision";
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  modal.querySelector("input[name='name']")?.focus();
};

const closeModal = () => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
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
    closeMenu();
  });
});

document.querySelectorAll("[data-modal-open]").forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.getAttribute("data-interest"));
  });
});

document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

document.querySelectorAll("[data-mini-form]").forEach((form) => {
  prepareValidation(form);
  const successElement = form.querySelector(".mini-success");
  const submitButton = form.querySelector("button[type='submit']");
  const originalButtonText = submitButton.textContent;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleFormSubmit(form, successElement, originalButtonText);
  });
});

prepareValidation(detailedForm);

detailedForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleFormSubmit(detailedForm, detailedSuccessMessage, "Получить демо");
  if (commentField?.value.trim()) {
    commentField.value = commentField.value.trim();
  }
});
