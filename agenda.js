
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('agendaList');
  try {
    const res = await fetch('../assets/data/agenda.json');
    if (!res.ok) throw new Error('Chargement impossible');
    const data = await res.json();
    container.innerHTML = data.map(item => `
      <article class="item">
        <div class="badge badge-upcoming">${item.type}</div>
        <h3>${item.titre}</h3>
        <p><strong>Date :</strong> ${new Date(item.date + 'T00:00:00').toLocaleDateString('fr-FR')}</p>
        <p><strong>Lieu :</strong> ${item.lieu}</p>
        <p><strong>Détails :</strong> ${item.details}</p>
      </article>
    `).join('');
  } catch (error) {
    container.innerHTML = `<article class="item"><h3>Chargement impossible</h3><p>Le fichier agenda n’a pas pu être lu.</p></article>`;
  }
});
