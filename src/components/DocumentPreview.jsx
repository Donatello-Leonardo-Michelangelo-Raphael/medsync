import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

export default function DocumentPreview({ imagePreview, file, onBack, onSaved }) {
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(true);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);

  useEffect(() => {
    analyzeDocument();
  }, []);

  const analyzeDocument = async () => {
    setAnalyzing(true);
    
    // Upload the file first to get the URL
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploadedFileUrl(file_url);
    
    // Analyze the document with AI
    const extractedData = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an OCR and medical document analysis expert. Read ALL visible text in this medical document image carefully and extract the following information:

1. title: Create a descriptive title based on the document type and content (e.g., "Medical Certificate - Dr. Smith", "Blood Test Results - June 2024")

2. document_type: Classify as one of these categories:
   - prescription: if it's a medication prescription
   - lab_report: if it contains test results, lab values
   - imaging: if it's an X-ray, MRI, CT scan report
   - discharge_summary: if it's a hospital discharge document
   - insurance: if it's related to insurance or billing
   - other: for medical certificates, sick notes, referrals, or anything else

3. doctor_name: Extract the full name of any doctor, physician, or healthcare provider mentioned. Look for "Dr.", signatures, letterheads, or provider information.

4. record_date: Find any date on the document - issue date, visit date, or test date. Format as YYYY-MM-DD. Look carefully at the top or bottom of the document.

5. notes: Extract ALL important information you can read from the document including:
   - Patient conditions or diagnoses mentioned
   - Any medical advice or recommendations
   - Test results or values
   - Medication names and dosages
   - Valid periods (e.g., "valid from X to Y")
   - Any other relevant medical information

Read every word carefully, including headers, footers, and small text. If you see text but can't read it clearly, still try your best to extract what you can.`,
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          document_type: { type: "string" },
          doctor_name: { type: "string" },
          record_date: { type: "string" },
          notes: { type: "string" }
        }
      }
    });
    
    // Auto-fill the form with extracted data
    if (extractedData.title) setTitle(extractedData.title);
    if (extractedData.document_type) setDocumentType(extractedData.document_type);
    if (extractedData.doctor_name) setDoctorName(extractedData.doctor_name);
    if (extractedData.record_date) setRecordDate(extractedData.record_date);
    if (extractedData.notes) setNotes(extractedData.notes);
    
    setAnalyzing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Use the already uploaded file URL
    const fileUrl = uploadedFileUrl || (await base44.integrations.Core.UploadFile({ file })).file_url;
    
    await base44.entities.MedicalRecord.create({
      title: title || 'Untitled Document',
      document_url: fileUrl,
      document_type: documentType || 'other',
      doctor_name: doctorName,
      record_date: recordDate,
      date_captured: new Date().toISOString().split('T')[0],
      notes: notes
    });
    
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={onBack} className="text-black p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-black font-medium text-base">Document Details</span>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Analyzing Banner */}
        {analyzing && (
          <div className="bg-[#5B9BD5]/10 border-b border-[#5B9BD5]/20 px-6 py-3 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#5B9BD5] animate-pulse" />
            <span className="text-sm text-[#5B9BD5] font-medium">Analyzing document...</span>
          </div>
        )}
        
        {/* Document Thumbnail */}
        <div className="p-6 bg-gray-50 flex justify-center">
          <div className="w-32 aspect-[3/4] rounded-lg overflow-hidden shadow-md bg-white">
            <img
              src={imagePreview}
              alt="Document preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Document Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Blood Test Results"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={analyzing}
              className="h-12 text-base border-gray-200 focus:border-[#5B9BD5] focus:ring-[#5B9BD5] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Document Type
            </Label>
            <Select value={documentType} onValueChange={setDocumentType} disabled={analyzing}>
              <SelectTrigger className="h-12 text-base border-gray-200 focus:border-[#5B9BD5] focus:ring-[#5B9BD5] disabled:opacity-50 disabled:cursor-not-allowed">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="lab_report">Lab Report</SelectItem>
                <SelectItem value="imaging">Imaging / X-Ray</SelectItem>
                <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                <SelectItem value="insurance">Insurance Document</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor" className="text-sm font-medium text-gray-700">
              Doctor's Name
            </Label>
            <Input
              id="doctor"
              placeholder="e.g., Dr. Smith"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              disabled={analyzing}
              className="h-12 text-base border-gray-200 focus:border-[#5B9BD5] focus:ring-[#5B9BD5] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recordDate" className="text-sm font-medium text-gray-700">
              Record Date
            </Label>
            <Input
              id="recordDate"
              type="date"
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
              disabled={analyzing}
              className="h-12 text-base border-gray-200 focus:border-[#5B9BD5] focus:ring-[#5B9BD5] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={analyzing}
              className="min-h-[100px] text-base border-gray-200 focus:border-[#5B9BD5] focus:ring-[#5B9BD5] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <Button
          onClick={handleSave}
          disabled={saving || analyzing}
          className="w-full h-14 text-base font-medium bg-[#5B9BD5] hover:bg-[#4A8AC4] text-white disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : analyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Document
            </>
          )}
        </Button>
      </div>
    </div>
  );
}