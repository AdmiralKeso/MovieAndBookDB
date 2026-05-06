export function getMovieGenreStats(movies = []) {
  const stats = {};

  movies.forEach(m => {
    (m.genres || []).forEach(g => {
      if (!g) return;

      stats[g] = (stats[g] || 0) + 1;
    });
  });

  return stats;
}

export function getBookGenreStats(books = []) {
  const stats = {};

  books.forEach(b => {
    let subjects = b.subjects || b.subject || [];

    if (typeof subjects === "string") {
      subjects = [subjects];
    }

    if (!Array.isArray(subjects)) return;

    subjects.forEach(s => {
      stats[s] = (stats[s] || 0) + 1;
    });
  });

  return stats;
}

export function buildChartConfig(stats, title = "Popular Genres") {
  return {
    type: "bar",
    data: {
      labels: Object.keys(stats),
      datasets: [
        {
          label: title,
          data: Object.values(stats),
          backgroundColor: "orange"
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title
        }
      }
    }
  };
}