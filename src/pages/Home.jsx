import React, { useState } from 'react';
import { Camera, FileText, FolderOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import CameraCapture from '@/components/CameraCapture';
import ConfirmPhoto from '@/components/ConfirmPhoto';
import DocumentPreview from '@/components/DocumentPreview';
import SearchRecords from '@/components/SearchRecords';
import ProfileWidget from '@/components/ProfileWidget';
import UploadOptions from '@/components/UploadOptions';
import { toast } from 'sonner';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('home'); // home, options, camera, confirm, preview, search
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [imageQueue, setImageQueue] = useState([]);
  const fileInputRef = React.useRef(null);
  const cameraInputRef = React.useRef(null);

  const handleStartScan = () => {
    setCurrentStep('options');
  };

  const handleSelectGallery = () => {
    fileInputRef.current?.click();
    setCurrentStep('home');
  };

  const handleSelectCamera = () => {
    cameraInputRef.current?.click();
    setCurrentStep('home');
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) return;

    // Process all images
    const imagePromises = imageFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({ preview: event.target.result, file });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      // Set the first image for preview
      setCapturedImage(images[0].preview);
      setCapturedFile(images[0].file);
      // Queue the rest
      setImageQueue(images.slice(1));
      setCurrentStep('confirm');
    });

    e.target.value = '';
  };

  const handleCapture = (imageData, file) => {
    setCapturedImage(imageData);
    setCapturedFile(file);
    setCurrentStep('confirm');
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setCurrentStep('camera');
  };

  const handleContinue = () => {
    setCurrentStep('preview');
  };

  const handleSaved = () => {
    toast.success('Document saved successfully');
    
    // Check if there are more images in the queue
    if (imageQueue.length > 0) {
      // Move to next image
      const nextImage = imageQueue[0];
      setCapturedImage(nextImage.preview);
      setCapturedFile(nextImage.file);
      setImageQueue(imageQueue.slice(1));
      setCurrentStep('confirm');
    } else {
      // All done
      setCapturedImage(null);
      setCapturedFile(null);
      setCurrentStep('home');
    }
  };

  const handleClose = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setCurrentStep('home');
  };

  const handleBackToConfirm = () => {
    setCurrentStep('confirm');
  };

  const handleOpenSearch = () => {
    setCurrentStep('search');
  };

  const handleCloseSearch = () => {
    setCurrentStep('home');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6947f41fb4081c02105700f9/4ad0fbca1_logo-removebg-preview.png"
            alt="MedSync"
            className="h-10 object-contain"
          />
          <button 
            onClick={handleOpenSearch}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        {/* Decorative Shape */}
        <div className="mb-4">
          <div className="w-20 h-20 relative">
            {/* Abstract geometric shape */}
            <div className="absolute inset-0 rounded-2xl bg-[#5B9BD5]/10 rotate-6" />
            <div className="absolute inset-0 rounded-2xl bg-[#5B9BD5]/20 -rotate-6" />
            <div className="absolute inset-0 rounded-2xl bg-white border-2 border-[#5B9BD5]/30 flex items-center justify-center">
              <FileText className="w-9 h-9 text-[#5B9BD5]" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-black text-center mb-2">
          Medical Records
        </h1>
        <p className="text-gray-500 text-center text-sm mb-6 max-w-xs">
          Scan and organize your medical documents in one place
        </p>

        {/* Scan Button */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-xs"
        >
          <Button
            onClick={handleStartScan}
            className="w-full h-14 text-base font-medium bg-[#5B9BD5] hover:bg-[#4A8AC4] text-white rounded-2xl shadow-lg shadow-[#5B9BD5]/25"
          >
            <Camera className="w-5 h-5 mr-2" />
            Upload Document
          </Button>
        </motion.div>

        {/* Secondary Action */}
        <Link to={createPageUrl('Records')} className="mt-4 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
          <FolderOpen className="w-4 h-4" />
          <span className="text-sm">View All Records</span>
        </Link>
      </main>

      {/* Footer */}
      <footer className="text-center">
        <p className="text-xs text-gray-400 px-6 py-1">
          Your data is securely stored
        </p>
      </footer>

      {/* Profile Widget */}
      <ProfileWidget />

      {/* Hidden File Input for Gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Hidden File Input for Camera */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Overlays */}
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

        {currentStep === 'camera' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CameraCapture
              onCapture={handleCapture}
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
              onClose={handleClose}
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
            />
          </motion.div>
        )}

        {currentStep === 'search' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SearchRecords onClose={handleCloseSearch} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}