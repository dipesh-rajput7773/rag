import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { searchLeads, ingestLead, bulkIngest } from '@/lib/api'
import {
  Plus, Search, Upload, X, Download, Loader2,
  Mail, Phone, FileText, Sparkles,
} from 'lucide-react'
import type { Lead } from '@/types'

const statusColors = { hot: 'hot', warm: 'warm', cold: 'cold' } as const

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newLead, setNewLead] = useState({ name: '', email: '', status: 'warm' as Lead['status'], notes: '' })
  const [addError, setAddError] = useState('')

  useEffect(() => { handleSearch() }, [])

  const handleSearch = async () => {
    setLoading(true)
    try {
      if (!searchQuery.trim()) {
        setLeads([])
        return
      }
      const res = await searchLeads(searchQuery)
      setLeads(res.results as Lead[])
    } catch {}
    setLoading(false)
  }

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError('')
    if (!newLead.name || !newLead.email) { setAddError('Name and email are required'); return }
    try {
      await ingestLead(newLead)
      setShowAddModal(false)
      setNewLead({ name: '', email: '', status: 'warm', notes: '' })
      handleSearch()
    } catch (err: any) {
      setAddError(err.response?.data?.detail || 'Failed to add lead')
    }
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const rows = text.split('\n').slice(1)
    const leads_data = rows.filter(r => r.trim()).map(r => {
      const [name, email, status, notes] = r.split(',')
      return { name: name?.trim(), email: email?.trim(), status: (status?.trim() || 'warm') as Lead['status'], notes: notes?.trim() || '' }
    }).filter(l => l.name && l.email)
    if (leads_data.length > 0) {
      try {
        await bulkIngest(leads_data)
        handleSearch()
      } catch {}
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">Manage your sales pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
            <Button variant="outline" className="gap-2" asChild>
              <span><Upload className="w-4 h-4" /> Import CSV</span>
            </Button>
          </label>
          <Button variant="gradient" className="gap-2" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" /> Add Lead
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads by name, email, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {leads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Name</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Email</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Notes</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-3 px-4">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-gray-900">{lead.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-500">{lead.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusColors[lead.status] || 'default'}>{lead.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-500 line-clamp-1">{lead.notes || '—'}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {lead.relevance_score != null && (
                          <span className="text-sm font-medium text-gray-700">{(lead.relevance_score * 100).toFixed(0)}%</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'No leads found matching your search.' : 'No leads yet. Add your first lead!'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={() => setShowAddModal(false)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Add New Lead</CardTitle>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddLead} className="space-y-4">
                {addError && <p className="text-sm text-red-500">{addError}</p>}
                <Input label="Name" placeholder="John Doe" value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} />
                <Input label="Email" type="email" placeholder="john@company.com" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    value={newLead.status}
                    onChange={(e) => setNewLead({ ...newLead, status: e.target.value as Lead['status'] })}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="hot">Hot</option>
                    <option value="warm">Warm</option>
                    <option value="cold">Cold</option>
                  </select>
                </div>
                <Input label="Notes" placeholder="Any additional information..." value={newLead.notes} onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })} />
                <Button type="submit" className="w-full" variant="gradient">Add Lead</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}
