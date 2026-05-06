/* =========================
   BASE REQUEST
========================= */
async function request(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (err) {
    console.error("API ERROR:", err);
    return null;
  }
}

/* =========================
   MOVIES
========================= */
const TMDB_KEY = "9da11ab5827a9a7abde2fe2d99e61e94"; //Tmdb key

export const getPopularMovies = async () => {
  const data = await request(
    `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}`
  );
  return data?.results || [];
};

export const searchMovies = async (q) => {
  const data = await request(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(q)}`
  );
  return data?.results || [];
};

export const getMovie = async (id) => {
  return await request(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}`
  );
};

export const getMoviesByBookTitle = async (title) => {
  if (!title) return [];

  const data = await request(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}`
  );

  return (data?.results || []).slice(0, 8);
};

/* =========================
   BOOKS
========================= */
export const getPopularBooks = async () => {
  const data = await request(
    "https://openlibrary.org/subjects/popular.json?limit=20"
  );
  return data?.works || [];
};

export const searchBooks = async (q) => {
  const data = await request(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`
  );
  return data?.docs || [];
};

export const getBookDetails = async (id) => {
  const work = await request(`https://openlibrary.org/works/${id}.json`);
  const edition = await request(
    `https://openlibrary.org/works/${id}/editions.json?limit=1`
  );

  return {
    work,
    edition: edition?.entries?.[0] || {}
  };
};

export const getAuthors = async (authorRefs = []) => {
  const authors = await Promise.all(
    authorRefs.map(async (a) => {
      const key = a.author?.key;
      if (!key) return "Unknown";

      try {
        const res = await fetch(`https://openlibrary.org${key}.json`);
        const data = await res.json();
        return data.name || "Unknown";
      } catch {
        return "Unknown";
      }
    })
  );

  return authors.join(", ");
};

/* =========================
   COVER HELPER
========================= */
export function getBookCoverUrl(coverId) {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

export function getMoviePosterUrl(posterPath) {
  if (!posterPath) return null;

  return `https://image.tmdb.org/t/p/w300${posterPath}`;
}

/* =========================
   QUICKCHART
========================= */
const QUICKCHART_BASE = "https://quickchart.io/chart";

export function getChartUrl(chartConfig) {
  const encoded = encodeURIComponent(JSON.stringify(chartConfig));

  return `${QUICKCHART_BASE}?c=${encoded}`;
}