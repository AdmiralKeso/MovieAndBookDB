import { getBookCoverUrl } from "../api.js";

function normalizeSubjects(subjects = []) {
  return subjects
    .flat()
    .map(s => {
      if (typeof s === "string") return s;
      if (typeof s === "object") return s.name || s.value;
      return null;
    })
    .filter(Boolean)
    .map(s => s.toLowerCase().trim());
}

export function mapBook(book = {}) {

  // handle both search results and work/edition responses
  const coverId =
    book.cover_i ||
    book.cover_id ||
    book.covers?.[0] ||
    book.edition?.covers?.[0] ||
    book.work?.covers?.[0];

  const author =
  (book.author_name?.join(", ") || null) ||
  (book.authors
    ?.map(a => a?.name || a?.author?.name)
    .filter(Boolean)
    .join(", ") || null) ||
  (book.edition?.authors
    ?.map(a => a?.name)
    .filter(Boolean)
    .join(", ") || null) ||
  "Unknown author";

  const title = book.title || book.work?.title || "";

  const year =
    book.first_publish_year ||
    book.first_publish_date ||
    book.work?.first_publish_date ||
    "N/A";

  return {
    id: book.key?.split("/").pop() || book.id,
    title,

    author,

    cover: coverId ? getBookCoverUrl(coverId) : null,

    year,
    publisher: book.publisher?.join(", ") || "N/A",

    subjects: normalizeSubjects(
      book.subject ||
      book.subjects ||
      book.work?.subjects ||
      []
    )
  };
}