import { resolveImageUrl } from '@/lib/resolve-images'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoWatermarkProps {
  /** Size variant of the logo watermark */
  size?: 'sm' | 'md' | 'lg'
  /** Position on the page */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  /** Opacity level */
  opacity?: 'subtle' | 'medium' | 'visible'
  /** Whether to show on blue background (adds bleed effect) */
  blueBackground?: boolean
  /** Custom className */
  className?: string
}

export function LogoWatermark({
  size = 'md',
  position = 'top-right',
  opacity = 'subtle',
  blueBackground = false,
  className,
}: LogoWatermarkProps) {
  const sizeMap = {
    sm: { height: 40, width: 150 },
    md: { height: 60, width: 200 },
    lg: { height: 80, width: 250 },
  }

  const opacityMap = {
    subtle: 'opacity-10',
    medium: 'opacity-20',
    visible: 'opacity-40',
  }

  const positionMap = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }

  const dimensions = sizeMap[size]

  return (
    <div className={cn('absolute pointer-events-none z-0', positionMap[position], className)}>
      {/* Bleed effect for blue backgrounds */}
      {blueBackground && (
        <div className="absolute inset-0 overflow-visible">
          {/* Primary gradient */}
          <div
            className="absolute -inset-8 transition-opacity duration-500"
            style={{
              background: `
                radial-gradient(ellipse at center, 
                  rgba(12, 19, 85, 0.20) 0%,
                  rgba(6, 8, 40, 0.10) 40%,
                  transparent 70%
                )
              `,
            }}
          />
          {/* Secondary softer layer */}
          <div
            className="absolute -inset-6 transition-opacity duration-500"
            style={{
              background: `
                radial-gradient(ellipse at center, 
                  rgba(1, 1, 50, 0.18) 0%,
                  rgba(1, 0, 30, 0.08) 50%,
                  transparent 80%
                )
              `,
            }}
          />
          {/* Gold shimmer */}
          <div
            className="absolute -inset-4 transition-opacity duration-500"
            style={{
              background: `
                radial-gradient(ellipse at center, 
                  rgba(196, 160, 82, 0.1) 0%,
                  transparent 70%
                )
              `,
            }}
          />
        </div>
      )}

      {/* Logo */}
      <div className="relative">
        <Image
          src={resolveImageUrl("/images/logo.png")}
          alt="CR Home Pros"
          width={dimensions.width}
          height={dimensions.height}
          className={cn(
            'w-auto object-contain transition-opacity duration-300',
            opacityMap[opacity]
          )}
          style={{
            filter: blueBackground 
              ? 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 15px rgba(196, 160, 82, 0.2))'
              : 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1))'
          }}
          quality={100}
          unoptimized
        />
      </div>
    </div>
  )
}
