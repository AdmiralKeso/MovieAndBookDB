import { getMoviePosterUrl } from "../api.js";

const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  878: "Sci-Fi",
  53: "Thriller",
  10749: "Romance"
};

export function mapMovie(movie = {}) {
  return {
    id: movie.id,

    title: movie.title || "Untitled",

    poster: getMoviePosterUrl(movie.poster_path),

    releaseDate: movie.release_date || "N/A",

    rating: movie.vote_average ?? "N/A",

    runtime: movie.runtime ? `${movie.runtime} min` : "N/A",

    overview: movie.overview || "",

    // ✅ FIXED: supports BOTH API shapes
    genres:
      movie.genres?.map(g => g.name) ||
      movie.genre_ids?.map(id => genreMap[id]) ||
      [],

    language:
      movie.spoken_languages?.map(l => l.english_name).join(", ") || "N/A",

    production:
      movie.production_companies?.map(c => c.name).join(", ") || "N/A",

    budget: movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A",

    revenue: movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A",

    popularity: movie.popularity ? movie.popularity.toFixed(1) : "N/A",

    status: movie.status || "N/A"
  };
}