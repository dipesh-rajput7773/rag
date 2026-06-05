import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'hot' | 'warm' | 'cold' | 'success' | 'warning' | 'error'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    hot: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    warm: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    cold: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    warning: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
    error: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  }
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize',
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = 'Badge'

export { Badge }
