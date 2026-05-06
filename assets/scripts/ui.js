/* =========================
   MOVIES
========================= */
export function renderMovies(grid, movies = []) {
  if (!grid) return;

  const chart = grid.querySelector("#genreChart");

  grid.innerHTML = "";

  movies.forEach((movie, index) => {

    //insert chart AFTER 2 movies
    if (index === 2 && chart) {
      grid.appendChild(chart);
      return;
    }

    const div = document.createElement("div");
    div.className = "movie-card";
    div.dataset.id = movie.id;

    div.innerHTML = `
      ${
        movie.poster
          ? `<img src="${movie.poster}" class="movie-poster">`
          : `
            <div class="text-cover">
              <h4>${movie.title}</h4>
              <p>${movie.releaseDate || "No year"}</p>
            </div>
          `
      }

      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
      </div>
    `;

    grid.appendChild(div);
  });

  // fallback if too few movies
  if (movies.length < 2 && chart) {
    grid.appendChild(chart);
  }
}


/* =========================
   BOOKS
========================= */
export function renderBooks(container, books = []) {
  if (!container) return;

  container.innerHTML = "";

  books.forEach(book => {
    const div = document.createElement("div");
    div.className = "book-card";
    div.dataset.id = book.id;

    div.innerHTML = `
      ${
        book.cover
          ? `<img src="${book.cover}" alt="${book.title}">`
          : ""
      }

      <div class="text-cover">
        <h4>${book.title}</h4>
        <p>${book.author}</p>
      </div>
    `;

    container.appendChild(div);
  });
}


/* =========================
   MOVIE DETAILS - RELATED
========================= */
export function renderRelatedMovies(grid, movies = []) {
  const loader = document.getElementById("moviesLoading");
  const empty = document.getElementById("noMovies");

  if (loader) loader.style.display = "none";
  if (!grid) return;

  const list = movies.slice(0, 6);

  if (!list.length) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";

  grid.innerHTML = list.map(movie => `
    <div class="movie-card" data-id="${movie.id}">
      
      ${
        movie.poster
          ? `<img src="${movie.poster}" alt="${movie.title}">`
          : `
            <div class="text-cover">
              <h4>${movie.title}</h4>
              <p>${movie.releaseDate || "No year"}</p>
            </div>
          `
      }

      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
      </div>

    </div>
  `).join("");
}


/* =========================
   BOOK DETAILS - RELATED
========================= */
export function renderRelatedBooks(grid, books = []) {
  const loader = document.getElementById("booksLoading");
  const empty = document.getElementById("noBooks");

  if (loader) loader.style.display = "none";
  if (!grid) return;

  const list = books.slice(0, 6);

  if (!list.length) {
    grid.innerHTML = "";
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";

  grid.innerHTML = list.map(book => `
    <div class="book-card" data-id="${book.id}">
      
      ${
        book.cover
          ? `<img class="book-cover" src="${book.cover}">`
          : `<div class="no-cover">${book.title}</div>`
      }

      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author}</div>
      </div>

    </div>
  `).join("");
}


/* =========================
   BOOK COVER (DETAIL PAGE)
========================= */
export function renderBookCover(book, authorText = "Unknown author") {
  const container = document.getElementById("bookCover");
  if (!container) return;

  if (book.cover) {
    container.innerHTML = `
      <img 
        src="${book.cover}" 
        class="book-cover"
        alt="${book.title}"
      >
    `;
  } else {
    container.innerHTML = `
      <div class="text-cover">
        <h2>${book.title}</h2>
        <p>${authorText}</p>
      </div>
    `;
  }
}

/* =========================
   CHART COMPONENT
========================= */
export function renderChart(container, chartUrl) {
  if (!container) return;

  // always show loading first
  container.innerHTML = `
    <div class="chart-loading">
      <div class="spinner"></div>
    </div>
  `;

  if (!chartUrl) return;

  const img = new Image();
  img.src = chartUrl;
  img.className = "chart-image";

  img.onload = () => {
    container.innerHTML = "";
    container.appendChild(img);
  };

  img.onerror = () => {
    container.innerHTML = `<p style="opacity:0.6;">Chart failed to load</p>`;
  };
}