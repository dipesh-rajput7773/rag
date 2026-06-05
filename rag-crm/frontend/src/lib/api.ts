import axios from 'axios'
import type { SearchResponse, IngestResponse, BulkIngestResponse, Lead, DashboardStats } from '@/types'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const apiKey = localStorage.getItem('api_key')
  if (apiKey) {
    config.headers['X-API-Key'] = apiKey
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export async function searchLeads(query: string, topK = 5): Promise<SearchResponse> {
  const { data } = await api.post('/search', { query, top_k: topK })
  return data
}

export async function ingestLead(lead: Omit<Lead, 'id'>): Promise<IngestResponse> {
  const { data } = await api.post('/ingest', lead)
  return data
}

export async function getLeads(): Promise<Lead[]> {
  const { data } = await api.get('/leads')
  return data
}

export async function bulkIngest(leads: Omit<Lead, 'id'>[]): Promise<BulkIngestResponse> {
  const { data } = await api.post('/ingest/bulk', { leads })
  return data
}

export async function syncLeads(): Promise<{ message: string }> {
  const { data } = await api.post('/ingest/sync')
  return data
}

export async function healthCheck(): Promise<{ status: string; app_name: string; version: string }> {
  const { data } = await api.get('/health')
  return data
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get('/dashboard/stats')
  return data
}

export async function getUsers(): Promise<{ users: { id: number; name: string; email: string; plan: string }[] }> {
  const { data } = await api.get('/admin/users')
  return data
}

export async function login(email: string, password: string): Promise<{ token: string; user: any }> {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function register(name: string, email: string, password: string): Promise<{ token: string; user: any }> {
  const { data } = await api.post('/auth/register', { name, email, password })
  return data
}

export async function getProfile(): Promise<{ user: any }> {
  const { data } = await api.get('/auth/me')
  return data
}
