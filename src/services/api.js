// MediSetu Health - Centralized Backend API Client using Axios
// Connects the frontend to Express + ChromaDB + Groq + Tesseract OCR backend service (medical-rag-service)
import axios from 'axios';

// Create a configured Axios instance
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 45000,
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor for clear error logging and formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'API request failed';
    console.warn(`[Axios API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

/**
 * Check if the backend medical-rag-service is running and accessible via Axios
 */
export async function checkBackendHealth() {
  try {
    const res = await apiClient.get('/health', { timeout: 3000 }).catch(() => null);
    if (res && res.status === 200) return true;

    // Fallback test root endpoint
    const rootRes = await axios.get('/', { timeout: 3000 }).catch(() => null);
    return rootRes !== null && rootRes.status === 200;
  } catch (err) {
    return false;
  }
}

/**
 * Upload a prescription image/PDF to the backend for Tesseract OCR + ChromaDB Vector Indexing using Axios
 * @param {File|Blob} file - The image or PDF file
 * @param {string} patientId - Associated patient ID
 * @param {string} prescriptionId - Associated prescription/record ID
 */
export async function uploadPrescriptionToBackend(file, patientId, prescriptionId) {
  const formData = new FormData();
  formData.append('prescription', file);
  formData.append('patientId', patientId || 'pat-001');
  formData.append('prescriptionId', prescriptionId || `pres-${Date.now()}`);

  const response = await apiClient.post('/rag/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Query the Groq LLM + ChromaDB Vector context via the backend RAG service using Axios
 * @param {string} question - The user's query
 * @param {string} patientId - Associated patient ID
 */
export async function askQuestionToBackend(question, patientId) {
  const response = await apiClient.post('/rag/ask', {
    question,
    patientId: String(patientId || 'pat-001'),
  });

  return response.data;
}

/**
 * Send Live GPS coordinates to the backend to log or query nearby facilities
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radiusKm - Radius in KM (default 60)
 * @param {string} locationName - Name of location or 'Live GPS'
 */
export async function sendLocationToBackend(lat, lng, radiusKm = 60, locationName = 'Live GPS') {
  try {
    const response = await apiClient.post('/facilities/search', {
      lat,
      lng,
      radiusKm,
      locationName,
      timestamp: new Date().toISOString()
    });
    return response.data;
  } catch (err) {
    // Graceful fallback if backend facility search endpoint is optional
    console.debug('Backend facility search route not active, continuing with local dataset:', err.message);
    return null;
  }
}

/**
 * Synchronize offline mutation queue to the backend via Axios
 * @param {Array} queueItems - Array of pending sync queue items
 */
export async function syncQueueToBackend(queueItems) {
  const response = await apiClient.post('/sync', {
    items: queueItems,
    syncedAt: new Date().toISOString(),
  });

  return response.data;
}
