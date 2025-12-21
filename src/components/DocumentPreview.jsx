import React, { useState } from 'react';
import { ArrowLeft, Save, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';

export default function DocumentPreview({ imagePreview, file, onBack, onSaved }) {
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    
    await base44.entities.MedicalRecord.create({
      title: title || 'Untitled Document',
      document_url: file_url,
      document_type: documentType || 'other',
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
              className="h-12 text-base border-gray-200 focus:border-[#5B9BD5] focus:ring-[#5B9BD5]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Document Type
            </Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="h-12 text-base border-gray-200 focus:border-[#5B9BD5] focus:ring-[#5B9BD5]">
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
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] text-base border-gray-200 focus:border-[#5B9BD5] focus:ring-[#5B9BD5] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-14 text-base font-medium bg-[#5B9BD5] hover:bg-[#4A8AC4] text-white disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
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