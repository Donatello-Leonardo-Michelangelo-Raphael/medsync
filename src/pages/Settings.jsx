import React, { useState } from 'react';
import { ArrowLeft, Shield, AlertTriangle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const [loading, setLoading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me()
  });

  const handleWithdrawConsent = async () => {
    setLoading(true);
    try {
      await base44.auth.updateMe({
        privacy_consent: false,
        privacy_consent_date: null
      });
      toast.success('Consent withdrawn. Please refresh the page.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Failed to withdraw consent:', error);
      toast.error('Failed to withdraw consent');
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <Link to={createPageUrl('Home')} className="text-black p-2">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-black">Settings</h1>
      </header>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Account Section */}
        <section>
          <h2 className="text-lg font-semibold text-black mb-3">Account</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Name</span>
              <span className="text-sm font-medium text-black">{user?.full_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Email</span>
              <span className="text-sm font-medium text-black">{user?.email}</span>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section>
          <h2 className="text-lg font-semibold text-black mb-3">Privacy & Data</h2>
          
          {/* Consent Status */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-green-900 mb-1">Privacy Consent Active</h3>
                {user?.privacy_consent_date && (
                  <p className="text-xs text-green-700">
                    Accepted on {new Date(user.privacy_consent_date).toLocaleDateString()} at {new Date(user.privacy_consent_date).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Withdraw Consent */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Withdraw Privacy Consent
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Withdraw Privacy Consent?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    Withdrawing your consent will prevent you from using the app until you accept the privacy policy again.
                  </p>
                  <p className="font-medium text-black">
                    Your data will remain stored but you won't be able to access it.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleWithdrawConsent}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Processing...' : 'Withdraw Consent'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        {/* Sign Out */}
        <section>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full h-12 border-2 border-gray-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </section>
      </div>
    </div>
  );
}