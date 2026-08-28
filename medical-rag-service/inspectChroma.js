import chromaClient from "./src/config/chroma.js";

async function inspectChroma() {
  try {
    // List all collections
    const collections =
      await chromaClient.listCollections();

    console.log("\n=== CHROMADB COLLECTIONS ===\n");

    console.log(collections);

    // Access your medical records collection
    const collection =
      await chromaClient.getCollection({
        name: "medical_records"
      });

    console.log("\n=== COLLECTION INFO ===\n");

    console.log(
      "Collection name:",
      collection.name
    );

    // Get all stored records
    const records =
      await collection.get({
        include: [
          "documents",
          "metadatas",
          "embeddings"
        ]
      });

    console.log("\n=== STORED RECORDS ===\n");

    console.log(
      JSON.stringify(
        records,
        null,
        2
      )
    );

  } catch (error) {

    console.error(
      "Error inspecting ChromaDB:",
      error
    );

  }
}

inspectChroma();