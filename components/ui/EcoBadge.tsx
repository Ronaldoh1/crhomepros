import Link from 'next/link'

interface EcoBadgeProps {
  size?: 'sm' | 'md' | 'lg'
  showLink?: boolean
  className?: string
}

export function EcoBadge({ size = 'md', showLink = true, className = '' }: EcoBadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  }

  const badge = (
    <span
      className={`inline-flex items-center font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizes[size]} ${className}`}
    >
      <span className="text-emerald-500">🌿</span>
      Eco-Friendly Options
    </span>
  )

  if (showLink) {
    return (
      <Link href="/blog/green-renovations-sustainability" className="hover:opacity-80 transition-opacity">
        {badge}
      </Link>
    )
  }

  return badge
}

export function EcoBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🌿</span>
        </div>
        <div>
          <h3 className="text-lg font-display font-bold text-emerald-800 mb-1">
            Green & Sustainable Options Available
          </h3>
          <p className="text-emerald-700 text-sm mb-3">
            We offer eco-friendly materials, energy-efficient upgrades, and sustainable practices on every project.
            Ask about low-VOC paints, Energy Star appliances, LED lighting, and reclaimed materials.
          </p>
          <Link
            href="/blog/green-renovations-sustainability"
            className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 inline-flex items-center gap-1"
          >
            Learn about our green approach →
          </Link>
        </div>
      </div>
    </div>
  )
}
