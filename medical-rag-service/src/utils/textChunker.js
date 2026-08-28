export function chunkText(
  text,
  chunkSize = 500,
  overlap = 100
) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const cleanedText = text
    .replace(/\s+/g, " ")
    .trim();

  if (cleanedText.length === 0) {
    return [];
  }

  const chunks = [];

  let start = 0;

  while (start < cleanedText.length) {
    let end = Math.min(
      start + chunkSize,
      cleanedText.length
    );

    if (end < cleanedText.length) {
      const lastSpace =
        cleanedText.lastIndexOf(" ", end);

      if (lastSpace > start) {
        end = lastSpace;
      }
    }

    const chunk = cleanedText
      .slice(start, end)
      .trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    if (end === cleanedText.length) {
      break;
    }

    start = Math.max(
      end - overlap,
      start + 1
    );
  }

  return chunks;
}