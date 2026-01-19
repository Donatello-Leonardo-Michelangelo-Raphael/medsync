import React from 'react';
import { X, Image, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UploadOptions({ onSelectGallery, onSelectCamera, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black">Upload Document</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Button
            onClick={onSelectGallery}
            variant="outline"
            className="w-full h-16 text-base justify-start border-2 hover:border-[#5B9BD5] hover:bg-[#5B9BD5]/5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#5B9BD5]/10 flex items-center justify-center mr-4">
              <Image className="w-5 h-5 text-[#5B9BD5]" />
            </div>
            <div className="text-left">
              <p className="font-medium text-black">Choose from Gallery</p>
              <p className="text-xs text-gray-500">Select from your device</p>
            </div>
          </Button>

          <Button
            onClick={onSelectCamera}
            variant="outline"
            className="w-full h-16 text-base justify-start border-2 hover:border-[#5B9BD5] hover:bg-[#5B9BD5]/5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#5B9BD5]/10 flex items-center justify-center mr-4">
              <Camera className="w-5 h-5 text-[#5B9BD5]" />
            </div>
            <div className="text-left">
              <p className="font-medium text-black">Scan with Camera</p>
              <p className="text-xs text-gray-500">Take a photo now</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}