import React from 'react';
import { RotateCcw, Check, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConfirmPhoto({ imagePreview, onRetake, onContinue, onAddAnother, onClose, showAddAnother = false }) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button onClick={onClose} className="text-black p-2">
          <X className="w-6 h-6" />
        </button>
        <span className="text-black font-medium text-base">Review Photo</span>
        <div className="w-10" />
      </div>

      {/* Image Preview */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-sm aspect-[3/4] rounded-lg overflow-hidden shadow-lg bg-white">
          <img
            src={imagePreview}
            alt="Captured document"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-white border-t border-gray-100">
        <p className="text-center text-gray-600 text-sm mb-6">
          Is the document clear and readable?
        </p>
        <div className="space-y-3">
          {showAddAnother && (
            <Button
              onClick={onAddAnother}
              className="w-full h-14 text-base font-medium bg-[#5B9BD5] hover:bg-[#4A8AC4] text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Photo
            </Button>
          )}
          <div className="flex gap-4">
            <Button
              onClick={onRetake}
              variant="outline"
              className="flex-1 h-14 text-base font-medium border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake
            </Button>
            <Button
              onClick={onContinue}
              className="flex-1 h-14 text-base font-medium bg-[#5B9BD5] hover:bg-[#4A8AC4] text-white"
            >
              <Check className="w-5 h-5 mr-2" />
              {showAddAnother ? 'Upload All' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}