import React from 'react';
import { Check, Clock, Navigation, Home, Wrench, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  status: string;
}

const STEPS = [
  { key: 'REQUESTED', label: 'Requested', icon: Clock },
  { key: 'ACCEPTED', label: 'Accepted', icon: Check },
  { key: 'ON_THE_WAY', label: 'On The Way', icon: Navigation },
  { key: 'ARRIVED', label: 'Arrived', icon: Home },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Wrench },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
];

export const ServiceTrackingStepper: React.FC<Props> = ({ status }) => {
  if (status === 'CANCELLED') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium">
        <AlertCircle className="w-5 h-5 text-red-600" />
        This service request was cancelled.
      </div>
    );
  }

  const getStepIndex = (s: string) => {
    switch (s) {
      case 'REQUESTED': return 0;
      case 'MATCHED': return 0;
      case 'ACCEPTED': return 1;
      case 'ON_THE_WAY': return 2;
      case 'ARRIVED': return 3;
      case 'IN_PROGRESS': return 4;
      case 'COMPLETED': return 5;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
        
        {/* Active Progress Line */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        ></div>

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white border-2 border-emerald-600'
                    : isCurrent
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 border-2 border-white animate-bounce'
                    : 'bg-white text-slate-400 border-2 border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`mt-2 text-[11px] font-semibold text-center hidden sm:block ${
                  isCurrent ? 'text-indigo-600 font-bold' : isDone ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
