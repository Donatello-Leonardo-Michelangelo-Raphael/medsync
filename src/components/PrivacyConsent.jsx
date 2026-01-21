import React, { useState } from 'react';
import { Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { base44 } from '@/api/base44Client';

export default function PrivacyConsent({ onConsent }) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await base44.auth.updateMe({
        privacy_consent: true,
        privacy_consent_date: new Date().toISOString()
      });
      onConsent();
    } catch (error) {
      console.error('Failed to save consent:', error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#5B9BD5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-[#5B9BD5]" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">Privacy Policy & Consent</h1>
          <p className="text-gray-600">Please review and accept our privacy policy to continue</p>
        </div>

        <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 mb-6">
          <ScrollArea className="h-[400px] p-6">
            <div className="space-y-4 text-sm text-gray-700">
              <section>
                <h2 className="font-semibold text-black text-base mb-2">1. Information We Collect</h2>
                <p>We collect and store medical documents and related information that you choose to upload, including:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Medical document images (prescriptions, lab reports, etc.)</li>
                  <li>Document metadata (dates, doctor names, notes)</li>
                  <li>Your account information (name, email)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">2. How We Use Your Information</h2>
                <p>Your information is used to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Store and organize your medical records securely</li>
                  <li>Provide OCR and document analysis features</li>
                  <li>Improve our services and user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">3. Data Security</h2>
                <p>We implement industry-standard security measures to protect your sensitive medical information. Your data is encrypted in transit and at rest.</p>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">4. Data Sharing</h2>
                <p>We do not sell or share your personal medical information with third parties. Your data is private and only accessible to you.</p>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">5. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Access your data at any time</li>
                  <li>Delete your records and account</li>
                  <li>Withdraw consent at any time</li>
                  <li>Export your data</li>
                </ul>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">6. Updates to This Policy</h2>
                <p>We may update this privacy policy from time to time. We will notify you of any significant changes.</p>
              </section>
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl">
            <Checkbox
              id="consent"
              checked={agreed}
              onCheckedChange={setAgreed}
              className="mt-0.5"
            />
            <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer flex-1">
              I have read and agree to the privacy policy. I understand how my medical data will be collected, used, and protected.
            </label>
          </div>

          <Button
            onClick={handleAccept}
            disabled={!agreed || loading}
            className="w-full h-14 text-base font-medium bg-[#5B9BD5] hover:bg-[#4A8AC4] text-white disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Accept & Continue
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}