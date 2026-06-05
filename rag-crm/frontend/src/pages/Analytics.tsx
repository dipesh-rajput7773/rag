import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart3, TrendingUp, Users, Search, ArrowUp, ArrowDown,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts'

const leadStatusData = [
  { name: 'Hot', value: 12, color: '#ef4444' },
  { name: 'Warm', value: 25, color: '#f59e0b' },
  { name: 'Cold', value: 8, color: '#3b82f6' },
]

const searchTrendData = [
  { month: 'Jan', searches: 45, leads: 30 },
  { month: 'Feb', searches: 52, leads: 38 },
  { month: 'Mar', searches: 68, leads: 45 },
  { month: 'Apr', searches: 55, leads: 42 },
  { month: 'May', searches: 72, leads: 55 },
  { month: 'Jun', searches: 88, leads: 62 },
]

const topLeadsData = [
  { name: 'Sarah Johnson', value: 96 },
  { name: 'Mike Chen', value: 88 },
  { name: 'Emily Davis', value: 82 },
  { name: 'Alex Rivera', value: 75 },
  { name: 'Lisa Park', value: 71 },
]

export default function Analytics() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Track performance and usage metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Searches', value: '382', change: '+12%', up: true, icon: Search },
          { label: 'Avg. Match Rate', value: '87%', change: '+5%', up: true, icon: TrendingUp },
          { label: 'Leads Converted', value: '45', change: '+8%', up: true, icon: Users },
          { label: 'Response Time', value: '1.2s', change: '-0.3s', up: false, icon: BarChart3 },
        ].map(({ label, value, change, up, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">{label}</p>
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium mt-1 ${up ? 'text-emerald-600' : 'text-red-600'}`}>
                {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {change} vs last month
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadStatusData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                    {leadStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {leadStatusData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                  <span className="font-medium text-gray-900">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={searchTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="searches" stroke="#3b82f6" strokeWidth={2} name="Searches" />
                  <Line type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={2} name="Leads" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Scored Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topLeadsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={searchTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="searches" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Searches" />
                  <Bar dataKey="leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
