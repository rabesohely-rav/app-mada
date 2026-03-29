
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('infosList');
  try {
    const res = await fetch('../assets/data/infos-utiles.json');
    if (!res.ok) throw new Error('Chargement impossible');
    const data = await res.json();
    container.innerHTML = data.map(item => `
      <article class="item">
        <div class="badge badge-upcoming">${item.categorie}</div>
        <h3>${item.titre}</h3>
        <p>${item.contenu}</p>
      </article>
    `).join('');
  } catch (error) {
    container.innerHTML = `<article class="item"><h3>Chargement impossible</h3><p>Le fichier des infos utiles n’a pas pu être lu.</p></article>`;
  }
});
