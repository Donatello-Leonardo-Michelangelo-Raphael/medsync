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
                <h2 className="font-semibold text-black text-base mb-2">1. Data Controller</h2>
                <p>This application processes your personal data as a data controller. If you have questions about this privacy policy or your data, you can contact us at the email provided in your account settings.</p>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">2. What Personal Data We Collect</h2>
                <p>We collect and process the following personal data that you provide directly to us:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Account Information:</strong> Name, email address</li>
                  <li><strong>Medical Document Images:</strong> Photos and scans of prescriptions, lab reports, medical certificates, and other health-related documents</li>
                  <li><strong>Document Metadata:</strong> Document titles, doctor names, record dates, document types, and notes</li>
                  <li><strong>Usage Data:</strong> Information about how you use the application</li>
                </ul>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">3. Legal Basis and Purpose for Processing</h2>
                <p>We process your personal data based on the following lawful grounds:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Consent (Article 6(1)(a) GDPR):</strong> By accepting this privacy policy, you give explicit consent for us to process your medical documents and related data</li>
                  <li><strong>Contract Performance (Article 6(1)(b) GDPR):</strong> Processing is necessary to provide you with the medical records management service</li>
                </ul>
                <p className="mt-2">We use your data specifically to:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Store and organize your medical records securely</li>
                  <li>Provide OCR (Optical Character Recognition) and automated document analysis using AI to extract information from your medical documents</li>
                  <li>Enable you to search and retrieve your medical records</li>
                  <li>Maintain and improve the service functionality</li>
                </ul>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">4. Data Minimization and Storage Limitation</h2>
                <p>We only collect and process personal data that is necessary for the purposes stated above. We do not collect excessive data.</p>
                <p className="mt-2">Your data will be stored for as long as you maintain your account. If you delete your account, your data will be permanently deleted within 30 days.</p>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">5. Data Security and Protection</h2>
                <p>We implement appropriate technical and organizational measures to protect your personal data, including:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Encryption:</strong> All data is encrypted in transit (HTTPS/TLS) and at rest</li>
                  <li><strong>Access Controls:</strong> Your data is only accessible to you through secure authentication</li>
                  <li><strong>Secure Infrastructure:</strong> We use industry-standard cloud infrastructure with robust security measures</li>
                </ul>
                <p className="mt-2">In the event of a data breach that poses a risk to your rights and freedoms, we will notify you within 72 hours as required by Article 33 GDPR.</p>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">6. Data Sharing and Third-Party Processors</h2>
                <p>We do not sell or share your personal medical information with third parties for marketing purposes.</p>
                <p className="mt-2">We may use third-party service providers (data processors) to help operate our service, including:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Cloud hosting providers:</strong> To store your data securely</li>
                  <li><strong>AI/OCR services:</strong> To analyze and extract information from your medical documents</li>
                </ul>
                <p className="mt-2">All third-party processors are contractually bound to protect your data and use it only for the purposes we specify, in compliance with GDPR requirements.</p>
                <p className="mt-2">We do not transfer your data outside the European Economic Area (EEA). If such transfers become necessary, we will implement appropriate safeguards as required by Chapter V GDPR.</p>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">7. Your GDPR Rights</h2>
                <p>Under the GDPR, you have the following rights regarding your personal data:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Right of Access (Article 15):</strong> You can access all your data at any time through the application</li>
                  <li><strong>Right to Rectification (Article 16):</strong> You can edit and correct your data</li>
                  <li><strong>Right to Erasure / "Right to be Forgotten" (Article 17):</strong> You can delete individual records or your entire account and all associated data</li>
                  <li><strong>Right to Data Portability (Article 20):</strong> You can export your data in a commonly used format</li>
                  <li><strong>Right to Withdraw Consent (Article 7(3)):</strong> You can withdraw your privacy consent at any time through the Settings page, which will prevent access to the app until you provide consent again</li>
                  <li><strong>Right to Object (Article 21):</strong> You can object to data processing</li>
                  <li><strong>Right to Lodge a Complaint (Article 77):</strong> You have the right to lodge a complaint with your local data protection supervisory authority</li>
                </ul>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">8. Automated Decision-Making</h2>
                <p>We use automated AI systems to analyze your medical documents and extract information (OCR). This is done solely to help you organize your records more efficiently. The system does not make any decisions that produce legal effects or similarly significantly affect you.</p>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">9. Children's Data</h2>
                <p>This service is not intended for children under 16 years of age. We do not knowingly collect personal data from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us.</p>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">10. Changes to This Privacy Policy</h2>
                <p>We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes through the application or by email. The date of the last update will be indicated at the top of this policy.</p>
                <p className="mt-2"><strong>Last updated:</strong> January 21, 2026</p>
              </section>

              <section>
                <h2 className="font-semibold text-black text-base mb-2">11. Contact Information</h2>
                <p>If you have any questions about this privacy policy or wish to exercise your GDPR rights, please contact us through the application settings or at the email address associated with your account.</p>
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