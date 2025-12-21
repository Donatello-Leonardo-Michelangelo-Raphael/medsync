import React, { useState } from 'react';
import { Camera, FileText, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import CameraCapture from '@/components/CameraCapture';
import ConfirmPhoto from '@/components/ConfirmPhoto';
import DocumentPreview from '@/components/DocumentPreview';
import { toast } from 'sonner';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('home'); // home, camera, confirm, preview
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);

  const handleStartScan = () => {
    setCurrentStep('camera');
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
    setCapturedImage(null);
    setCapturedFile(null);
    setCurrentStep('home');
  };

  const handleClose = () => {
    setCapturedImage(null);
    setCapturedFile(null);
    setCurrentStep('home');
  };

  const handleBackToConfirm = () => {
    setCurrentStep('confirm');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_6947f41fb4081c02105700f9/4ad0fbca1_logo-removebg-preview.png"
            alt="MedSync"
            className="h-10 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Decorative Shape */}
        <div className="mb-10">
          <div className="w-32 h-32 relative">
            {/* Abstract geometric shape */}
            <div className="absolute inset-0 rounded-3xl bg-[#5B9BD5]/10 rotate-6" />
            <div className="absolute inset-0 rounded-3xl bg-[#5B9BD5]/20 -rotate-6" />
            <div className="absolute inset-0 rounded-3xl bg-white border-2 border-[#5B9BD5]/30 flex items-center justify-center">
              <FileText className="w-14 h-14 text-[#5B9BD5]" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-black text-center mb-3">
          Medical Records
        </h1>
        <p className="text-gray-500 text-center text-base mb-12 max-w-xs">
          Scan and organize your medical documents in one place
        </p>

        {/* Scan Button */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-xs"
        >
          <Button
            onClick={handleStartScan}
            className="w-full h-16 text-lg font-medium bg-[#5B9BD5] hover:bg-[#4A8AC4] text-white rounded-2xl shadow-lg shadow-[#5B9BD5]/25"
          >
            <Camera className="w-6 h-6 mr-3" />
            Scan Document
          </Button>
        </motion.div>

        {/* Secondary Action */}
        <Link to={createPageUrl('Records')} className="mt-6 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
          <FolderOpen className="w-5 h-5" />
          <span className="text-base">View All Records</span>
        </Link>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center">
        <p className="text-xs text-gray-400">
          Your data is securely stored
        </p>
      </footer>

      {/* Overlays */}
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}