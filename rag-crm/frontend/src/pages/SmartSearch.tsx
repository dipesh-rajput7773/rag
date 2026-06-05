import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { searchLeads } from '@/lib/api'
import {
  Search, Send, Sparkles, Loader2, MessageSquare,
  Users, Flame, Thermometer, Snowflake, Clock,
} from 'lucide-react'
import type { LeadResult, SearchResponse } from '@/types'

const suggestions = [
  'Who should I call today?',
  'Show me all hot leads',
  'Which leads are ready to sign?',
  'How many warm leads do I have?',
  'Find leads interested in our product',
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

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query
    if (!searchQuery.trim()) return
    setQuery(searchQuery)
    setLoading(true)
    try {
      const res = await searchLeads(searchQuery, 10)
      setResponse(res)
      setHistory(prev => [{ query: searchQuery, response: res }, ...prev.slice(0, 9)])
    } catch {
      setResponse({
        query: searchQuery,
        answer: 'Sorry, I encountered an error. Please try again.',
        results: [],
        total_results: 0,
      })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Smart Search</h1>
        <p className="text-gray-500 mt-1">Ask natural language questions about your leads</p>
      </div>

      <Card className="border-primary-100 bg-gradient-to-br from-white via-primary-50/30 to-white">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ask anything about your leads..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-gray-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
            <Button
              size="lg"
              variant="gradient"
              className="h-14 px-6 gap-2"
              onClick={() => handleSearch()}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Search
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-500 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Searching through your leads...</p>
          </CardContent>
        </Card>
      )}

      {response && !loading && (
        <div ref={resultsRef} className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400 mb-1">AI Response</p>
                  <p className="text-gray-900 leading-relaxed">{response.answer}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Search className="w-3 h-3" /> {response.total_results} results</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Just now</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {response.results.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {response.results.map((lead) => {
                    const Icon = statusIcon[lead.status as keyof typeof statusIcon] || Users
                    const color = statusColor[lead.status as keyof typeof statusColor] || 'default'
                    return (
                      <div key={lead.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                              <Users className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                              <p className="text-xs text-gray-500">{lead.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <Badge variant={color}>
                              <Icon className="w-3 h-3 mr-1" />
                              {lead.status}
                            </Badge>
                            <span className="text-xs font-medium text-gray-400">
                              {(lead.relevance_score * 100).toFixed(0)}% match
                            </span>
                          </div>
                        </div>
                        {lead.notes && (
                          <p className="mt-2 text-sm text-gray-500 pl-13">{lead.notes}</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {response.results.length === 0 && !loading && (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No matching leads found</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!response && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              Ask a question above to search your leads using AI
            </p>
          </CardContent>
        </Card>
      )}

      {history.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Search History</p>
            <div className="flex flex-wrap gap-2">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(h.query)}
                  className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {h.query}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
