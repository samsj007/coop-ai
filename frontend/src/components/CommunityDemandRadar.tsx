import React, { useState, useEffect } from 'react';
import {
  Radar, RefreshCw, TrendingUp, TrendingDown, Minus, Sparkles,
  MapPin, CheckCircle2, Cpu, BarChart3, Layers
} from 'lucide-react';
import { api } from '../api/client';
import type { DemandForecastResponse } from '../types';

export const CommunityDemandRadar: React.FC = () => {
  const [forecast, setForecast] = useState<DemandForecastResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');

  useEffect(() => {
    fetchForecast(false);
  }, []);

  const fetchForecast = async (isManualTrigger = false) => {
    if (isManualTrigger) {
      setUpdating(true);
    } else {
      setLoading(true);
    }
    
    try {
      const data = await api.forecastDemand('Chennai');
      setForecast(data);
      const formattedTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setLastUpdatedTime(formattedTime);

      if (isManualTrigger) {
        setToastMessage('AI Demand Forecast Updated');
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to load AI demand forecast', err);
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  const renderTrendIcon = (trend: string) => {
    const t = trend?.toUpperCase() || 'STABLE';
    if (t === 'UP' || t === 'INCREASING') {
      return <span className="inline-flex items-center text-red-600 font-extrabold text-xs gap-0.5"><TrendingUp className="w-3.5 h-3.5" /> ↑ Increasing</span>;
    }
    if (t === 'DOWN' || t === 'DECREASING') {
      return <span className="inline-flex items-center text-emerald-600 font-extrabold text-xs gap-0.5"><TrendingDown className="w-3.5 h-3.5" /> ↓ Decreasing</span>;
    }
    return <span className="inline-flex items-center text-amber-600 font-extrabold text-xs gap-0.5"><Minus className="w-3.5 h-3.5" /> → Stable</span>;
  };

  const renderLevelBadge = (level: string) => {
    const l = level?.toUpperCase() || 'MEDIUM';
    if (l === 'HIGH') {
      return <span className="bg-red-100 text-red-700 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-red-200">HIGH</span>;
    }
    if (l === 'MEDIUM') {
      return <span className="bg-amber-100 text-amber-800 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-amber-200">MEDIUM</span>;
    }
    return <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200">LOW</span>;
  };

  const maxDemandValue = forecast?.predictions?.reduce((max, item) => Math.max(max, item.predicted_demand), 1) || 40;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-8 font-sans transition-all">
      
      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] opacity-80">Just now</span>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-extrabold px-3 py-1 rounded-full mb-2">
            <Radar className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> AI Community Demand Prediction
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Community Demand Radar
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Predict upcoming household service demand across Chennai.
          </p>
        </div>

        {/* CONTROLS: Run AI Forecast Button & Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          {lastUpdatedTime && (
            <span className="text-[11px] text-slate-400 font-medium bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
              Last updated: <strong className="text-slate-700 font-bold">{lastUpdatedTime}</strong>
            </span>
          )}

          <button
            type="button"
            onClick={() => fetchForecast(true)}
            disabled={updating || loading}
            className={`font-extrabold text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all ${
              updating || loading
                ? 'bg-purple-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white active:scale-95'
            }`}
          >
            {updating || loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing community demand...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4 text-amber-300" />
                <span>Run AI Forecast</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => fetchForecast(true)}
            disabled={updating || loading}
            title="Refresh Forecast"
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
          >
            <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && !forecast && (
        <div className="p-12 text-center text-slate-500 space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold">Running Chennai Community Demand Forecasting Model...</p>
        </div>
      )}

      {forecast && (
        <div className="space-y-8">
          
          {/* A. FORECAST SUMMARY CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-gradient-to-br from-indigo-50 to-slate-50 p-5 rounded-2xl border border-indigo-100 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Predicted Demand</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-indigo-950">{forecast.summary.total_predicted_demand}</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full">Jobs / Week</span>
              </div>
              <p className="text-[11px] text-slate-500">Across Chennai sectors</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-slate-50 p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Highest Demand Service</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">{forecast.summary.highest_demand_service}</span>
                <span className="text-xs text-red-600 font-bold">↑ Peak</span>
              </div>
              <p className="text-[11px] text-slate-500">High priority dispatch</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-slate-50 p-5 rounded-2xl border border-purple-100 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Highest Demand Area</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-purple-950">{forecast.summary.highest_demand_area}</span>
                <MapPin className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-[11px] text-slate-500">Chennai sector hot-spot</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-slate-50 p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Demand Trend</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-950">{forecast.summary.overall_demand_trend === 'UP' ? 'Increasing' : 'Stable'}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[11px] text-slate-500">Forecasted next 7 days</p>
            </div>

          </div>

          {/* B. SERVICE DEMAND CHART */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" /> Service Category Demand Forecast
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">Chennai Platform Telemetry</span>
            </div>

            <div className="space-y-4 pt-2">
              {forecast.predictions.map((p) => {
                const percentage = Math.min(100, Math.round((p.predicted_demand / maxDemandValue) * 100));
                return (
                  <div key={p.service} className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{p.service}</span>
                        {renderLevelBadge(p.demand_level)}
                        <span className="text-[11px] text-slate-500">({p.area})</span>
                      </div>

                      <div className="flex items-center gap-4">
                        {renderTrendIcon(p.trend)}
                        <span className="font-black text-indigo-700 text-sm">{p.predicted_demand} requests</span>
                      </div>
                    </div>

                    {/* Bar visualization */}
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex items-center">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          p.demand_level === 'HIGH'
                            ? 'bg-gradient-to-r from-red-500 to-amber-500'
                            : p.demand_level === 'MEDIUM'
                            ? 'bg-gradient-to-r from-amber-400 to-indigo-500'
                            : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-500 pt-0.5">{p.reason}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. CHENNAI AREA DEMAND */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" /> Chennai Sector Demand Distribution
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {forecast.area_forecasts.map((af) => (
                <div key={af.area} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-indigo-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{af.area}</span>
                    {renderLevelBadge(af.demand_level)}
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900">{af.predicted_demand}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{af.trend === 'UP' ? '↑ Increasing' : '→ Stable'}</span>
                  </div>

                  <div className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                    Top Need: {af.top_service}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D & E. AI COMMUNITY INSIGHT & COOPERATIVE WORKFORCE INSIGHT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* E. Community AI Insight */}
            <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 border border-purple-800/60 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>AI Community Insight</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "{forecast.community_insight}"
              </p>
              <div className="text-[10px] text-slate-400 font-mono">
                Generated from Chennai service-request historical vectors & weather/seasonal inputs.
              </div>
            </div>

            {/* F. Admin Cooperative Workforce Insight */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-indigo-800/60 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Layers className="w-4 h-4" />
                <span>Cooperative Workforce Insight</span>
              </div>
              <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                "{forecast.cooperative_workforce_insight}"
              </p>
              <div className="text-[10px] text-indigo-300 font-mono">
                Action item for COOP AI Admin dispatch & fairshare trade allocation.
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
