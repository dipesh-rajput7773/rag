import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { searchLeads, getDashboardStats, ingestLead } from '@/lib/api'
import {
  Users, TrendingUp, Flame, Snowflake, Thermometer,
  Search, Plus, ArrowRight, Sparkles, Loader2,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { DashboardStats } from '@/types'

const defaultStats: DashboardStats = {
  total_leads: 0, hot_leads: 0, warm_leads: 0, cold_leads: 0,
  total_searches: 0, recent_searches: [], lead_trend: [],
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats)
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {})
  }, [])

  const handleQuickSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await searchLeads(query, 5)
      setAnswer(res.answer)
    } catch { setAnswer('Search failed. Please try again.') }
    setLoading(false)
  }

  const statCards = [
    { label: 'Total Leads', value: stats.total_leads, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Hot Leads', value: stats.hot_leads, icon: Flame, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Warm Leads', value: stats.warm_leads, icon: Thermometer, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Cold Leads', value: stats.cold_leads, icon: Snowflake, color: 'text-blue-600', bg: 'bg-blue-50' },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your lead pipeline</p>
        </div>
        <Link to="/leads">
          <Button variant="gradient" className="gap-2">
            <Plus className="w-4 h-4" /> Add Lead
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary-600" />
              AI Quick Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ask anything... e.g. 'Who should I call today?'"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <Button onClick={handleQuickSearch} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            {answer && (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-100">
                <p className="text-sm text-gray-700 leading-relaxed">{answer}</p>
              </div>
            )}
            <Link to="/search" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-4 font-medium">
              Advanced Search <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Lead Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lead_trend.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.lead_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                No trend data yet. Start adding leads!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {stats.recent_searches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recent_searches.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50">
                  <span className="text-sm text-gray-700">{s.query}</span>
                  <span className="text-xs text-gray-400">{new Date(s.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
