document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rezeptForm');
  const typeSelect = document.getElementById('typeSelect');
  const rezeptFields = document.getElementById('rezeptFields');
  const uebFields = document.getElementById('ueberwFields');
  const status = document.getElementById('status');
  const btn = document.getElementById('submitBtn');
  const spinner = btn?.querySelector('.btn-spinner');
  const label = btn?.querySelector('.btn-label');

  // dynamische Felder
  typeSelect.addEventListener('change', () => {
    const v = typeSelect.value;
    rezeptFields.classList.toggle('hidden', !(v === 'Rezept' || v === 'Beides'));
    uebFields.classList.toggle('hidden', !(v === 'Überweisung' || v === 'Beides'));
  });

  // Versand via Formspree
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (form._gotcha && form._gotcha.value) return;

    const formspreeId = (window.FORMSPREE_ID || '').trim();
    status.className = 'muted'; status.textContent = 'Senden …'; status.classList.remove('hidden');
    btn.disabled = true; if (spinner) spinner.style.display = 'inline-block'; if (label) label.style.opacity = .8;

    try {
      if (!formspreeId) throw new Error('Formspree-ID fehlt. Trage sie in index.html bei window.FORMSPREE_ID ein.');
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (!res.ok) {
        const data = await res.json().catch(()=>({}));
        throw new Error(data?.errors?.[0]?.message || 'Senden fehlgeschlagen.');
      }
      status.className = 'success';
      status.textContent = '✅ Danke! Ihre Anfrage wurde gesendet. Wir informieren Sie, sobald die Unterlagen bereit sind.';
      form.reset();
      rezeptFields.classList.add('hidden'); uebFields.classList.add('hidden');
    } catch (err) {
      status.className = 'error';
      status.textContent = '❌ ' + err.message;
    } finally {
      btn.disabled = false; if (spinner) spinner.style.display = 'none'; if (label) label.style.opacity = 1;
      status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});
