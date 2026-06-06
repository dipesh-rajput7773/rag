import { useMemo, useState } from 'react'
import { Bell, Check, Copy, CreditCard, Key, ShieldCheck, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function Settings() {
  const [copied, setCopied] = useState<string | null>(null)
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  }, [])

  const apiKeys = [
    { id: 1, name: 'Production', key: 'rag_live_7xK3mP9qR2vY...', lastUsed: '2026-06-05' },
    { id: 2, name: 'Development', key: 'rag_test_aB4cD8eF1gH...', lastUsed: '2026-06-04' },
  ]

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-700">Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-950">Settings</h1>
        <p className="mt-1 text-gray-600">Manage account details, access, and revenue workspace preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-700" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" defaultValue={user.name || ''} />
            <Input label="Email" type="email" defaultValue={user.email || ''} />
          </div>
          <Button>Save changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary-700" />
            Subscription
          </CardTitle>
          <Badge variant="success">Active</Badge>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold capitalize text-gray-950">{user.plan || 'Free'} plan</p>
                <p className="mt-1 text-sm text-gray-500">Current workspace plan for indexed leads and RAG searches.</p>
              </div>
              <Button variant="outline">Manage plan</Button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {['Lead indexing', 'Deal search', 'Usage history'].map((feature) => (
                <div key={feature} className="rounded-md bg-white px-3 py-2 text-sm text-gray-700">
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary-700" />
            Data boundaries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="font-medium text-gray-950">Authenticated search</p>
              <p className="mt-1 text-sm leading-6 text-gray-600">Search and ingest routes require a signed-in user.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="font-medium text-gray-950">User-scoped retrieval</p>
              <p className="mt-1 text-sm leading-6 text-gray-600">Vector search filters by workspace owner before answers are generated.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary-700" />
            API keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-950">{apiKey.name}</p>
                  <p className="font-mono text-xs text-gray-500">{apiKey.key}</p>
                  <p className="mt-0.5 text-xs text-gray-400">Last used: {apiKey.lastUsed}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(apiKey.key, `key-${apiKey.id}`)}
                  className="cursor-pointer rounded-md p-2 transition-colors hover:bg-gray-200"
                  aria-label="Copy API key"
                >
                  {copied === `key-${apiKey.id}` ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
                </button>
              </div>
            ))}
          </div>
          <Button variant="outline">Generate new key</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-700" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Daily hot lead digest', enabled: true },
            { label: 'Weekly search usage summary', enabled: true },
            { label: 'Pipeline import reminders', enabled: false },
            { label: 'Usage limit alerts', enabled: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{item.label}</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked={item.enabled} className="peer sr-only" />
                <div className="h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300" />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
