import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function BatchUpload({ files, onComplete, onClose }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const startedRef = useRef(false);

  /*useEffect(() => {
    processFiles();
  }, []);*/

  useEffect(() => {
    if (startedRef.current) return;
    if (!files?.length) return;
    startedRef.current = true;
    processFiles();
  }, [files]);

  const processFiles = async () => {
    const results = files.map(() => ({ status: 'pending' }));
    setProgress(results);

    for (let i = 0; i < files.length; i++) {
      setCurrentIndex(i);
      results[i] = { status: 'processing' };
      setProgress([...results]);

      try {
        // Upload file
        console.log(`Uploading file ${i + 1}/${files.length}...`);
        const { file_url } = await base44.integrations.Core.UploadFile({ file: files[i] });
        console.log(`File ${i + 1} uploaded:`, file_url);

        // Retry logic for LLM analysis (up to 3 attempts)
        let extractedData = null;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (!extractedData && attempts < maxAttempts) {
          attempts++;
          console.log(`Analyzing document ${i + 1} (attempt ${attempts}/${maxAttempts})...`);
          
          try {
            const result = await base44.integrations.Core.InvokeLLM({
              prompt: `You are an OCR and medical document analysis expert. Read ALL visible text in this medical document image carefully and extract the following information:

            1. title: Create a descriptive title based on the document type and content (e.g., "Medical Certificate - Dr. Smith", "Blood Test Results - June 2024")

            2. document_type: Analyze the ENTIRE document content and classify as ONE of these categories based on what you read:
            - prescription: Documents prescribing medications, medicine names, dosages, Rx symbol, pharmacy instructions
            - lab_report: Blood tests, urine tests, pathology reports, lab values, test results, diagnostic tests
            - imaging: X-ray reports, MRI reports, CT scan reports, ultrasound reports, radiology findings
            - discharge_summary: Hospital discharge papers, admission/discharge dates, hospital stay summary
            - insurance: Insurance claims, coverage documents, billing statements, insurance forms
            - other: Medical certificates, sick leave notes, fitness certificates, doctor's notes, referral letters, any other medical documents

            IMPORTANT: Read the FULL TEXT of the document first, then determine which category it matches MOST CLOSELY based on the content, keywords, and medical terminology you see.

            3. doctor_name: Extract the full name of any doctor, physician, or healthcare provider mentioned. Look for "Dr.", signatures, letterheads, or provider information.

            4. record_date: Find any date on the document - issue date, visit date, or test date. Format as YYYY-MM-DD. Look carefully at the top or bottom of the document.

            5. notes: Extract ALL important information you can read from the document including:
            - Patient conditions or diagnoses mentioned
            - Any medical advice or recommendations
            - Test results or values
            - Medication names and dosages
            - Valid periods (e.g., "valid from X to Y")
            - Any other relevant medical information

            Read every word carefully, including headers, footers, and small text. If you see text but can't read it clearly, still try your best to extract what you can.

            IMPORTANT: You MUST return a valid JSON object with all fields, even if empty strings.`,
              file_urls: [file_url],
              response_json_schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  document_type: { type: "string" },
                  doctor_name: { type: "string" },
                  record_date: { type: "string" },
                  notes: { type: "string" }
                },
                required: ["title", "document_type", "doctor_name", "record_date", "notes"]
              }
            });
            
            if (result && typeof result === 'object') {
              extractedData = result;
              console.log(`Document ${i + 1} analysis successful:`, extractedData);
            }
          } catch (error) {
            console.error(`Document ${i + 1} attempt ${attempts} failed:`, error);
            if (attempts === maxAttempts) {
              console.error(`All analysis attempts failed for document ${i + 1}`);
              // Use default values if all attempts fail
              extractedData = {
                title: '',
                document_type: '',
                doctor_name: '',
                record_date: '',
                notes: ''
              };
            }
          }
        }

        // Save to database with trimmed values
        await base44.entities.MedicalRecord.create({
          title: (extractedData.title && extractedData.title.trim()) || 'Untitled Document',
          document_url: file_url,
          document_type: (extractedData.document_type && extractedData.document_type.trim()) || 'other',
          doctor_name: (extractedData.doctor_name && extractedData.doctor_name.trim()) || '',
          record_date: (extractedData.record_date && extractedData.record_date.trim()) || '',
          date_captured: new Date().toISOString().split('T')[0],
          notes: (extractedData.notes && extractedData.notes.trim()) || ''
        });

        console.log(`Document ${i + 1} saved successfully`);
        results[i] = { status: 'success' };
        setProgress([...results]);
      } catch (error) {
        console.error(`Document ${i + 1} processing failed:`, error);
        results[i] = { status: 'error', error: error.message };
        setProgress([...results]);
      }
    }

    // Wait a bit before completing
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const completedCount = progress.filter(p => p.status === 'success').length;
  const failedCount = progress.filter(p => p.status === 'error').length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black">Uploading Documents</h2>
          {completedCount + failedCount === files.length && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Progress Summary */}
        <div className="mb-6 text-center">
          <div className="text-3xl font-bold text-[#5B9BD5] mb-2">
            {completedCount} / {files.length}
          </div>
          <div className="text-sm text-gray-600">
            {completedCount + failedCount === files.length ? (
              failedCount > 0 ? (
                <span>Upload complete with {failedCount} error(s)</span>
              ) : (
                <span>All documents uploaded successfully</span>
              )
            ) : (
              <span>Processing documents...</span>
            )}
          </div>
        </div>

        {/* Progress List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {progress.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
            >
              <span className="text-sm text-gray-700 font-medium">
                Document {index + 1}
              </span>
              {item.status === 'pending' && (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              )}
              {item.status === 'processing' && (
                <Loader2 className="w-5 h-5 text-[#5B9BD5] animate-spin" />
              )}
              {item.status === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {item.status === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}