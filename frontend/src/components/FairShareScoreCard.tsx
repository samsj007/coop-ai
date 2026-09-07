import React from 'react';
import { Award, CheckCircle2, Info } from 'lucide-react';
import type { ScoredWorker } from '../types';

interface Props {
  scoredWorker: ScoredWorker;
}

export const FairShareScoreCard: React.FC<Props> = ({ scoredWorker }) => {
  const { total_match_score, distance_km, breakdown, recommendation_reasons } = scoredWorker;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3">
      <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-slate-800 text-sm">COOP AI FairShare Score</span>
        </div>
        <div className="bg-indigo-600 text-white font-extrabold text-sm px-3 py-1 rounded-full shadow">
          {total_match_score}% Match
        </div>
      </div>

      {/* Why Recommended */}
      <div className="mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
          Recommended because:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {recommendation_reasons.map((reason, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-medium"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {reason}
            </span>
          ))}
        </div>
      </div>

      {/* 7 Factor Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-white p-2 rounded border border-slate-200">
          <span className="text-slate-500 block">Skill Match (30%)</span>
          <span className="font-bold text-indigo-700">{breakdown.skill_match} / 30</span>
        </div>
        <div className="bg-white p-2 rounded border border-slate-200">
          <span className="text-slate-500 block">Availability (20%)</span>
          <span className="font-bold text-emerald-700">{breakdown.availability} / 20</span>
        </div>
        <div className="bg-white p-2 rounded border border-slate-200">
          <span className="text-slate-500 block">Distance ({distance_km} km)</span>
          <span className="font-bold text-blue-700">{breakdown.distance} / 15</span>
        </div>
        <div className="bg-white p-2 rounded border border-slate-200">
          <span className="text-slate-500 block">Workload Balance</span>
          <span className="font-bold text-amber-700">{breakdown.workload_balance} / 15</span>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
        <Info className="w-3 h-3 text-slate-400 shrink-0" />
        FairShare considers skill, availability, distance, workload, experience & rating to distribute work equitably.
      </div>
    </div>
  );
};
