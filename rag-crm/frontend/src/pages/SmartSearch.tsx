import { useEffect, useRef, useState } from 'react'
import {
  BrainCircuit, Clock, Flame, Loader2, Search, Send, Snowflake,
  Target, Thermometer, Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { searchLeads } from '@/lib/api'
import type { SearchResponse } from '@/types'

const suggestions = [
  'Which leads mention budget or pricing?',
  'Who should I follow up with today?',
  'Find leads ready for proposal',
  'Show hot leads with urgent notes',
  'How many warm leads are in pipeline?',
]

const statusIcon = { hot: Flame, warm: Thermometer, cold: Snowflake } as const
const statusColor = { hot: 'hot', warm: 'warm', cold: 'cold' } as const

export default function SmartSearch() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<{ query: string; response: SearchResponse }[]>([])
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (response && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [response])

  const handleSearch = async (nextQuery?: string) => {
    const searchQuery = nextQuery || query
    if (!searchQuery.trim()) return

    setQuery(searchQuery)
    setLoading(true)
    try {
      const res = await searchLeads(searchQuery, 10)
      setResponse(res)
      setHistory((prev) => [{ query: searchQuery, response: res }, ...prev.slice(0, 7)])
    } catch {
      setResponse({
        query: searchQuery,
        answer: 'Search failed. Please try again.',
        results: [],
        total_results: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_280px] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-700">Deal Intel</p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-950">Ask your lead base</h1>
          <p className="mt-1 text-gray-600">Retrieval-augmented answers grounded in the accounts you have indexed.</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-950">
            <Target className="h-4 w-4 text-primary-700" />
            Good questions
          </div>
          <p className="mt-2 text-xs leading-5 text-gray-500">Use buyer intent, objections, timeline, geography, budget, or next step language.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ask a revenue question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-14 w-full rounded-md border border-gray-300 bg-white pl-12 pr-4 text-base focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Button size="lg" className="h-14 gap-2" onClick={() => handleSearch()} disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              Search
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSearch(suggestion)}
                className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-800"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary-700" />
            <p className="text-sm text-gray-500">Retrieving matching accounts...</p>
          </CardContent>
        </Card>
      )}

      {response && !loading && (
        <div ref={resultsRef} className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-950 text-white">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Grounded answer</p>
                  <p className="mt-2 leading-7 text-gray-900">{response.answer}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1"><Search className="h-3.5 w-3.5" /> {response.total_results} matched accounts</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Just now</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {response.results.length > 0 ? (
            <div className="grid gap-3">
              {response.results.map((lead) => {
                const Icon = statusIcon[lead.status as keyof typeof statusIcon] || Users
                const color = statusColor[lead.status as keyof typeof statusColor] || 'default'
                return (
                  <Card key={lead.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-100">
                              <Users className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-950">{lead.name}</p>
                              <p className="text-sm text-gray-500">{lead.email}</p>
                            </div>
                          </div>
                          {lead.notes && (
                            <p className="mt-3 text-sm leading-6 text-gray-600">{lead.notes}</p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <Badge variant={color}>
                            <Icon className="mr-1 h-3.5 w-3.5" />
                            {lead.status}
                          </Badge>
                          <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {(lead.relevance_score * 100).toFixed(0)}% match
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BrainCircuit className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p className="font-medium text-gray-950">No matching accounts found</p>
                <p className="mt-1 text-sm text-gray-500">Try asking with buyer intent, budget, location, or next-step language.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {history.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Recent questions</p>
            <div className="flex flex-wrap gap-2">
              {history.map((item, index) => (
                <button
                  key={`${item.query}-${index}`}
                  onClick={() => handleSearch(item.query)}
                  className="cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100"
                >
                  {item.query}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
