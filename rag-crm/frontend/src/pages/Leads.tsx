import { useEffect, useState } from 'react'
import {
  Building2, ChevronLeft, ChevronRight, Download, Loader2,
  Pencil, Phone, Plus, Search, Trash2, Upload, Users, X,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { bulkIngest, deleteLead, exportLeads, getLeads, ingestLead, searchLeads, updateLead } from '@/lib/api'
import type { Lead } from '@/types'

const STATUS_OPTIONS: Lead['status'][] = ['hot', 'warm', 'cold']
const STATUS_COLORS = { hot: 'hot', warm: 'warm', cold: 'cold' } as const
const PAGE_SIZE = 20

type StatusFilter = 'all' | Lead['status']

type LeadForm = {
  name: string
  email: string
  status: Lead['status']
  notes: string
  phone: string
  company: string
  source: string
}

const EMPTY_FORM: LeadForm = {
  name: '',
  email: '',
  status: 'warm',
  notes: '',
  phone: '',
  company: '',
  source: 'manual',
}

const SOURCE_OPTIONS = ['manual', 'website', 'referral', 'linkedin', 'indiamart', 'whatsapp', 'cold-call', 'event', 'other']

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [loading, setLoading] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const [form, setForm] = useState<LeadForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const loadLeads = async (p: number, sf: StatusFilter) => {
    setLoading(true)
    setIsSearchMode(false)
    try {
      const res = await getLeads({
        skip: p * PAGE_SIZE,
        limit: PAGE_SIZE,
        status: sf === 'all' ? undefined : sf,
      })
      setLeads(res.leads)
      setTotal(res.total)
    } catch {
      setLeads([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads(page, statusFilter)
  }, [page, statusFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusFilter = (sf: StatusFilter) => {
    setStatusFilter(sf)
    setPage(0)
    setSearchQuery('')
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadLeads(0, statusFilter)
      return
    }
    setLoading(true)
    setIsSearchMode(true)
    try {
      const res = await searchLeads(searchQuery, 50)
      setLeads(res.results as Lead[])
      setTotal(res.results.length)
    } catch {
      setLeads([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setPage(0)
    loadLeads(0, statusFilter)
  }

  const openAddModal = () => {
    setForm(EMPTY_FORM)
    setFormError('')
    setShowAddModal(true)
  }

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead)
    setForm({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      notes: lead.notes || '',
      phone: lead.phone || '',
      company: lead.company || '',
      source: lead.source || 'manual',
    })
    setFormError('')
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingLead(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and email are required')
      return
    }

    setFormLoading(true)
    try {
      if (editingLead) {
        await updateLead(editingLead.id, form)
      } else {
        await ingestLead(form)
      }
      closeModal()
      loadLeads(page, statusFilter)
    } catch (err: any) {
      setFormError(err.response?.data?.detail || 'Failed to save lead')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteLead(id)
      setConfirmDeleteId(null)
      if (leads.length === 1 && page > 0) {
        setPage((p) => p - 1)
      } else {
        loadLeads(page, statusFilter)
      }
    } catch {
      setConfirmDeleteId(null)
    }
  }

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const text = await file.text()
    const lines = text.split('\n')
    const header = lines[0].toLowerCase()
    const hasHeader = header.includes('name') || header.includes('email')
    const rows = hasHeader ? lines.slice(1) : lines

    const parsed = rows
      .filter((row) => row.trim())
      .map((row) => {
        const cols = row.split(',').map((c) => c.trim().replace(/^"|"$/g, ''))
        const [name, email, status, company, phone, source, ...noteParts] = cols
        const st = status?.toLowerCase() as Lead['status']
        return {
          name: name || '',
          email: email || '',
          status: STATUS_OPTIONS.includes(st) ? st : 'warm' as Lead['status'],
          company: company || '',
          phone: phone || '',
          source: source || 'manual',
          notes: noteParts.join(',') || '',
        }
      })
      .filter((l) => l.name && l.email)

    if (parsed.length > 0) {
      await bulkIngest(parsed)
      setPage(0)
      loadLeads(0, statusFilter)
    }
  }

  const handleExport = async () => {
    try {
      await exportLeads()
    } catch {
      // silent — browser handles the download
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-700">Accounts</p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-950">Lead knowledge base</h1>
          <p className="mt-1 text-gray-600">Every lead is indexed for AI retrieval and grounded deal answers.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <label className="cursor-pointer">
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
            <Button variant="outline" className="gap-2" asChild>
              <span><Upload className="h-4 w-4" /> Import CSV</span>
            </Button>
          </label>
          <Button className="gap-2" onClick={openAddModal}>
            <Plus className="h-4 w-4" /> Add lead
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Search and filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, company, notes, budget, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-11 w-full rounded-md border border-gray-300 bg-white pl-10 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {searchQuery && (
                <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {!isSearchMode && (
              <div className="flex rounded-md border border-gray-200 bg-gray-50 p-1">
                {(['all', ...STATUS_OPTIONS] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusFilter(s)}
                    className={`cursor-pointer rounded px-3 py-2 text-sm font-medium capitalize transition-colors ${
                      statusFilter === s ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-600 hover:text-gray-950'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <Button onClick={handleSearch} disabled={loading} className="h-11 gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </Button>
          </div>
          {isSearchMode && (
            <p className="mt-3 text-xs text-gray-500">
              AI search results for <span className="font-medium">"{searchQuery}"</span> —{' '}
              <button onClick={handleClearSearch} className="text-primary-700 hover:underline">clear to browse all leads</button>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {leads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Lead</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Signal</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Notes</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100">
                            <Users className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-950">{lead.name}</p>
                            <p className="text-xs text-gray-400">#{lead.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {lead.company ? (
                          <div className="flex items-center gap-1.5 text-sm text-gray-700">
                            <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            {lead.company}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">{lead.email}</p>
                        {lead.phone && (
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                            <Phone className="h-3 w-3" />{lead.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={STATUS_COLORS[lead.status] || 'default'}>{lead.status}</Badge>
                        {lead.source && lead.source !== 'manual' && (
                          <p className="mt-1 text-xs capitalize text-gray-400">{lead.source}</p>
                        )}
                      </td>
                      <td className="max-w-xs px-4 py-4">
                        <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                          {lead.notes || <span className="text-gray-300">No notes</span>}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {confirmDeleteId === lead.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-gray-600">Delete?</span>
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            {lead.relevance_score != null && (
                              <span className="mr-2 text-sm font-medium text-gray-500">
                                {(lead.relevance_score * 100).toFixed(0)}%
                              </span>
                            )}
                            <button
                              onClick={() => openEditModal(lead)}
                              className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                              aria-label="Edit lead"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(lead.id)}
                              className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              aria-label="Delete lead"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-gray-300" />
              <p className="font-medium text-gray-950">{loading ? 'Loading...' : 'No leads found'}</p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Add a lead or import a CSV to build your retrieval knowledge base.
              </p>
            </div>
          )}

          {!isSearchMode && total > PAGE_SIZE && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
              <p className="text-sm text-gray-500">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total} leads
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                  className="cursor-pointer rounded-md border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-700">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                  className="cursor-pointer rounded-md border border-gray-200 p-1.5 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {(showAddModal || editingLead) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4"
          onClick={closeModal}
        >
          <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editingLead ? 'Edit lead' : 'Add lead'}</CardTitle>
              <button onClick={closeModal} className="cursor-pointer rounded-md p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{formError}</p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Name *"
                    placeholder="Rajesh Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    label="Email *"
                    type="email"
                    placeholder="rajesh@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <Input
                    label="Company"
                    placeholder="Acme Pvt Ltd"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                  <Input
                    label="Phone / WhatsApp"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Signal</label>
                  <div className="grid grid-cols-3 gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setForm({ ...form, status: s })}
                        className={`cursor-pointer rounded-md border px-3 py-2 text-sm font-medium capitalize ${
                          form.status === s
                            ? 'border-gray-950 bg-gray-950 text-white'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Lead source</label>
                  <select
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {SOURCE_OPTIONS.map((src) => (
                      <option key={src} value={src} className="capitalize">{src}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    placeholder="Budget, timeline, objections, next step..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 gap-2" disabled={formLoading}>
                    {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {editingLead ? 'Save changes' : 'Add and index'}
                  </Button>
                  {editingLead && (
                    <Button type="button" variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
