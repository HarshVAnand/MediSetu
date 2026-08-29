import fs from "fs/promises";

import {
  extractTextFromPrescription
} from "../services/ocrService.js";

import {
  chunkText
} from "../utils/textChunker.js";

import {
  storePrescriptionChunks
} from "../services/vectorService.js";

import {
  answerQuestion
} from "../services/ragService.js";


export async function uploadPrescription(
  req,
  res
) {

  let filePath = null;

  try {

    const {
      patientId,
      prescriptionId
    } = req.body;


    if (!req.file) {

      return res.status(400).json({
        error:
          "Prescription image is required"
      });

    }


    filePath = req.file.path;


    if (!patientId || !prescriptionId) {

      return res.status(400).json({
        error:
          "patientId and prescriptionId are required"
      });

    }


    // OCR

    const extractedText =
      await extractTextFromPrescription(
        filePath
      );


    if (!extractedText) {

      return res.status(422).json({
        error:
          "No text could be extracted from the prescription"
      });

    }


    // Chunk text

    const chunks =
      chunkText(extractedText);


    // Convert chunks to vectors
    // and store in ChromaDB

    const vectorResult =
      await storePrescriptionChunks(
        chunks,
        patientId,
        prescriptionId
      );


    return res.status(200).json({

      success: true,

      message:
        "Prescription successfully processed and stored",

      extractedText,

      chunksCreated:
        chunks.length,

      vectorResult

    });

  } catch (error) {

    console.error(
      "Upload error:",
      error
    );


    return res.status(500).json({

      error:
        error.message
        ||
        "Failed to process prescription"

    });

  } finally {

    if (filePath) {

      try {

        await fs.unlink(filePath);

      } catch (error) {

        console.error(
          "Temporary file deletion error:",
          error.message
        );

      }

    }

  }

}


export async function askMedicalQuestion(
  req,
  res
) {

  try {

    const {
      patientId,
      question
    } = req.body;


    if (!patientId || !question) {

      return res.status(400).json({

        error:
          "patientId and question are required"

      });

    }


    const result =
      await answerQuestion(
        question,
        patientId
      );


    return res.status(200).json(
      result
    );

  } catch (error) {

    console.error(
      "Question error:",
      error
    );


    return res.status(500).json({

      error:
        error.message
        ||
        "Failed to process question"

    });

  }

}