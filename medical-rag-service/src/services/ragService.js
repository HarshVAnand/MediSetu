import Groq from "groq-sdk";
import dotenv from "dotenv";

import {
  searchMedicalRecords
} from "./vectorService.js";


dotenv.config();


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


export async function answerQuestion(
  question,
  patientId
) {

  // STEP 1:
  // Search ChromaDB for relevant records

  const searchResults =
    await searchMedicalRecords(
      question,
      patientId,
      5
    );


  const documents =
    searchResults.documents?.[0] || [];

  const metadatas =
    searchResults.metadatas?.[0] || [];


  if (documents.length === 0) {

    return {
      answer:
        "No relevant information was found in the available medical records.",
      sources: []
    };

  }


  // STEP 2:
  // Build RAG context

  const context =
    documents.map(
      (document, index) => {

        const metadata =
          metadatas[index] || {};

        return `
[Medical Record ${index + 1}]
Prescription ID: ${metadata.prescriptionId || "Unknown"}

${document}
`;

      }
    ).join("\n\n");


  // STEP 3:
  // Send retrieved context + question to Groq

  const completion =
    await groq.chat.completions.create({

      model: "llama-3.3-70b-versatile",

      temperature: 0.2,

      messages: [

        {
          role: "system",

          content: `
You are a medical record retrieval assistant.

Answer ONLY from the provided medical record context.

Rules:

- Do not invent medical information.
- Do not invent medicine names or dosages.
- Do not diagnose the patient.
- If the information is missing, clearly state that it is not available in the records.
- Mention the prescription ID when referring to a retrieved record.
- This system assists with medical record retrieval and does not replace a qualified healthcare professional.
`
        },

        {
          role: "user",

          content: `
MEDICAL RECORD CONTEXT:

${context}

QUESTION:

${question}
`
        }

      ]

    });


  const answer =
    completion.choices?.[0]
      ?.message?.content
    ||
    "Unable to generate an answer.";


  // STEP 4:
  // Return answer and retrieved sources

  return {

    answer,

    sources:
      documents.map(
        (document, index) => ({

          prescriptionId:
            metadatas[index]
              ?.prescriptionId
            || "Unknown",

          chunk:
            document

        })
      )

  };
}
