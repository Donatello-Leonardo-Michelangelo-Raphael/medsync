import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CameraCapture({ onCapture, onClose }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCapture = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black">
        <button onClick={onClose} className="text-white p-2">
          <X className="w-6 h-6" />
        </button>
        <span className="text-white font-medium text-base">Scan Document</span>
        <div className="w-10" />
      </div>

      {/* Camera Viewfinder Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 relative">
        {/* Scan Frame */}
        <div className="w-[85%] aspect-[3/4] border-2 border-white/40 rounded-lg relative">
          {/* Corner Markers */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#5B9BD5] rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#5B9BD5] rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#5B9BD5] rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#5B9BD5] rounded-br-lg" />
          
          {/* Center Guide Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/60 text-sm text-center px-8">
              Position your document within the frame
            </p>
          </div>
        </div>
      </div>

      {/* Capture Button Area */}
      <div className="bg-black py-8 flex justify-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={triggerCapture}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent active:bg-white/20 transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <Camera className="w-8 h-8 text-black" />
          </div>
        </button>
      </div>
    </div>
  );
}