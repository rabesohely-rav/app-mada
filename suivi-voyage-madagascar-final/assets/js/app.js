
(function () {
  const path = window.location.pathname;
  const pageName = document.body.dataset.page || '';
  document.querySelectorAll('[data-nav-key]').forEach((link) => {
    if (link.dataset.navKey === pageName) link.classList.add('is-active');
  });

  const todayTarget = document.querySelector('[data-today-label]');
  if (todayTarget) {
    const now = new Date();
    todayTarget.textContent = now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  const yearTarget = document.querySelector('[data-current-year]');
  if (yearTarget) yearTarget.textContent = String(new Date().getFullYear());

  const assetPrefix = pageName === 'accueil' ? 'assets' : '../assets';

  function readJSON(relPath) {
    return fetch(`${assetPrefix}/data/${relPath}`).then((r) => {
      if (!r.ok) throw new Error(`Erreur de chargement ${relPath}`);
      return r.json();
    });
  }

  function safeGetJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function formatDateFR(dateValue) {
    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function todayISO() {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 10);
  }

  async function initHome() {
    const dailySummary = document.getElementById('dailySummary');
    const budgetPreview = document.getElementById('budgetPreview');
    const nextEvent = document.getElementById('nextEvent');
    const nextReservation = document.getElementById('nextReservation');
    const weatherWidget = document.getElementById('weatherWidget');
    if (!dailySummary) return;

    const today = todayISO();

    try {
      const agenda = await readJSON('agenda.json');
      const reservations = await readJSON('reservations.json');

      const todayEvents = agenda.filter(item => item.date === today);
      const upcomingEvent = agenda.find(item => item.date >= today);
      const upcomingReservation = reservations.find(item => item.date >= today);

      if (todayEvents.length) {
        dailySummary.innerHTML = todayEvents.map(item => `
          <div class="compact-item">
            <strong>${item.titre}</strong>
            <p>${item.type} • ${item.lieu}</p>
            <p>${item.details || ''}</p>
          </div>
        `).join('');
      } else {
        dailySummary.innerHTML = `<div class="compact-item"><strong>Pas d’événement spécifique aujourd’hui</strong><p>Utilise la feuille de route pour vérifier l’étape du jour.</p></div>`;
      }

      nextEvent.innerHTML = upcomingEvent
        ? `<div class="compact-item"><strong>${upcomingEvent.titre}</strong><p>${formatDateFR(upcomingEvent.date)} • ${upcomingEvent.type}</p><p>${upcomingEvent.lieu}</p></div>`
        : `<div class="compact-item"><strong>Aucun événement à venir</strong></div>`;

      nextReservation.innerHTML = upcomingReservation
        ? `<div class="compact-item"><strong>${upcomingReservation.nom}</strong><p>${formatDateFR(upcomingReservation.date)} • ${upcomingReservation.type}</p><p>${upcomingReservation.lieu}</p></div>`
        : `<div class="compact-item"><strong>Aucune réservation à venir</strong></div>`;
    } catch (error) {
      dailySummary.innerHTML = `<div class="compact-item"><strong>Données indisponibles</strong><p>Le tableau de bord n’a pas pu charger l’agenda.</p></div>`;
      nextEvent.innerHTML = `<div class="compact-item"><strong>Indisponible</strong></div>`;
      nextReservation.innerHTML = `<div class="compact-item"><strong>Indisponible</strong></div>`;
    }

    const depensesState = safeGetJSON('suivi_depenses_v3', { data: [], displayCurrency: 'EUR', eurToMgaRate: null });
    const totalEur = (depensesState.data || []).reduce((sum, row) => sum + (row.montantEur || 0), 0);
    const paidEur = (depensesState.data || []).reduce((sum, row) => row.paid && row.montantEur ? sum + row.montantEur : sum, 0);
    budgetPreview.innerHTML = `
      <div class="compact-item">
        <strong>Total saisi</strong>
        <p>${totalEur.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
      </div>
      <div class="compact-item">
        <strong>Déjà marqué payé</strong>
        <p>${paidEur.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
      </div>
    `;

    if (weatherWidget) {
      weatherWidget.innerHTML = `<div class="compact-item"><strong>Météo</strong><p>Chargement…</p></div>`;
      try {
        // Antananarivo approximate coordinates
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-18.8792&longitude=47.5079&current=temperature_2m,weather_code&timezone=auto');
        const data = await response.json();
        if (!data || !data.current) throw new Error('Météo indisponible');
        weatherWidget.innerHTML = `
          <div class="compact-item">
            <strong>Antananarivo</strong>
            <p>${data.current.temperature_2m}°C actuellement</p>
            <p class="muted">Réseau disponible : météo rafraîchie en ligne.</p>
          </div>
        `;
      } catch (error) {
        weatherWidget.innerHTML = `<div class="compact-item"><strong>Météo hors ligne</strong><p>Pas de connexion ou service indisponible.</p></div>`;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', initHome);
})();
