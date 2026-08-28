import { ChromaClient } from "chromadb";
import dotenv from "dotenv";

dotenv.config();

const CHROMA_HOST =
  process.env.CHROMA_HOST || "localhost";

const CHROMA_PORT =
  process.env.CHROMA_PORT || "8000";

const chromaClient = new ChromaClient({
  path: `http://${CHROMA_HOST}:${CHROMA_PORT}`
});

console.log(
  `Connecting to ChromaDB at http://${CHROMA_HOST}:${CHROMA_PORT}`
);

export default chromaClient;