import { useEffect, useMemo, useState } from 'react'
import { BarChart3, BrainCircuit, Flame, Search, Thermometer, Users } from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats } from '@/lib/api'
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

export default function Analytics() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats)

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {})
  }, [])

  const leadStatusData = useMemo(() => [
    { name: 'Hot', value: stats.hot_leads, color: '#ef4444' },
    { name: 'Warm', value: stats.warm_leads, color: '#f59e0b' },
    { name: 'Cold', value: stats.cold_leads, color: '#64748b' },
  ], [stats])

  const signalData = useMemo(() => [
    { name: 'Accounts', value: stats.total_leads },
    { name: 'Searches', value: stats.total_searches },
    { name: 'Recent', value: stats.recent_searches.length },
  ], [stats])

  const cards = [
    { label: 'Indexed accounts', value: stats.total_leads, icon: Users, help: 'Available to retrieval' },
    { label: 'Hot signals', value: stats.hot_leads, icon: Flame, help: 'Immediate follow-up pool' },
    { label: 'Warm signals', value: stats.warm_leads, icon: Thermometer, help: 'Nurture and proposal pool' },
    { label: 'Search volume', value: stats.total_searches, icon: BrainCircuit, help: 'RAG questions asked' },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-700">Signal Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-950">Pipeline intelligence</h1>
        <p className="mt-1 text-gray-600">Measure whether the team is building and querying useful deal context.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, help }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-950">{value}</p>
                  <p className="mt-1 text-xs text-gray-500">{help}</p>
                </div>
                <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
                  <Icon className="h-5 w-5 text-primary-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lead signal distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadStatusData} cx="50%" cy="50%" innerRadius={78} outerRadius={118} paddingAngle={4} dataKey="value">
                    {leadStatusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-5">
              {leadStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium text-gray-950">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workspace activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signalData}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Lead growth by day</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lead_trend.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.lead_trend}>
                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-gray-300 text-sm text-gray-500">
                Add accounts to populate growth analytics.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary-700" />
              Recent search intent
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent_searches.length > 0 ? (
              <div className="space-y-2">
                {stats.recent_searches.map((item, index) => (
                  <div key={`${item.timestamp}-${index}`} className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                    <p className="line-clamp-1 text-sm text-gray-800">{item.query}</p>
                    <p className="mt-1 text-xs text-gray-500">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-gray-300 p-5 text-sm text-gray-500">
                No search intent yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
