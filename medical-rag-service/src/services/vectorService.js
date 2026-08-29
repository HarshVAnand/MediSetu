import chromaClient from "../config/chroma.js";

import {
  createEmbedding,
  createEmbeddings
} from "./embeddingService.js";


const COLLECTION_NAME = "medical_records";


async function getCollection() {

  try {

    const collection =
      await chromaClient.getOrCreateCollection({
        name: COLLECTION_NAME
      });

    return collection;

  } catch (error) {

    console.error(
      "ChromaDB collection error:",
      error
    );

    throw new Error(
      `Failed to access ChromaDB collection: ${error.message}`
    );

  }
}


export async function storePrescriptionChunks(
  chunks,
  patientId,
  prescriptionId
) {

  if (!chunks || chunks.length === 0) {

    throw new Error(
      "No prescription chunks available"
    );

  }


  console.log(
    `Creating embeddings for ${chunks.length} chunks...`
  );


  const embeddings =
    await createEmbeddings(chunks);


  console.log(
    "Embeddings created successfully"
  );


  const collection =
    await getCollection();


  const ids =
    chunks.map(
      (_, index) =>
        `${prescriptionId}_chunk_${index}`
    );


  const metadatas =
    chunks.map(
      (_, index) => ({
        patientId: String(patientId),
        prescriptionId: String(prescriptionId),
        chunkIndex: index
      })
    );


  console.log(
    "Storing prescription vectors in ChromaDB..."
  );


  await collection.upsert({
    ids,
    embeddings,
    documents: chunks,
    metadatas
  });


  console.log(
    `${chunks.length} chunks stored successfully`
  );


  return {
    success: true,
    storedChunks: chunks.length
  };
}


export async function searchMedicalRecords(
  question,
  patientId,
  topK = 5
) {

  if (!question) {

    throw new Error(
      "Question is required for search"
    );

  }


  const collection =
    await getCollection();


  const questionEmbedding =
    await createEmbedding(question);


  console.log(
    `Searching medical records for patient: ${patientId}`
  );


  const results =
    await collection.query({

      queryEmbeddings: [
        questionEmbedding
      ],

      nResults: topK,

      where: {
        patientId: String(patientId)
      }

    });


  return results;
}