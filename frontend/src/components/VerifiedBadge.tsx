import React from 'react';
import { ShieldCheck, Zap, Award } from 'lucide-react';

interface VerifiedBadgeProps {
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'INFO_REQUESTED';
  identityVerified?: boolean;
  skillVerified?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  status,
  identityVerified = true,
  skillVerified = true,
}) => {
  if (status !== 'APPROVED') {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        Verification Pending
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
        <Zap className="w-3.5 h-3.5 fill-current" />
        Verified Worker
      </span>

      {identityVerified && (
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-2 py-0.5 rounded-md">
          <ShieldCheck className="w-3 h-3 text-blue-600" />
          Identity Verified
        </span>
      )}

      {skillVerified && (
        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-medium px-2 py-0.5 rounded-md">
          <Award className="w-3 h-3 text-purple-600" />
          Skill Verified
        </span>
      )}
    </div>
  );
};
