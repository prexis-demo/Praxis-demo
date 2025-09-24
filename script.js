// Form-Logik: zeigt dynamische Felder + sendet an Formspree
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rezeptForm');
  const typeSelect = document.getElementById('typeSelect');
  const rezeptFields = document.getElementById('rezeptFields');
  const uebFields = document.getElementById('ueberwFields');
  const status = document.getElementById('status');
  const btn = document.getElementById('submitBtn');
  const labelSpan = btn.querySelector('.btn-label');
  const spinner = btn.querySelector('.btn-spinner');

  // Dynamische Felder
  typeSelect.addEventListener('change', () => {
    const v = typeSelect.value;
    rezeptFields.classList.toggle('hidden', !(v === 'Rezept' || v === 'Beides'));
    uebFields.classList.toggle('hidden', !(v === 'Überweisung' || v === 'Beides'));
  });

  // Absenden
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // einfache Pflichtfeldprüfung
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Spam-Honeypot
    if (form._gotcha && form._gotcha.value) return;

    // Button -> Ladezustand
    btn.disabled = true;
    spinner.style.display = 'inline-block';
    labelSpan.style.opacity = .8;
    status.className = 'muted';
    status.textContent = 'Senden …';
    status.classList.remove('hidden');

    try {
      const formData = new FormData(form);
      // Formspree Endpoint
      const id = (window.FORMSPREE_ID || '').trim();
      if (!id) throw new Error('Formspree-ID fehlt. Trage sie in index.html bei window.FORMSPREE_ID ein.');

      const res = await fetch(`https://formspree.io/f/${id}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });

      if (res.ok) {
        status.className = 'success';
        status.textContent = '✅ Danke! Ihre Anfrage wurde gesendet. Wir informieren Sie, sobald die Unterlagen bereit sind.';
        form.reset();
        rezeptFields.classList.add('hidden');
        uebFields.classList.add('hidden');
      } else {
        const data = await res.json().catch(()=>({}));
        throw new Error(data?.errors?.[0]?.message || 'Senden fehlgeschlagen. Bitte später erneut versuchen.');
      }
    } catch (err) {
      status.className = 'error';
      status.textContent = '❌ ' + err.message;
    } finally {
      btn.disabled = false;
      spinner.style.display = 'none';
      labelSpan.style.opacity = 1;
      status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});
