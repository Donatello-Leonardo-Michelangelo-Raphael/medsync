import React from 'react';
import { Toaster } from 'sonner';

export default function Layout({ children }) {
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
      {children}
    </div>
  );
}