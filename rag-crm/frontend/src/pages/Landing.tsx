import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BarChart3, BrainCircuit, Check, DatabaseZap, Menu,
  MessageSquareText, Search, ShieldCheck, Target, X,
} from 'lucide-react'

import heroImage from '@/assets/revenue-workspace-hero.png'
import { Button } from '@/components/ui/button'
import type { PricingPlan } from '@/types'

const plans: PricingPlan[] = [
  {
    name: 'Solo',
    price: 0,
    description: 'For testing the workflow with a small lead list.',
    features: ['100 leads', '50 searches', 'CSV import & export', 'Basic dashboard'],
    cta: 'Start free',
  },
  {
    name: 'Pipeline',
    price: 999,
    description: 'For small B2B teams — real estate, coaching, insurance.',
    features: ['5,000 leads', '500 searches/month', 'RAG deal search', 'Company & phone fields', 'WhatsApp-ready CSV'],
    highlighted: true,
    cta: 'Start trial',
  },
  {
    name: 'Scale',
    price: 2499,
    description: 'For growing teams that need deeper lead intelligence.',
    features: ['Unlimited leads', '5,000 searches/month', 'Signal analytics', 'API access', 'Priority support'],
    cta: 'Start trial',
  },
]

const featureCards = [
  {
    icon: Search,
    title: 'Ask the pipeline',
    desc: 'Find warm buying signals across names, emails, statuses, and messy notes without building filters first.',
  },
  {
    icon: DatabaseZap,
    title: 'Grounded answers',
    desc: 'Retrieved leads are passed into the answer step so sellers can act from account context, not generic advice.',
  },
  {
    icon: Target,
    title: 'Next-best focus',
    desc: 'Use questions like who should I call today or which deals mention budget to turn notes into action.',
  },
  {
    icon: BarChart3,
    title: 'Operating view',
    desc: 'Track lead mix, search volume, and team focus from one quiet dashboard built for daily use.',
  },
  {
    icon: ShieldCheck,
    title: 'Workspace isolation',
    desc: 'Authenticated search and user-scoped vector retrieval keep each account working from its own lead set.',
  },
  {
    icon: MessageSquareText,
    title: 'Sales-ready language',
    desc: 'Answers are written for follow-up conversations, discovery prep, and practical pipeline review.',
  },
]

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-gray-950">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-400 text-gray-950">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-white">DealGraph</span>
          </div>

          <div className="hidden items-center gap-7 md:flex">
            <a href="#workflow" className="text-sm text-white/70 hover:text-white">Workflow</a>
            <a href="#pricing" className="text-sm text-white/70 hover:text-white">Pricing</a>
            <Link to="/login" className="text-sm text-white/70 hover:text-white">Sign in</Link>
            <Link to="/register">
              <Button size="sm" className="bg-white text-gray-950 hover:bg-primary-100">
                Get started
              </Button>
            </Link>
          </div>

          <button
            className="cursor-pointer rounded-md p-2 text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-gray-950 px-4 py-4 md:hidden">
            <div className="space-y-3">
              <a href="#workflow" className="block py-2 text-sm text-white/75" onClick={() => setMobileMenuOpen(false)}>Workflow</a>
              <a href="#pricing" className="block py-2 text-sm text-white/75" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <Link to="/login" className="block py-2 text-sm text-white/75" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-white text-gray-950 hover:bg-primary-100">Get started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="relative min-h-[86vh] overflow-hidden bg-gray-950 pt-16">
        <img
          src={heroImage}
          alt="DealGraph revenue workspace preview"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.92),rgba(3,7,18,0.62),rgba(3,7,18,0.2))]" />
        <div className="relative mx-auto flex min-h-[calc(86vh-4rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-primary-100">
              <Target className="h-4 w-4" />
              Built for B2B service pipelines
            </div>
            <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl">
              DealGraph CRM
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
              A retrieval-augmented CRM for agencies, consultancies, implementation partners, and staffing teams that need to act on lead notes faster.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/register">
                <Button size="xl" className="gap-2 bg-primary-400 text-gray-950 hover:bg-primary-300">
                  Start with your leads <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#workflow">
                <Button size="xl" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-gray-950">
                  View workflow
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary-300" /> Search with evidence</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary-300" /> User-scoped retrieval</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-primary-300" /> CSV-ready MVP</span>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">Workflow</p>
            <h2 className="mt-3 text-3xl font-semibold text-gray-950 sm:text-4xl">
              Turn scattered sales notes into a daily action list.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-gray-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Use case</p>
            <h2 className="mt-3 text-3xl font-semibold text-gray-950">Best first customer: B2B service firms.</h2>
            <p className="mt-4 text-gray-600">
              They sell through discovery calls, proposals, referrals, and relationship context. That makes retrieval over notes immediately useful.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {['Digital agencies', 'IT consultancies', 'Staffing firms'].map((item) => (
              <div key={item} className="rounded-lg border border-gray-200 bg-[#f6f7f4] p-4">
                <p className="text-sm font-semibold text-gray-950">{item}</p>
                <p className="mt-2 text-xs leading-5 text-gray-600">High-touch leads, messy notes, and expensive missed follow-ups.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold text-gray-950">Start small, then scale the search index.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border bg-white p-6 shadow-sm ${
                  plan.highlighted ? 'border-gray-950 ring-2 ring-gray-950/5' : 'border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="mb-4 inline-flex rounded-md bg-gray-950 px-2.5 py-1 text-xs font-medium text-white">
                    Most practical
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-950">{plan.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-600">{plan.description}</p>
                <div className="mt-5">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-semibold text-gray-950">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-semibold text-gray-950">₹{plan.price.toLocaleString('en-IN')}</span>
                      <span className="ml-1 text-sm text-gray-500">/month</span>
                    </>
                  )}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-primary-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button className="mt-8 w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-5 w-5 text-primary-300" />
            <span className="font-semibold">DealGraph</span>
          </div>
          <p className="text-sm text-white/55">(c) 2026 DealGraph. Built for retrieval-augmented sales workflows.</p>
        </div>
      </footer>
    </div>
  )
}
