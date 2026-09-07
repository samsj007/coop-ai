export type Role = 'customer' | 'worker' | 'admin';

export interface User {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  role: Role;
  token: string;
  verification_status?: string;
  identity_verified?: boolean;
  skill_verified?: boolean;
}

export interface WorkerProfile {
  worker_id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  skills: string[];
  years_experience: number;
  availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  verification_status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'INFO_REQUESTED';
  identity_verified: boolean;
  skill_verified: boolean;
  document_verified: boolean;
  experience_verified: boolean;
  rating: number;
  completed_jobs: number;
  current_workload: number;
  service_area: string;
  languages: string[];
  earnings: number;
  profile_photo?: string;
  id_type?: string;
  id_document_url?: string;
  certificate_url?: string;
  work_photos?: string[];
  bank_details?: Record<string, string>;
  recent_jobs_count?: number;
}

export interface ParsedService {
  natural_input: string;
  service_category: string;
  issue: string;
  urgency: 'High' | 'Medium' | 'Low';
  preferred_date: string;
  location_required: boolean;
  confidence_score: number;
  ai_explanation: string;
  demo_mode: boolean;
}

export interface FairShareBreakdown {
  skill_match: number;
  availability: number;
  distance: number;
  workload_balance: number;
  experience: number;
  rating: number;
  recent_job_balance: number;
}

export interface ScoredWorker {
  worker: WorkerProfile;
  total_match_score: number;
  distance_km: number;
  breakdown: FairShareBreakdown;
  recommendation_reasons: string[];
}

export interface Booking {
  booking_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  worker_id: string;
  worker_name?: string;
  worker_phone?: string;
  worker_photo?: string;
  worker_rating?: number;
  service_category: string;
  issue_description: string;
  urgency: string;
  service_address: string;
  latitude: number;
  longitude: number;
  scheduled_date: string;
  scheduled_time: string;
  estimated_amount: number;
  status: 'REQUESTED' | 'MATCHED' | 'ACCEPTED' | 'ON_THE_WAY' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  payment_method: string;
  payment_status: 'PENDING' | 'PAID';
  rating?: number;
  review_comment?: string;
  created_at?: string;
}

export interface DemandIntelligence {
  overview: {
    total_workers: number;
    verified_workers: number;
    pending_verifications: number;
    total_completed_jobs: number;
    total_platform_earnings: number;
    cooperative_welfare_fund_inr: number;
    fairshare_balance_index: number;
  };
  demand_trends: Array<{
    service: string;
    demand_count: number;
    growth: string;
    urgency_rate: string;
    shortage_alert: boolean;
  }>;
  skill_supply: Record<string, number>;
  city_distribution: Record<string, number>;
  insights: string[];
}

export interface DemandPredictionItem {
  service: string;
  predicted_demand: number;
  demand_level: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  trend: 'UP' | 'STABLE' | 'DOWN' | string;
  confidence: number;
  area: string;
  reason: string;
}

export interface AreaDemandForecast {
  area: string;
  predicted_demand: number;
  demand_level: 'HIGH' | 'MEDIUM' | 'LOW' | string;
  trend: 'UP' | 'STABLE' | 'DOWN' | string;
  top_service: string;
}

export interface DemandForecastSummary {
  total_predicted_demand: number;
  highest_demand_service: string;
  highest_demand_area: string;
  overall_demand_trend: string;
}

export interface DemandForecastResponse {
  forecast_date: string;
  generated_at: string;
  summary: DemandForecastSummary;
  predictions: DemandPredictionItem[];
  area_forecasts: AreaDemandForecast[];
  community_insight: string;
  cooperative_workforce_insight: string;
  is_demo?: boolean;
}

