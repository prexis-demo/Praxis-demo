// Mini-Logik für das Demo-Formular (keine externe Abhängigkeit)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('demoForm');
  const success = document.getElementById('success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // In der Demo speichern wir nur lokal, um den Flow zu zeigen:
    const data = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem('praxis-demo-request', JSON.stringify(data));
    success.classList.remove('hidden');
    form.reset();
    // Smooth scroll zur Bestätigung
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
