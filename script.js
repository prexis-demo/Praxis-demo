document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('demoForm');
  const success = document.getElementById('success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      // Demo: lokal speichern, kein Versand
      try { localStorage.setItem('praxis-demo-request', JSON.stringify(data)); } catch(e){}
      success.classList.remove('hidden');
      form.reset();
      success.scrollIntoView({behavior:'smooth', block:'center'});
    });
  }
});
