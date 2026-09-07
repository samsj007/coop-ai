import axios from 'axios';
import type {
  User, WorkerProfile, ParsedService, ScoredWorker, Booking, DemandIntelligence, DemandForecastResponse
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Auth
  login: async (email: string, password: string, role: string): Promise<User> => {
    const res = await apiClient.post('/auth/login', { email, password, role });
    return res.data;
  },

  registerCustomer: async (data: any): Promise<User> => {
    const res = await apiClient.post('/auth/register/customer', data);
    return res.data;
  },

  registerWorker: async (data: any): Promise<User> => {
    const res = await apiClient.post('/auth/register/worker', data);
    return res.data;
  },

  // Services
  parseNaturalLanguage: async (input: string, city: string = 'Bengaluru', lat?: number, lng?: number): Promise<ParsedService> => {
    const res = await apiClient.post('/services/parse', {
      natural_language_input: input,
      customer_city: city,
      customer_latitude: lat,
      customer_longitude: lng,
    });
    return res.data;
  },

  chatAssistant: async (message: string, history: any[] = []) => {
    const res = await apiClient.post('/services/assistant', { message, chat_history: history });
    return res.data;
  },

  // Workers
  getWorkers: async (city?: string, skill?: string): Promise<WorkerProfile[]> => {
    const res = await apiClient.get('/workers', { params: { city, skill } });
    return res.data;
  },

  getPendingWorkers: async (): Promise<WorkerProfile[]> => {
    const res = await apiClient.get('/workers/pending-verification');
    return res.data;
  },

  getWorkerById: async (id: string): Promise<WorkerProfile> => {
    const res = await apiClient.get(`/workers/${id}`);
    return res.data;
  },

  allocateFairShare: async (
    serviceCategory: string,
    urgency: string,
    lat: number,
    lng: number
  ): Promise<ScoredWorker[]> => {
    const res = await apiClient.post('/workers/fairshare-allocate', {
      service_category: serviceCategory,
      urgency,
      customer_latitude: lat,
      customer_longitude: lng,
      max_workers: 5,
    });
    return res.data;
  },

  adminVerifyWorker: async (workerId: string, action: 'APPROVE' | 'REJECT' | 'REQUEST_INFO', notes?: string) => {
    const res = await apiClient.post('/workers/admin/verify', {
      worker_id: workerId,
      action,
      notes,
    });
    return res.data;
  },

  toggleWorkerAvailability: async (workerId: string, availability: string) => {
    const res = await apiClient.post(`/workers/${workerId}/toggle-availability`, null, {
      params: { availability },
    });
    return res.data;
  },

  // Bookings
  createBooking: async (bookingData: any) => {
    const res = await apiClient.post('/bookings', bookingData);
    return res.data;
  },

  getCustomerBookings: async (customerId: string): Promise<Booking[]> => {
    const res = await apiClient.get(`/bookings/customer/${customerId}`);
    return res.data;
  },

  getWorkerBookings: async (workerId: string): Promise<Booking[]> => {
    const res = await apiClient.get(`/bookings/worker/${workerId}`);
    return res.data;
  },

  getAllBookingsAdmin: async (): Promise<Booking[]> => {
    const res = await apiClient.get('/bookings/all');
    return res.data;
  },

  updateBookingStatus: async (bookingId: string, newStatus: string) => {
    const res = await apiClient.post('/bookings/status', {
      booking_id: bookingId,
      new_status: newStatus,
    });
    return res.data;
  },

  addReview: async (bookingId: string, workerId: string, rating: number, comment: string) => {
    const res = await apiClient.post('/bookings/review', {
      booking_id: bookingId,
      worker_id: workerId,
      rating,
      comment,
    });
    return res.data;
  },

  // Analytics
  getDemandIntelligence: async (): Promise<DemandIntelligence> => {
    const res = await apiClient.get('/analytics/demand-intelligence');
    return res.data;
  },

  // Demand Prediction
  forecastDemand: async (city: string = 'Chennai'): Promise<DemandForecastResponse> => {
    try {
      const res = await axios.post(`http://localhost:8000/api/ai/forecast-demand?city=${encodeURIComponent(city)}`);
      return res.data;
    } catch {
      const res = await apiClient.post('/analytics/forecast-demand', null, { params: { city } });
      return res.data;
    }
  },

  getCommunityDemand: async (city: string = 'Chennai'): Promise<DemandForecastResponse> => {
    try {
      const res = await axios.get(`http://localhost:8000/api/insights/community-demand?city=${encodeURIComponent(city)}`);
      return res.data;
    } catch {
      const res = await apiClient.get('/analytics/forecast-demand', { params: { city } });
      return res.data;
    }
  },
};

