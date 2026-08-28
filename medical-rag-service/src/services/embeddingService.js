import { pipeline } from "@huggingface/transformers";

let embeddingPipeline = null;

async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  return embeddingPipeline;
}

export async function createEmbedding(text) {
  if (!text || text.trim().length === 0) {
    throw new Error(
      "Cannot create embedding from empty text"
    );
  }

  const extractor =
    await getEmbeddingPipeline();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true
  });

  return Array.from(output.data);
}

export async function createEmbeddings(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error(
      "Expected a non-empty array of texts"
    );
  }

  const embeddings = [];

  for (const text of texts) {
    const embedding =
      await createEmbedding(text);

    embeddings.push(embedding);
  }

  return embeddings;
}