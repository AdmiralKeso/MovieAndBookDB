Using Bootstrap usually replaces most of your CSS work rather than sitting alongside “vanilla CSS.” You can mix them, but you should be intentional about it (Bootstrap for layout/components, your CSS for overrides).

1. API layer
fetchMovies()
fetchBooks()

2. App logic layer
loadMovies()
loadBooks()

3. UI layer
renderMovies()
renderBooks()
showLoading()