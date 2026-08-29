// Littlebrook Consulting — site scripts
// Handles the mobile nav toggle and front-end-only contact form validation.

document.addEventListener('DOMContentLoaded', function () {
  initNavToggle();
  initContactForm();
});

/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close the menu when a link is chosen
  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ---------- Contact form validation (front-end only) ---------- */
function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var fields = {
    name: {
      input: form.querySelector('#name'),
      error: form.querySelector('#name-error'),
      validate: function (value) {
        return value.trim().length >= 2 ? '' : 'Please enter your name.';
      }
    },
    email: {
      input: form.querySelector('#email'),
      error: form.querySelector('#email-error'),
      validate: function (value) {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value.trim()) ? '' : 'Please enter a valid email address.';
      }
    },
    message: {
      input: form.querySelector('#message'),
      error: form.querySelector('#message-error'),
      validate: function (value) {
        return value.trim().length >= 10 ? '' : 'Please enter a message of at least 10 characters.';
      }
    }
  };

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    field.input.addEventListener('blur', function () {
      validateField(field);
    });
    field.input.addEventListener('input', function () {
      if (field.input.closest('.form-group').classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var isValid = true;
    Object.keys(fields).forEach(function (key) {
      if (!validateField(fields[key])) {
        isValid = false;
      }
    });

    if (!isValid) {
      status.textContent = 'Please correct the highlighted fields and try again.';
      status.classList.remove('success');
      status.classList.add('visible');
      return;
    }

    // Front-end only: no backend is wired up. Simulate a successful send.
    status.textContent = 'Thanks for reaching out — we will be in touch within one business day.';
    status.classList.add('success', 'visible');
    form.reset();
  });

  function validateField(field) {
    var message = field.validate(field.input.value);
    var group = field.input.closest('.form-group');

    if (message) {
      group.classList.add('has-error');
      field.error.textContent = message;
      return false;
    }

    group.classList.remove('has-error');
    field.error.textContent = '';
    return true;
  }
}
