export interface Lead {
  id: number
  name: string
  email: string
  status: 'hot' | 'warm' | 'cold'
  notes: string
  created_at?: string
  updated_at?: string
  relevance_score?: number
}

export interface LeadResult {
  id: number
  name: string
  email: string
  status: string
  notes: string
  relevance_score: number
}

export interface SearchResponse {
  query: string
  answer: string
  results: LeadResult[]
  total_results: number
}

export interface IngestResponse {
  success: boolean
  message: string
  lead_id: number
}

export interface BulkIngestResponse {
  success: boolean
  message: string
  total_ingested: number
  failed: string[]
}

export interface User {
  id: number
  name: string
  email: string
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
  api_keys: ApiKey[]
  usage: UsageStats
}

export interface ApiKey {
  id: number
  key: string
  name: string
  created_at: string
  last_used: string | null
}

export interface UsageStats {
  total_searches: number
  total_leads: number
  searches_this_month: number
  leads_this_month: number
  monthly_limit_searches: number
  monthly_limit_leads: number
}

export interface DashboardStats {
  total_leads: number
  hot_leads: number
  warm_leads: number
  cold_leads: number
  total_searches: number
  recent_searches: { query: string; timestamp: string }[]
  lead_trend: { date: string; count: number }[]
}

export interface PricingPlan {
  name: string
  price: number
  description: string
  features: string[]
  highlighted?: boolean
  cta: string
}
