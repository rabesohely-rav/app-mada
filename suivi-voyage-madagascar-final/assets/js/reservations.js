
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('reservationsList');
  try {
    const res = await fetch('../assets/data/reservations.json');
    if (!res.ok) throw new Error('Chargement impossible');
    const data = await res.json();
    container.innerHTML = data.map(item => `
      <article class="item">
        <div class="badge badge-upcoming">${item.type}</div>
        <h3>${item.nom}</h3>
        <p><strong>Date :</strong> ${new Date(item.date + 'T00:00:00').toLocaleDateString('fr-FR')}</p>
        <p><strong>Lieu :</strong> ${item.lieu || '—'}</p>
        <p><strong>Contact :</strong> ${item.contact || '—'}</p>
        <p><strong>Réservation :</strong> ${item.reservation || '—'}</p>
        <p><strong>Notes :</strong> ${item.notes || '—'}</p>
      </article>
    `).join('');
  } catch (error) {
    container.innerHTML = `<article class="item"><h3>Chargement impossible</h3><p>Le fichier des réservations n’a pas pu être lu.</p></article>`;
  }
});
