const API_BASE_URL =
  import.meta.env.VITE_RAG_API_URL ||
  "http://localhost:5000/api/rag";


export async function uploadPrescription(
  file,
  patientId,
  prescriptionId
) {
  const formData = new FormData();

  formData.append("prescription", file);
  formData.append("patientId", patientId);
  formData.append("prescriptionId", prescriptionId);

  const response = await fetch(
    `${API_BASE_URL}/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      "Failed to process prescription"
    );
  }

  return data;
}


export async function askMedicalQuestion(
  question,
  patientId
) {
  const response = await fetch(
    `${API_BASE_URL}/ask`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        patientId,
        question
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
      "Failed to process question"
    );
  }

  return data;
}
