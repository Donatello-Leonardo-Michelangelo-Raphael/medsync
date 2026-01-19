import React, { useState } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function DocumentDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const documentId = urlParams.get('id');

  const { data: document, isLoading } = useQuery({
    queryKey: ['medical-record', documentId],
    queryFn: async () => {
      const records = await base44.entities.MedicalRecord.list();
      return records.find(r => r.id === documentId);
    },
    enabled: !!documentId
  });

  const [formData, setFormData] = useState({});

  React.useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        document_type: document.document_type || 'other',
        doctor_name: document.doctor_name || '',
        record_date: document.record_date || '',
        notes: document.notes || ''
      });
    }
  }, [document]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.MedicalRecord.update(documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      queryClient.invalidateQueries({ queryKey: ['medical-record', documentId] });
      toast.success('Document updated successfully');
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#5B9BD5] animate-spin" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Document not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-black p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-black">Document Details</h1>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-[#5B9BD5] hover:bg-[#4A8AC4]"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </header>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Document Image */}
        <div className="w-full aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
          <img
            src={document.document_url}
            alt={document.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Document title"
              className="h-12"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Document Type</label>
            <Select
              value={formData.document_type}
              onValueChange={(value) => setFormData({ ...formData, document_type: value })}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="lab_report">Lab Report</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Doctor Name</label>
            <Input
              value={formData.doctor_name}
              onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
              placeholder="Doctor's name"
              className="h-12"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Record Date</label>
            <Input
              type="date"
              value={formData.record_date}
              onChange={(e) => setFormData({ ...formData, record_date: e.target.value })}
              className="h-12"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              className="min-h-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}