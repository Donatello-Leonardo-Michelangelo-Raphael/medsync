import React, { useState, useEffect } from 'react';
import { ArrowLeft, Folder, FileText, Calendar, User, ChevronRight, Plus, Camera, Image, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { AnimatePresence, motion } from 'framer-motion';
import UploadOptions from '@/components/UploadOptions';
import CameraCapture from '@/components/CameraCapture';
import ConfirmPhoto from '@/components/ConfirmPhoto';
import DocumentPreview from '@/components/DocumentPreview';
import BatchUpload from '@/components/BatchUpload';
import { toast } from 'sonner';

export default function Records() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [batchFiles, setBatchFiles] = useState([]);
  const [queuedPhotos, setQueuedPhotos] = useState([]);
  const [fromCamera, setFromCamera] = useState(false);
  const fileInputRef = React.useRef(null);
  const cameraInputRef = React.useRef(null);

  // Check for folder parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const folderParam = params.get('folder');
    if (folderParam) {
      setSelectedFolder(folderParam);
    }
  }, []);

  const handleAddDocument = () => {
    setCurrentStep('options');
  };

  const handleSelectGallery = () => {
    setFromCamera(false);
    fileInputRef.current?.click();
    setCurrentStep(null);
  };

  const handleSelectCamera = () => {
    setFromCamera(true);
    cameraInputRef.current?.click();
    setCurrentStep(null);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) return;

    if (imageFiles.length > 1) {
      // Multiple files - batch upload
      setBatchFiles(imageFiles);
      setCurrentStep('batch');
    } else {
      // Single file - normal flow
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        setCapturedFile(imageFiles[0]);
        setCurrentStep('confirm');
      };
      reader.readAsDataURL(imageFiles[0]);
    }

    e.target.value = '';
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setCurrentStep('options');
  };

  const handleContinue = () => {
    // If from camera and have queued photos, process all as batch
    if (fromCamera && queuedPhotos.length > 0) {
      const allPhotos = [...queuedPhotos, capturedFile];
      setBatchFiles(allPhotos);
      setQueuedPhotos([]);
      setCapturedImage(null);
      setCapturedFile(null);
      setCurrentStep('batch');
    } else {
      setCurrentStep('preview');
    }
  };

  const handleTakeAnotherPhoto = () => {
    // Add current photo to queue
    setQueuedPhotos([...queuedPhotos, capturedFile]);
    setCapturedImage(null);
    setCapturedFile(null);
    // Trigger camera again
    cameraInputRef.current?.click();
  };

  const handleSaved = () => {
    toast.success('Document saved successfully');
    setCapturedImage(null);
    setCapturedFile(null);
    
    // If from camera, show option to take another
    if (fromCamera) {
      setCurrentStep('saved');
    } else {
      setCurrentStep(null);
      window.location.reload();
    }
  };

  const handleTakeAnother = () => {
    setFromCamera(true);
    cameraInputRef.current?.click();
    setCurrentStep(null);
  };

  const handleDoneScanning = () => {
    setFromCamera(false);
    setCurrentStep(null);
    window.location.reload();
  };

  const handleBatchComplete = () => {
    toast.success('All documents uploaded successfully');
    setBatchFiles([]);
    setQueuedPhotos([]);
    setFromCamera(false);
    setCurrentStep(null);
    window.location.reload();
  };

  const handleClose = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setBatchFiles([]);
    setQueuedPhotos([]);
    setFromCamera(false);
    setCurrentStep(null);
  };

  const handleBackToConfirm = () => {
    setCurrentStep('confirm');
  };

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['medical-records'],
    queryFn: () => base44.entities.MedicalRecord.list('-created_date')
  });

  // Group records by document type
  const folderData = {
    prescription: { label: 'Prescriptions', color: 'bg-blue-50 border-blue-200', icon: 'text-blue-600' },
    lab_report: { label: 'Lab Reports', color: 'bg-green-50 border-green-200', icon: 'text-green-600' },
    imaging: { label: 'Imaging', color: 'bg-purple-50 border-purple-200', icon: 'text-purple-600' },
    discharge_summary: { label: 'Discharge Summaries', color: 'bg-orange-50 border-orange-200', icon: 'text-orange-600' },
    insurance: { label: 'Insurance', color: 'bg-yellow-50 border-yellow-200', icon: 'text-yellow-600' },
    other: { label: 'Other Documents', color: 'bg-gray-50 border-gray-200', icon: 'text-gray-600' }
  };

  const groupedRecords = records.reduce((acc, record) => {
    const type = record.document_type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(record);
    return acc;
  }, {});

  // Sort records within each folder by date (descending)
  Object.keys(groupedRecords).forEach(key => {
    groupedRecords[key].sort((a, b) => 
      new Date(b.record_date || b.created_date) - new Date(a.record_date || a.created_date)
    );
  });

  if (selectedFolder) {
    const folderRecords = groupedRecords[selectedFolder] || [];
    const folderInfo = folderData[selectedFolder];

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
          <button onClick={() => setSelectedFolder(null)} className="text-black p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-black">{folderInfo.label}</h1>
        </header>

        {/* Documents List */}
        <div className="p-6 space-y-3">
          {folderRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No documents in this folder</p>
            </div>
          ) : (
            folderRecords.map(record => (
              <Link
                key={record.id}
                to={createPageUrl('DocumentDetail') + '?id=' + record.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow block"
              >
                <div className="flex gap-3">
                  <img
                    src={record.document_url}
                    alt={record.title}
                    className="w-16 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-black mb-1 truncate">{record.title}</h3>
                    {record.doctor_name && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate">{record.doctor_name}</span>
                      </div>
                    )}
                    {record.record_date && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(record.record_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <Link to={createPageUrl('Home')} className="text-black p-2">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-black">All Records</h1>
      </header>

      {/* Folders Grid */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(folderData).map(([type, info]) => {
              const count = groupedRecords[type]?.length || 0;
              return (
                <button
                  key={type}
                  onClick={() => count > 0 && setSelectedFolder(type)}
                  className={`${info.color} border-2 rounded-2xl p-5 text-left transition-all ${
                    count > 0 ? 'hover:shadow-lg active:scale-95' : 'opacity-50'
                  }`}
                  disabled={count === 0}
                >
                  <Folder className={`w-10 h-10 mb-3 ${info.icon}`} />
                  <h3 className="font-medium text-black text-sm mb-1">{info.label}</h3>
                  <p className="text-xs text-gray-600">{count} document{count !== 1 ? 's' : ''}</p>
                </button>
              );
            })}
          </div>
        )}

        {records.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No records yet</p>
            <p className="text-sm text-gray-400">Scan your first document to get started</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleAddDocument}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#5B9BD5] hover:bg-[#4A8AC4] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Overlays */}
      <AnimatePresence>
        {currentStep === 'options' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <UploadOptions
              onSelectGallery={handleSelectGallery}
              onSelectCamera={handleSelectCamera}
              onClose={handleClose}
            />
          </motion.div>
        )}

        {currentStep === 'confirm' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ConfirmPhoto
              imagePreview={capturedImage}
              onRetake={handleRetake}
              onContinue={handleContinue}
              onTakeAnother={handleTakeAnotherPhoto}
              onClose={handleClose}
              showTakeAnother={fromCamera}
              queuedCount={queuedPhotos.length}
            />
          </motion.div>
        )}

        {currentStep === 'preview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DocumentPreview
              imagePreview={capturedImage}
              file={capturedFile}
              onBack={handleBackToConfirm}
              onSaved={handleSaved}
              fromCamera={fromCamera}
              onTakeAnother={handleTakeAnother}
            />
          </motion.div>
        )}

        {currentStep === 'batch' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BatchUpload
              files={batchFiles}
              onComplete={handleBatchComplete}
              onClose={handleClose}
            />
          </motion.div>
        )}

        {currentStep === 'saved' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-black mb-2">Document Saved!</h2>
                  <p className="text-gray-600 text-sm">Would you like to scan another document?</p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={handleTakeAnother}
                    className="w-full h-14 text-base font-medium bg-[#5B9BD5] hover:bg-[#4A8AC4] text-white"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Scan Another
                  </Button>
                  <Button
                    onClick={handleDoneScanning}
                    variant="outline"
                    className="w-full h-14 text-base font-medium"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}