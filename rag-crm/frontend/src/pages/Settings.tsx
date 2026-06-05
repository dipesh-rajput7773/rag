import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  User, Key, CreditCard, Copy, Check, RefreshCw,
  Mail, Bell, Shield, ChevronRight,
} from 'lucide-react'

export default function Settings() {
  const [copied, setCopied] = useState<string | null>(null)
  const [showNewKey, setShowNewKey] = useState(false)

  const apiKeys = [
    { id: 1, name: 'Production', key: 'rag_live_7xK3mP9qR2vY...', created: '2026-01-15', lastUsed: '2026-06-04' },
    { id: 2, name: 'Development', key: 'rag_test_aB4cD8eF1gH...', created: '2026-03-20', lastUsed: '2026-06-05' },
  ]

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const planDetails = {
    name: 'Professional',
    price: 79,
    status: 'active',
    nextBilling: '2026-07-05',
    features: ['10,000 leads', '5,000 AI searches', 'Real-time analytics', 'API access'],
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and workspace</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary-600" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" defaultValue="John Doe" />
            <Input label="Email" type="email" defaultValue="john@company.com" />
          </div>
          <Button variant="gradient">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="w-5 h-5 text-primary-600" />
            Subscription
          </CardTitle>
          <Badge variant="success">Active</Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-100">
            <div>
              <p className="text-lg font-semibold text-gray-900">{planDetails.name} Plan</p>
              <p className="text-sm text-gray-500">${planDetails.price}/month · Next billing {planDetails.nextBilling}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {planDetails.features.map((f) => (
                  <Badge key={f} variant="default">{f}</Badge>
                ))}
              </div>
            </div>
            <Button variant="outline" className="shrink-0 gap-2">
              Manage <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="w-5 h-5 text-primary-600" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {apiKeys.map((k) => (
              <div key={k.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">{k.name}</p>
                  <p className="text-xs font-mono text-gray-400">{k.key}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Last used: {k.lastUsed}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(k.key, `key-${k.id}`)}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {copied === `key-${k.id}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            ))}
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setShowNewKey(!showNewKey)}>
            <RefreshCw className="w-4 h-4" /> Generate New Key
          </Button>
          {showNewKey && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-sm font-medium text-emerald-800">New API Key Generated</p>
              <p className="text-xs font-mono text-emerald-600 mt-1">rag_live_xK8mN3pQ5rV7yB2cF9jL0wS4</p>
              <p className="text-xs text-emerald-500 mt-1">Make sure to copy this key — you won't be able to see it again!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-primary-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Email notifications for new leads', enabled: true },
            { label: 'Weekly digest report', enabled: true },
            { label: 'Product updates and features', enabled: false },
            { label: 'Usage limit alerts', enabled: true },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{n.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={n.enabled} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
