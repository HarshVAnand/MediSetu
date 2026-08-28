import { createWorker } from "tesseract.js";

export async function extractTextFromPrescription(filePath) {
  let worker = null;

  try {
    console.log("Starting Tesseract OCR...");
    console.log("Prescription file:", filePath);

    worker = await createWorker("eng", 1, {
      logger: (message) => {
        console.log(
          `OCR: ${message.status} - ${Math.round(
            (message.progress || 0) * 100
          )}%`
        );
      }
    });

    const {
      data: { text }
    } = await worker.recognize(filePath);

    if (!text || text.trim().length === 0) {
      throw new Error(
        "Tesseract could not detect readable text in the prescription"
      );
    }

    console.log("OCR completed successfully");
    console.log("Extracted text:");
    console.log(text);

    return text.trim();

  } catch (error) {
    console.error("Tesseract OCR error:", error);

    throw new Error(
      error.message ||
      "Could not extract text from the prescription"
    );

  } finally {
    if (worker) {
      await worker.terminate();
      console.log("OCR worker terminated");
    }
  }
}