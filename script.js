  const form = document.getElementById('inquiry-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusMsg = document.getElementById('status-msg');
  const successPanel = document.getElementById('success-panel');

  const fields = {
    name: { el: document.getElementById('name'), required: true, label: 'your name' },
    email: { el: document.getElementById('email'), required: true, label: 'a valid email address' },
    description: { el: document.getElementById('description'), required: true, label: 'a short project description' },
    budget: { el: document.getElementById('budget'), required: true, label: 'an estimated budget' }
  };

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function clearError(key) {
    fields[key].el.classList.remove('invalid');
    document.getElementById('error-' + key).textContent = '';
  }

  function setError(key, message) {
    fields[key].el.classList.add('invalid');
    document.getElementById('error-' + key).textContent = message;
  }

  function validateField(key) {
    const field = fields[key];
    const value = field.el.value.trim();

    if (field.required && value === '') {
      setError(key, 'Please provide ' + field.label + '.');
      return false;
    }

    if (key === 'email' && value !== '' && !isValidEmail(value)) {
      setError(key, 'Please enter a valid email address.');
      return false;
    }

    clearError(key);
    return true;
  }

  // Live-clear errors as the person fixes a field
  Object.keys(fields).forEach(function (key) {
    const el = fields[key].el;
    el.addEventListener('input', function () { validateField(key); });
    el.addEventListener('change', function () { validateField(key); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusMsg.className = 'status-msg';
    statusMsg.textContent = '';

    let allValid = true;
    Object.keys(fields).forEach(function (key) {
      if (!validateField(key)) allValid = false;
    });

    if (!allValid) {
      statusMsg.className = 'status-msg';
      return;
    }

    const payload = {
      name: fields.name.el.value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: fields.email.el.value.trim(),
      description: fields.description.el.value.trim(),
      budget: fields.budget.el.value,
      _subject: 'New project inquiry — South Mountain Woodworking',
      _replyto: fields.email.el.value.trim()
    };

    // Keep the hidden reply-to field in sync so Formspree sets the
    // "reply to" address to the inquirer's own email.
    document.getElementById('replyto-field').value = payload.email;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // ---------------------------------------------------------------
    // Sends the inquiry to james@southmountainwoodworking.com via
    // Formspree. Set-up required (one time, a few minutes):
    //   1. Create a free account at https://formspree.io
    //   2. Create a new form and set its recipient email to
    //      james@southmountainwoodworking.com — Formspree will send
    //      a verification email to that address; confirm it.
    //   3. Copy the form endpoint Formspree gives you
    //      (looks like https://formspree.io/f/abcdwxyz) and paste it
    //      into the form tag's action attribute above, replacing
    //      YOUR_FORM_ID.
    // Every submission will then arrive by email at that address,
    // with the reply-to set to whoever filled out the form.
    // ---------------------------------------------------------------
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.classList.add('hidden');
          successPanel.classList.add('visible');
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function () {
        statusMsg.className = 'status-msg';
        statusMsg.style.color = '#8C3B2E';
        statusMsg.style.display = 'block';
        statusMsg.textContent = 'Something went wrong sending your message. Please try again or email us directly at James@southmountainwoodworking.com.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Inquiry';
      });
  });
