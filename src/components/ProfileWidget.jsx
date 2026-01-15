import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';

export default function ProfileWidget() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const handleSignOut = () => {
    base44.auth.logout();
  };

  if (!user) return null;

  return (
    <div className="bg-white border-t border-gray-100 px-6 py-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#5B9BD5]/10 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[#5B9BD5]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-black text-sm truncate">{user.full_name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="flex-shrink-0 border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 flex items-center justify-center"
        >
          <LogOut className="w-4 h-4 mr-1.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}