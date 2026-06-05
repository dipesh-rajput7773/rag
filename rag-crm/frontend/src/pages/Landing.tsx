import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Sparkles, Search, Shield, Zap, Users, BarChart3,
  Check, ArrowRight, Star, Menu, X,
} from 'lucide-react'
import { useState } from 'react'
import type { PricingPlan } from '@/types'

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out RAG CRM',
    features: ['100 leads', '50 AI searches', 'Basic analytics', 'Email support'],
    cta: 'Get Started',
  },
  {
    name: 'Starter',
    price: 29,
    description: 'For small teams getting started',
    features: ['1,000 leads', '500 AI searches', 'Advanced analytics', 'Priority email support', 'API access'],
    highlighted: true,
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    price: 79,
    description: 'For growing businesses',
    features: ['10,000 leads', '5,000 AI searches', 'Real-time analytics', 'API access + webhooks', 'Team collaboration', 'Custom branding'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: 199,
    description: 'For large organizations',
    features: ['Unlimited leads', 'Unlimited AI searches', 'Custom integrations', 'Dedicated support', 'SLA guarantee', 'On-premise option', 'Custom AI model'],
    cta: 'Contact Sales',
  },
]

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                RAG CRM
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link to="/register">
                <Button size="sm" variant="gradient">Get Started</Button>
              </Link>
            </div>

            <button className="md:hidden p-2 cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#pricing" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <Link to="/login" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full" variant="gradient">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-white pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-sm text-primary-700 mb-8">
            <Sparkles className="w-4 h-4" />
            Powered by Retrieval-Augmented Generation
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Your CRM,{' '}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Supercharged with AI
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop searching. Start selling. RAG CRM uses cutting-edge AI to understand your leads,
            answer complex questions, and surface the opportunities that matter.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register">
              <Button size="xl" variant="gradient" className="gap-2">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="xl" variant="outline">See Features</Button>
            </a>
          </div>
          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Free forever tier</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 14-day trial</span>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to close more deals
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              RAG CRM combines the power of AI with a beautiful, intuitive interface.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Search, title: 'AI-Powered Search', desc: 'Ask natural language questions. "Who should I call today?" — get instant answers.' },
              { icon: Zap, title: 'Smart Lead Scoring', desc: 'AI automatically scores and prioritizes leads based on intent and engagement.' },
              { icon: Users, title: 'Lead Management', desc: 'Beautiful Kanban boards and list views to manage your pipeline effortlessly.' },
              { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track conversions, engagement, and team performance with live dashboards.' },
              { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2 compliant, encrypted at rest and in transit. Your data stays yours.' },
              { icon: Sparkles, title: 'Automated Enrichment', desc: 'Auto-enrich leads with company data, social profiles, and intent signals.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-100/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                  plan.highlighted
                    ? 'border-primary-500 bg-gradient-to-b from-primary-50/50 to-white shadow-xl shadow-primary-100 scale-105'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-600 to-purple-600 text-white text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-400 ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button className="w-full" variant={plan.highlighted ? 'gradient' : 'outline'}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to transform your CRM?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of sales teams using AI to close more deals. Start your free trial today.
          </p>
          <Link to="/register">
            <Button size="xl" className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <span className="text-lg font-bold text-white">RAG CRM</span>
          </div>
          <p className="text-sm">&copy; 2026 RAG CRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
