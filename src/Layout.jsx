import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import PrivacyConsent from '@/components/PrivacyConsent';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [showConsent, setShowConsent] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user-consent'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  useEffect(() => {
    if (!isLoading && user && !user.privacy_consent) {
      setShowConsent(true);
    }
  }, [user, isLoading]);

  const handleConsent = () => {
    setShowConsent(false);
    navigate(createPageUrl('Home'));
  };

  return (
    <div className="font-sans antialiased">
      <style>{`
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        
        /* Mobile app-like scrolling */
        html, body {
          overscroll-behavior: none;
        }
        
        /* Remove tap highlight on mobile */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            color: 'black',
          },
        }}
      />
      {showConsent ? (
        <PrivacyConsent onConsent={handleConsent} />
      ) : (
        children
      )}
    </div>
  );
}