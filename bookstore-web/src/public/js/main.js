async function loadBooks() {
  const category = document.getElementById('filterCategory').value;
  const author = document.getElementById('filterAuthor').value;
  const sortBy = document.getElementById('sortBy').value;

  const url = new URL('/api/books', window.location.origin);
  if (category) url.searchParams.set('category', category);
  if (author) url.searchParams.set('author', author);
  url.searchParams.set('sortBy', sortBy);
  url.searchParams.set('order', 'asc');

  const res = await fetch(url.toString());
  const books = await res.json();

  const container = document.getElementById('books');
  container.innerHTML = '';
  books.forEach(b => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <h3>${b.title}</h3>
      <p>Автор: ${b.author}</p>
      <p>Категория: ${b.category}, Год: ${b.year}</p>
      <p>Цена аренды: ${b.price_rent} ₽, Покупка: ${b.price_buy} ₽</p>
      <p>Статус: ${b.status}</p>
      <button onclick="rentBook(${b.id}, 0.5)">Аренда 2 недели</button>
      <button onclick="rentBook(${b.id}, 1)">Аренда 1 месяц</button>
      <button onclick="rentBook(${b.id}, 3)">Аренда 3 месяца</button>
      <button onclick="buyBook(${b.id})">Купить</button>
    `;
    container.appendChild(card);
  });
}
