import {
  renderMovies,
  renderBooks,
  renderRelatedMovies,
  renderRelatedBooks,
  renderBookCover,
  renderChart
} from "./ui.js";

import {
  getPopularMovies,
  searchMovies,
  getMoviesByBookTitle,
  getMovie,

  getPopularBooks,
  searchBooks,
  getAuthors,
  getBookDetails,

  getChartUrl
} from "./api.js";

import {
  buildChartConfig,
  getMovieGenreStats,
  getBookGenreStats
} from "./chart.js";

// Models
import { mapMovie } from "./models/moviesModel.js";
import { mapBook } from "./models/booksModel.js";

document.addEventListener("DOMContentLoaded", async () => {

  //Load pages on demand
  const isIndexPage = !!document.getElementById("moviesGrid");
  const isMoviePage = !!document.getElementById("movieDetailsContainer");
  const isBookPage = !!document.getElementById("bookDetailsContainer");

  /* =========================
     INDEX PAGE
  ========================= */
  if (isIndexPage) {

    const moviesGrid = document.getElementById("moviesGrid");
    const booksGrid = document.getElementById("booksGrid");
    const chartContainer = document.getElementById("genreChart");

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    const loading = document.getElementById("loading");
    let chartMode = "popular";

    let mode = "movies";
    let currentMovies = [];
    let currentBooks = [];

    async function loadMovies() {
      loading.style.display = "block";

      try {
        const rawMovies = await getPopularMovies();
        const movies = rawMovies.map(mapMovie);
        currentMovies = movies;
        renderMovies(moviesGrid, movies);

      } catch (err) {
        console.error("Movies failed:", err);
      } finally {
        loading.style.display = "none";
      }
    }


    async function loadBooks() {
      loading.style.display = "block";

      try {
        const rawBooks = await getPopularBooks();
        currentBooks = rawBooks.map(mapBook);

        renderBooks(booksGrid, currentBooks);

      } catch (err) {
        console.error("Books failed:", err);
      } finally {
        loading.style.display = "none";
      }
    }

    async function search(q) {
      if (mode === "movies") {
        const rawMovies = await searchMovies(q);
        const movies = rawMovies.map(mapMovie);

        chartMode = "search";

        currentMovies = movies;
        renderMovies(moviesGrid, movies);

        await loadGenreChart("Genres by Search");

        await loadGenreChart();
      } else {
        const rawBooks = await searchBooks(q);
        const books = rawBooks.map(mapBook);

        currentBooks = books;
        renderBooks(booksGrid, books);
      }
    }

   async function loadGenreChart() {
      const chartContainer = document.getElementById("genreChart");
      if (!chartContainer) return;

      chartContainer.style.display = "block";

      const title =
        chartMode === "search"
          ? "Popular Genres by Search"
          : "Popular Genres";

      const stats = getMovieGenreStats(currentMovies);
      const config = buildChartConfig(stats, title);
      const url = getChartUrl(config);

      renderChart(chartContainer, url);
    }

    await loadMovies();
    await loadGenreChart("Popular Genres");

    function updateMode(mode) {
      const chart = document.getElementById("genreChart");

      moviesGrid.style.display = mode === "movies" ? "grid" : "none";
      booksGrid.style.display = mode === "books" ? "grid" : "none";

      if (chart) {
        chart.style.display = mode === "movies" ? "block" : "none";
      }
    }

    modeRadios.forEach(r => {
      r.addEventListener("change", async (e) => {
        mode = e.target.value;
        updateMode(mode);

        if (mode === "movies") {
          await loadMovies();
        } else {
          await loadBooks();
        }

        await loadGenreChart(); // ✔ always runs once, correctly
      });
    });

    searchBtn?.addEventListener("click", () => {
      const q = searchInput.value.trim();
      if (q) search(q);
    });

    moviesGrid?.addEventListener("click", (e) => {
      const card = e.target.closest(".movie-card");
      if (!card) return;
      window.location.href = `movie.html?id=${card.dataset.id}`;
    });

    booksGrid?.addEventListener("click", (e) => {
      const card = e.target.closest(".book-card");
      if (!card) return;
      window.location.href = `book.html?id=${encodeURIComponent(card.dataset.id)}`;
    });
  }

  /* =========================
     MOVIE PAGE
  ========================= */
  if (isMoviePage) {

    const id = new URLSearchParams(location.search).get("id");

    const container = document.getElementById("movieDetailsContainer");
    const loading = document.getElementById("loading");
    const relatedBooksGrid = document.getElementById("relatedBooksGrid");

    relatedBooksGrid?.addEventListener("click", (e) => {
      const card = e.target.closest(".book-card");
      if (!card) return;
      window.location.href = `book.html?id=${encodeURIComponent(card.dataset.id)}`;
    });

    async function loadMovieDetails() {

      const rawMovie = await getMovie(id);
      if (!rawMovie) return;

      const movie = mapMovie(rawMovie);

      document.getElementById("movieTitle").textContent = movie.title;
      document.getElementById("releaseDate").textContent = movie.releaseDate;
      document.getElementById("rating").textContent = movie.rating;
      document.getElementById("runtime").textContent = movie.runtime;

      document.getElementById("budget").textContent = movie.budget;
      document.getElementById("revenue").textContent = movie.revenue;

      document.getElementById("genresContainer").textContent =
        movie.genres?.join(", ") || "N/A";

      document.getElementById("overview").textContent = movie.overview;
      document.getElementById("status").textContent = movie.status;
      document.getElementById("language").textContent = movie.language;
      document.getElementById("productionCompanies").textContent = movie.production;
      document.getElementById("popularity").textContent = movie.popularity;

      document.getElementById("moviePoster").src =
        movie.poster || "https://placehold.co/300x450";

      container.style.display = "block";
      loading.style.display = "none";

      const query = movie.title || "";
      const booksData = await searchBooks(`"${query}"`);
      const books = booksData.map(mapBook);

      renderRelatedBooks(relatedBooksGrid, books);

      const stats = getBookGenreStats(booksData);
      const config = buildChartConfig(stats);
      const chartUrl = getChartUrl(config);

      renderChart("booksChart", chartUrl);
    }

    loadMovieDetails();
  }

  /* =========================
     BOOK PAGE
  ========================= */
  if (isBookPage) {

    const rawId = new URLSearchParams(location.search).get("id");
    if (!rawId) return;

    const id = rawId.split("/").pop();

    const container = document.getElementById("bookDetailsContainer");
    const loading = document.getElementById("loading");
    const relatedMoviesGrid = document.getElementById("relatedMoviesGrid");

    relatedMoviesGrid?.addEventListener("click", (e) => {
      const card = e.target.closest(".movie-card");
      if (!card) return;
      window.location.href = `movie.html?id=${card.dataset.id}`;
    });

    async function loadBook() {

      const data = await getBookDetails(id);
      if (!data || !data.work) return;

      const { work, edition } = data;

      const authorText =
        (edition?.authors
          ?.map(a => a.name)
          .filter(Boolean)
          .join(", ")
        ) ||
        (await getAuthors(work.authors || [])) ||
        "Unknown author";

      const mappedBook = mapBook({
        work,
        edition
      });

      renderBookCover(mappedBook, authorText);

      document.getElementById("bookTitle").textContent = work.title || "";
      document.getElementById("bookAuthor").textContent = authorText;
      document.getElementById("bookYear").textContent =
        work.first_publish_date || "N/A";

      document.getElementById("bookPublisher").textContent =
        edition?.publishers?.join(", ") || "N/A";

      document.getElementById("bookLanguage").textContent =
        edition?.languages?.map(l =>
          l.key.replace("/languages/", "")
        ).join(", ") || "N/A";

      document.getElementById("bookPages").textContent =
        edition?.number_of_pages || "N/A";

      container.style.display = "block";
      loading.style.display = "none";

      const query = work?.title?.trim();
      const movies = await getMoviesByBookTitle(query);

      const mappedMovies = movies.map(mapMovie);
      renderRelatedMovies(relatedMoviesGrid, mappedMovies);
    }

    loadBook();
  }

});