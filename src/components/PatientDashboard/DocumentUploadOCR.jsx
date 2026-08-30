import React, { useState } from 'react';
import { Upload, Scan, FileText, CheckCircle2, AlertCircle, Sparkles, RefreshCw, Eye, Save } from 'lucide-react';
import { processDocumentOCR } from '../../services/ocrService.js';
import { dbPut, enqueueSyncAction } from '../../services/db.js';

export const DocumentUploadOCR = ({ patient, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [docType, setDocType] = useState('prescription');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const samplePrescriptionSlip = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80';
  const sampleLabReport = 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setExtractedData(null);
    }
  };

  const handleSelectSample = (type) => {
    setDocType(type);
    setSelectedFile({ name: type === 'lab' ? 'Kolar_PHC_Lab_Diabetic_Panel.pdf' : 'Village_Arogya_Prescription_Slip.jpg' });
    setPreviewUrl(type === 'lab' ? sampleLabReport : samplePrescriptionSlip);
    setExtractedData(null);
  };

  const handleRunOCR = async () => {
    if (!previewUrl) return;

    setIsScanning(true);
    setExtractedData(null);

    try {
      const result = await processDocumentOCR(selectedFile || { name: 'slip.jpg' }, docType, (step) => {
        setScanStep(step);
      });

      setExtractedData(result);
      setIsScanning(false);
    } catch (err) {
      console.error(err);
      setIsScanning(false);
    }
  };

  const handleSaveToRecord = async () => {
    if (!extractedData || !patient) return;
    setIsSaving(true);

    try {
      const recordId = 'rec-' + Date.now();

      if (extractedData.documentType.includes('Prescription')) {
        const newPrescription = {
          id: 'pres-' + Date.now(),
          patientId: patient.id,
          doctorId: 'doc-001',
          doctorName: extractedData.doctorExtracted || 'Dr. Ramesh Kumar, MBBS',
          facilityName: extractedData.facilityExtracted || 'Kolar Sub-Divisional Health Centre',
          facilityTier: 'Health Centre',
          date: extractedData.dateExtracted,
          diagnosis: extractedData.extractedEntities.diagnosis,
          notes: extractedData.extractedEntities.clinicalAdvice,
          status: 'Active',
          drugs: extractedData.extractedEntities.medications
        };
        await dbPut('prescriptions', newPrescription);
      }

      const newRecord = {
        id: recordId,
        patientId: patient.id,
        facilityName: extractedData.facilityExtracted,
        facilityTier: docType === 'lab' ? 'Health Centre' : 'Village Clinic',
        date: extractedData.dateExtracted,
        type: extractedData.documentType,
        provider: extractedData.doctorExtracted,
        summary: docType === 'lab' ? 'Blood Sugar & Health Check' : extractedData.extractedEntities.diagnosis,
        labResults: extractedData.extractedEntities.tests || null,
        ocrExtracted: true,
        ocrConfidence: extractedData.confidence,
        tags: extractedData.tags,
        fileUrl: previewUrl
      };

      await dbPut('records', newRecord);
      await enqueueSyncAction('OCR_RECORD_SAVE', { recordId, patientId: patient.id });

      setIsSaving(false);
      onUploadComplete && onUploadComplete(newRecord);
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="med-card" style={{ padding: '2rem' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-teal">Smart Doctor Slip Scanner</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Reads Handwriting & Doctor Stamps</span>
        </div>
        <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-navy-dark)', margin: 0 }}>
          Scan Doctor Slips & Save to Your Health History
        </h3>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Take a photo of any doctor note, clinic slip, or lab test to save it clearly in your family's health history.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        
        {/* LEFT COLUMN: UPLOAD & PREVIEW */}
        <div>
          
          {/* QUICK DEMO PRESET SLIPS */}
          <div style={{
            background: 'var(--bg-page)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
              Select a sample document to test:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleSelectSample('prescription')}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem' }}
              >
                📄 Doctor Rx Slip
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('lab')}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem' }}
              >
                🔬 Blood Test Report
              </button>
            </div>
          </div>

          {/* UPLOAD DROPZONE / IMAGE VIEWER */}
          <div style={{
            border: '2px dashed var(--medical-teal)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            textAlign: 'center',
            background: '#ffffff',
            position: 'relative',
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {previewUrl ? (
              <div style={{ position: 'relative', width: '100%', maxHeight: '260px' }}>
                <img 
                  src={previewUrl} 
                  alt="Medical Document" 
                  style={{ width: '100%', maxHeight: '240px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
                />
              </div>
            ) : (
              <div>
                <Upload size={36} color="var(--medical-teal)" style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--primary-navy-dark)', marginBottom: '0.25rem' }}>
                  Upload prescription photo or PDF
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '1rem' }}>
                  Supported formats: JPG, PNG, WebP, PDF up to 10MB
                </div>
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange}
                  style={{ fontSize: '0.8125rem' }}
                />
              </div>
            )}
          </div>

          {previewUrl && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={handleRunOCR}
                disabled={isScanning}
                className="btn btn-teal btn-lg"
                style={{ flex: 1 }}
              >
                <Sparkles size={18} />
                <span>{isScanning ? 'Reading Slip...' : 'Scan Doctor Slip'}</span>
              </button>

              <button 
                onClick={() => { setPreviewUrl(null); setExtractedData(null); }}
                className="btn btn-secondary"
                title="Clear image"
              >
                Clear
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div style={{
          background: 'var(--bg-page)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy-dark)', margin: 0 }}>
                Information Read from Slip
              </h4>
              {extractedData && (
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                  {extractedData.confidence}% Confidence
                </span>
              )}
            </div>

            {/* SCANNING PROGRESS BAR */}
            {isScanning && scanStep && (
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <span>Reading Progress</span>
                  <span>{scanStep.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-muted)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div style={{ width: `${scanStep.progress}%`, height: '100%', background: 'var(--medical-teal)', transition: 'width 0.3s ease' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {scanStep.stage}
                </div>
              </div>
            )}

            {/* EXTRACTED CONTENT VIEW */}
            {extractedData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Doctor & Clinic:</div>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--primary-navy-dark)' }}>{extractedData.facilityExtracted}</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{extractedData.doctorExtracted}</div>
                </div>

                {extractedData.extractedEntities.diagnosis && (
                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Health Condition / Diagnosis:</div>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--medical-teal-dark)' }}>
                      {extractedData.extractedEntities.diagnosis}
                    </strong>
                  </div>
                )}

                {/* MEDICATIONS */}
                {extractedData.extractedEntities.medications && (
                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.4rem' }}>
                      Medicines ({extractedData.extractedEntities.medications.length}):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {extractedData.extractedEntities.medications.map((m, midx) => (
                        <div key={midx} style={{ fontSize: '0.8125rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>• <strong>{m.name}</strong> ({m.dosage})</span>
                          <span style={{ color: 'var(--text-muted)' }}>{m.timing}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LAB TESTS */}
                {extractedData.extractedEntities.tests && (
                  <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginBottom: '0.4rem' }}>
                      Blood & Lab Test Results:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {extractedData.extractedEntities.tests.map((t, tidx) => (
                        <div key={tidx} style={{ fontSize: '0.8125rem', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{t.test}:</span>
                          <strong style={{ color: t.status === 'High' ? 'var(--urgent-red)' : 'var(--success-green)' }}>
                            {t.value} ({t.status})
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : !isScanning ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-subtle)' }}>
                <Scan size={32} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  Upload or select a prescription above and click "Scan Doctor Slip" to read the medicines and advice.
                </p>
              </div>
            ) : null}

          </div>

          {/* SAVE BUTTON */}
          {extractedData && (
            <div style={{ marginTop: '1.5rem' }}>
              <button 
                onClick={handleSaveToRecord}
                disabled={isSaving}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                <Save size={18} />
                <span>{isSaving ? 'Saving...' : 'Save to My Health History'}</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
