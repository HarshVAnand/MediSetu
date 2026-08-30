# MediSetu

### AI-Powered Healthcare Accessibility & Medical Record Assistance Platform

**MediSetu** is an AI-assisted healthcare platform designed to improve
access to medical information and continuity of care, particularly for
rural and underserved communities.

It digitizes prescriptions using OCR, stores medical information as
vector embeddings, and uses a Retrieval-Augmented Generation (RAG)
pipeline to provide context-aware responses based on a patient's medical
records.

------------------------------------------------------------------------

## 🎯 Problem Statement

Rural and underserved communities often face:

-   Limited access to healthcare facilities and specialists
-   Long travel distances for medical consultations
-   Paper-based and fragmented medical records
-   Difficulty maintaining medical history
-   Language barriers
-   Difficulty accessing previous prescriptions
-   Poor continuity of care between healthcare facilities

Patients may also struggle to retrieve relevant information from old
prescriptions and medical documents.

------------------------------------------------------------------------

## 💡 Solution

MediSetu provides a unified platform that combines:

-   📄 Prescription digitization using OCR
-   🧠 AI-powered medical record retrieval
-   🔎 Retrieval-Augmented Generation (RAG)
-   🗄️ Vector-based medical record storage
-   🌐 Multilingual healthcare interaction
-   📍 Healthcare facility discovery
-   👤 Patient-specific medical records

------------------------------------------------------------------------

## Key Features

### 📄 Prescription OCR

Users can upload prescription images and extract text using
**Tesseract.js**.

``` text
Prescription Image
        ↓
    Tesseract.js
        ↓
   Extracted Text
```

### RAG-Based Medical Information Retrieval

Relevant information is retrieved from stored medical records before
generating an AI response.

``` text
User Question
      ↓
Question Embedding
      ↓
ChromaDB
      ↓
Relevant Medical Records
      ↓
RAG Pipeline
      ↓
Groq LLM
      ↓
Context-Aware Response
```

### Vector Database

Medical-record chunks are converted into embeddings and stored in
**ChromaDB**.

Example metadata:

``` json
{
  "patientId": "patient001",
  "prescriptionId": "prescription001",
  "chunkIndex": 0
}
```

### 🌐 Multilingual Support

The platform is designed to support:

-   English
-   Hindi
-   Bengali
-   Marathi
-   Tamil
-   Telugu

### 📍 Healthcare Facility Discovery

Healthcare facilities can be discovered using **OpenStreetMap** and
**Leaflet.js**.

### 🐳 Docker Support

ChromaDB can be deployed locally using Docker and Docker Compose.

------------------------------------------------------------------------

## 🏗️ System Architecture

``` text
                    ┌───────────────┐
                    │    Patient    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ MediSetu UI   │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       Upload Prescription          Ask Question
              │                           │
              ▼                           │
        ┌─────────────┐                   │
        │ Tesseract.js│                   │
        │     OCR     │                   │
        └──────┬──────┘                   │
               │                           │
               ▼                           │
        Extracted Text                    │
               │                           │
               ▼                           │
         Text Chunking                    │
               │                           │
               ▼                           │
          Embeddings                      │
               │                           │
               ▼                           │
        ┌─────────────┐                   │
        │  ChromaDB   │◄──────────────────┘
        │ Vector Store│
        └──────┬──────┘
               │
               ▼
       Relevant Context
               │
               ▼
        ┌─────────────┐
        │ RAG Pipeline│
        └──────┬──────┘
               │
               ▼
          ┌─────────┐
          │ Groq LLM│
          └────┬────┘
               │
               ▼
       AI-Assisted Response
```

------------------------------------------------------------------------

## 🔄 RAG Pipeline

1.  **Prescription Upload** --- User uploads a prescription image.
2.  **OCR** --- Tesseract.js extracts text.
3.  **Text Chunking** --- Extracted text is divided into smaller chunks.
4.  **Embedding Generation** --- Each chunk is converted into a vector
    representation.
5.  **Vector Storage** --- Embeddings and metadata are stored in
    ChromaDB.
6.  **Question Processing** --- User's question is converted into an
    embedding.
7.  **Similarity Search** --- ChromaDB retrieves relevant
    patient-specific chunks.
8.  **AI Response** --- Retrieved context is provided to the Groq LLM.

------------------------------------------------------------------------

## 🔍 Why RAG?

Patient medical records are dynamic. An LLM's pretrained knowledge does
not contain a patient's latest prescription or medical history.

``` text
New Medical Record
        ↓
      OCR
        ↓
    Embedding
        ↓
     ChromaDB
        ↓
Available for Retrieval
```

### Advantages

-   Patient-specific information retrieval
-   No model retraining for every new prescription
-   Dynamic medical-record updates
-   Relevant context provided to the LLM
-   Reduced dependence on pretrained knowledge
-   Scalable medical knowledge storage

------------------------------------------------------------------------

## 🧰 Technology Stack

### Frontend

-   React.js
-   JavaScript
-   HTML
-   CSS

### Backend

-   Node.js
-   Express.js
-   REST APIs

### AI / RAG

-   Retrieval-Augmented Generation
-   Groq LLM
-   Hugging Face Transformers
-   Embedding Models

### OCR

-   Tesseract.js

### Vector Database

-   ChromaDB

### Database

-   MongoDB

### Maps

-   OpenStreetMap
-   Leaflet.js

### Development & Deployment

-   Docker
-   Docker Compose
-   npm
-   Git
-   GitHub

------------------------------------------------------------------------

## 📁 Project Structure

``` text
MediSetu/
│
├── frontend/
│
├── medical-rag-service/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── chroma.js
│   │   ├── controllers/
│   │   │   └── ragController.js
│   │   ├── routes/
│   │   │   └── ragRoutes.js
│   │   ├── services/
│   │   │   ├── embeddingService.js
│   │   │   ├── ocrService.js
│   │   │   ├── ragService.js
│   │   │   └── vectorService.js
│   │   └── utils/
│   │       └── textChunker.js
│   ├── .env
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── package.json
│   └── package-lock.json
│
├── README.md
└── ...
```

------------------------------------------------------------------------

## ⚙️ Installation

### 1. Clone Repository

``` bash
git clone https://github.com/HarshVAnand/MediSetu.git
cd MediSetu
```

### 2. Install Dependencies

``` bash
cd medical-rag-service
npm install
```

### 3. Configure Environment Variables

Create `.env` inside `medical-rag-service/`:

``` env
PORT=5000
GROQ_API_KEY=your_groq_api_key
CHROMA_HOST=localhost
CHROMA_PORT=8000
```

Create `.env.example`:

``` env
PORT=5000
GROQ_API_KEY=your_groq_api_key
CHROMA_HOST=localhost
CHROMA_PORT=8000
```

> ⚠️ Never commit the actual `.env` file or API keys to GitHub.

------------------------------------------------------------------------

## 🐳 Start ChromaDB

Make sure Docker Desktop is running.

``` bash
docker compose up -d
```

Check the container:

``` bash
docker ps
```

ChromaDB runs on:

``` text
http://localhost:8000
```

------------------------------------------------------------------------

## ▶️ Start Backend

Inside `medical-rag-service/`:

``` bash
npm run dev
```

The backend runs using:

``` text
src/app.js
```

------------------------------------------------------------------------

## 🔌 API Endpoints

### Upload Prescription

``` http
POST /api/rag/upload
```

Local URL:

``` text
http://localhost:5000/api/rag/upload
```

Use **form-data**:

  Key              Type   Example
  ---------------- ------ ------------------
  prescription     File   prescription.jpg
  patientId        Text   patient001
  prescriptionId   Text   prescription001

### Ask Medical Question

``` http
POST /api/rag/ask
```

Local URL:

``` text
http://localhost:5000/api/rag/ask
```

Request body:

``` json
{
  "patientId": "patient001",
  "question": "What information is available in my latest prescription?"
}
```

Example response:

``` json
{
  "answer": "The retrieved records contain information from the patient's prescription.",
  "sources": [
    {
      "prescriptionId": "prescription001",
      "chunk": "..."
    }
  ]
}
```

------------------------------------------------------------------------

## 🧪 Testing

The backend can be tested using:

-   Postman
-   Frontend application
-   REST API clients

### Check ChromaDB

``` bash
curl http://localhost:8000/api/v2/heartbeat
```

A successful response confirms that ChromaDB is running.

------------------------------------------------------------------------

## 🔐 Security

Medical data is sensitive. A production version should implement:

-   Authentication
-   Authorization
-   Role-based access control
-   Patient-level data isolation
-   Encryption
-   Secure API key management
-   Audit logging
-   Consent management
-   Secure deletion
-   Access monitoring

------------------------------------------------------------------------

## ⚠️ Medical Disclaimer

MediSetu is an **AI-assisted healthcare information platform** and is
not intended to replace doctors, qualified healthcare professionals,
emergency services, diagnosis, or professional medical advice.

AI-generated responses should be verified by an appropriately qualified
healthcare professional before making medical decisions.

------------------------------------------------------------------------

## 🌾 Rural Healthcare Impact

MediSetu aims to improve healthcare accessibility by helping users:

-   Digitize paper prescriptions
-   Retrieve medical information more easily
-   Maintain continuity of medical records
-   Reduce dependence on physical documents
-   Access information through multiple languages
-   Discover nearby healthcare facilities

------------------------------------------------------------------------

## 📈 Future Enhancements

### ✍️ Advanced Handwriting Recognition

Improve recognition of difficult handwritten prescriptions using
specialized handwriting-recognition models and medical vocabulary
correction.

### 🧾 Structured Medical Data

Extract:

``` text
Medicine
Dosage
Frequency
Duration
Diagnosis
Doctor
Date
```

### 📊 OCR Confidence Scoring

``` text
OCR
 ↓
Confidence Score
 ↓
High Confidence → Store
Low Confidence → Human Verification
```

### 🔗 MCP Integration

An **MCP (Model Context Protocol) server** could allow the AI layer to
securely interact with approved healthcare tools.

Potential tools:

``` text
get_patient_records()
search_prescriptions()
search_medical_history()
find_nearby_healthcare_facilities()
get_facility_information()
```

### 📱 Offline Support

Future versions could support:

-   Offline-first functionality
-   Local caching
-   Low-bandwidth operation
-   Delayed synchronization
-   SMS-based notifications

### 🏥 Referral Management

Future versions can enable:

``` text
Sub-Centre
    ↓
PHC
    ↓
CHC
    ↓
District Hospital
    ↓
Specialist
```

------------------------------------------------------------------------

## 🏆 Smart India Hackathon 2026

### Problem Statement ID

**26133**

### Problem

**Accessibility and quality of public healthcare services, particularly
in rural and underserved areas.**

### MediSetu Alignment

  Challenge                    MediSetu Solution
  ---------------------------- -----------------------------------
  Paper prescriptions          OCR digitization
  Fragmented records           Digital medical records
  Difficult record retrieval   RAG + ChromaDB
  Language barriers            Multilingual architecture
  Healthcare accessibility     AI-assisted information retrieval
  Facility discovery           OpenStreetMap + Leaflet
  Continuity of care           Patient-linked records

------------------------------------------------------------------------

## 👥 Team

### CTRL-ALT-DEFEAT

**Project:** MediSetu

**Smart India Hackathon 2026**

------------------------------------------------------------------------

## 🤝 Contribution

Create a feature branch:

``` bash
git checkout -b feature/your-feature
```

Make changes:

``` bash
git add .
git commit -m "Add your feature"
```

Push the branch:

``` bash
git push origin feature/your-feature
```

Create a Pull Request on GitHub.

------------------------------------------------------------------------

## 📜 License

This project is developed as part of a hackathon/academic project.

------------------------------------------------------------------------

# ⭐ MediSetu

**Bridging the gap between underserved communities and connected
healthcare.**

### OCR • RAG • AI • ChromaDB • Digital Medical Records • Multilingual Healthcare • Healthcare Discovery

**Built by CTRL-ALT-DEFEAT for Smart India Hackathon 2026.**
