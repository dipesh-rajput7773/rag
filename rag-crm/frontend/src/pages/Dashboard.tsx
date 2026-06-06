import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BrainCircuit, Flame, Loader2, Plus, Search,
  Snowflake, Thermometer, TrendingUp, Users,
} from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats, searchLeads } from '@/lib/api'
import type { DashboardStats } from '@/types'

const defaultStats: DashboardStats = {
  total_leads: 0,
  hot_leads: 0,
  warm_leads: 0,
  cold_leads: 0,
  total_searches: 0,
  recent_searches: [],
  lead_trend: [],
}

const prompts = [
  'Which hot leads mention budget?',
  'Who should I follow up with today?',
  'Find leads ready for proposal',
]

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats)
  const [query, setQuery] = useState(prompts[0])
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {})
  }, [])

  const pipelineMix = useMemo(() => {
    const total = Math.max(stats.total_leads, 1)
    return [
      { label: 'Hot', value: stats.hot_leads, width: `${(stats.hot_leads / total) * 100}%`, className: 'bg-red-500' },
      { label: 'Warm', value: stats.warm_leads, width: `${(stats.warm_leads / total) * 100}%`, className: 'bg-amber-400' },
      { label: 'Cold', value: stats.cold_leads, width: `${(stats.cold_leads / total) * 100}%`, className: 'bg-slate-400' },
    ]
  }, [stats])

  const handleQuickSearch = async (selectedQuery = query) => {
    if (!selectedQuery.trim()) return
    setQuery(selectedQuery)
    setLoading(true)
    try {
      const res = await searchLeads(selectedQuery, 5)
      setAnswer(res.answer)
    } catch {
      setAnswer('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total accounts', value: stats.total_leads, icon: Users, accent: 'text-gray-950', help: 'Indexed lead records' },
    { label: 'Hot pipeline', value: stats.hot_leads, icon: Flame, accent: 'text-red-600', help: 'Needs active follow-up' },
    { label: 'Warm pipeline', value: stats.warm_leads, icon: Thermometer, accent: 'text-amber-600', help: 'Discovery or proposal fit' },
    { label: 'Searches', value: stats.total_searches, icon: BrainCircuit, accent: 'text-primary-700', help: 'Questions asked by team' },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-700">Command</p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-950">Revenue command center</h1>
          <p className="mt-1 text-gray-600">Daily pipeline view for B2B service teams using lead notes as searchable context.</p>
        </div>
        <Link to="/leads">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add account
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, accent, help }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-950">{value}</p>
                  <p className="mt-1 text-xs text-gray-500">{help}</p>
                </div>
                <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
                  <Icon className={`h-5 w-5 ${accent}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary-700" />
              Deal intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ask about budget, urgency, location, proposal status..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
                  className="h-11 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <Button onClick={() => handleQuickSearch()} disabled={loading} className="h-11">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleQuickSearch(prompt)}
                  className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-800"
                >
                  {prompt}
                </button>
              ))}
            </div>
            {answer && (
              <div className="mt-5 rounded-lg border border-primary-100 bg-primary-50 p-4">
                <p className="text-sm leading-6 text-gray-800">{answer}</p>
              </div>
            )}
            <Link to="/search" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-900">
              Open Deal Intel <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-700" />
              Pipeline mix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border border-gray-200 bg-gray-100">
              <div className="flex h-4">
                {pipelineMix.map((item) => (
                  <div key={item.label} className={item.className} style={{ width: item.width }} />
                ))}
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {pipelineMix.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <Badge variant={item.label.toLowerCase() as 'hot' | 'warm' | 'cold'}>{item.value}</Badge>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-md bg-gray-50 p-3 text-center">
                <Flame className="mx-auto h-4 w-4 text-red-600" />
                <p className="mt-1 text-xs text-gray-500">Urgent</p>
              </div>
              <div className="rounded-md bg-gray-50 p-3 text-center">
                <Thermometer className="mx-auto h-4 w-4 text-amber-600" />
                <p className="mt-1 text-xs text-gray-500">Nurture</p>
              </div>
              <div className="rounded-md bg-gray-50 p-3 text-center">
                <Snowflake className="mx-auto h-4 w-4 text-slate-500" />
                <p className="mt-1 text-xs text-gray-500">Low intent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Lead creation trend</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lead_trend.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.lead_trend}>
                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={2} dot={{ fill: '#059669' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-gray-300 text-sm text-gray-500">
                Add leads to start seeing trend data.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Recent questions</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent_searches.length > 0 ? (
              <div className="space-y-2">
                {stats.recent_searches.map((search, index) => (
                  <div key={`${search.timestamp}-${index}`} className="rounded-md border border-gray-200 bg-white px-3 py-2">
                    <p className="line-clamp-1 text-sm text-gray-800">{search.query}</p>
                    <p className="mt-1 text-xs text-gray-500">{new Date(search.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-gray-300 p-5 text-sm text-gray-500">
                Ask a deal question to create search history.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
