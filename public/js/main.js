// Mobile nav toggle
const navToggle = document.querySelector('.nav__toggle');
const nav = document.querySelector('.nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Phone mask
const phoneInput = document.getElementById('telefone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    e.target.value = v;
  });
}

// Interest form submission
const form = document.getElementById('formInteresse');
const feedback = document.getElementById('formFeedback');

if (form && feedback) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
    feedback.className = 'form__feedback';
    feedback.textContent = '';

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();

    let hasError = false;
    if (!nome) {
      form.nome.classList.add('is-error');
      hasError = true;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.email.classList.add('is-error');
      hasError = true;
    }

    if (hasError) {
      feedback.className = 'form__feedback error';
      feedback.textContent = 'Por favor, preencha os campos obrigatórios corretamente.';
      return;
    }

    const submitBtn = form.querySelector('.form__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const res = await fetch('/api/interesse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          telefone: form.telefone.value.trim(),
          interesse: form.interesse.value,
          mensagem: form.mensagem.value.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.sucesso) {
        form.reset();
        feedback.className = 'form__feedback success';
        feedback.textContent = '✅ Recebemos seu interesse! Entraremos em contato em breve.';

        // GA4 event
        if (typeof gtag === 'function') {
          gtag('event', 'form_submit_interesse', { nome, email });
        }
      } else {
        throw new Error(data.erro || 'Erro ao enviar.');
      }
    } catch (err) {
      feedback.className = 'form__feedback error';
      feedback.textContent = '❌ ' + (err.message || 'Não foi possível enviar. Tente novamente.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Quero Saber Mais';
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.problem__card, .feature__card, .for-who__item, .pricing__card, .faq__item'
).forEach(el => observer.observe(el));
