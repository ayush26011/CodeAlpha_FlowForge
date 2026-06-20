/**
 * FlowForge Logo Component
 * Variants: 'full' (icon + wordmark), 'icon' (icon only), 'wordmark' (text only)
 * Sizes: 'sm', 'md', 'lg', 'xl'
 */
export default function FlowForgeLogo({
  variant = 'full',
  size = 'md',
  className = '',
}) {
  const sizes = {
    sm:  { icon: 24, text: 14, gap: 8  },
    md:  { icon: 32, text: 18, gap: 10 },
    lg:  { icon: 40, text: 22, gap: 12 },
    xl:  { icon: 56, text: 28, gap: 16 },
  };
  const s = sizes[size] || sizes.md;

  // The FF icon — two geometric F shapes interlocking with a gold gradient
  const Icon = ({ sz = s.icon }) => (
    <svg
      width={sz}
      height={sz}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left F stroke */}
      <path
        d="M3.5 5.5H14v4H7.5v5h5.5v4H7.5V26.5H3.5V5.5Z"
        fill="url(#ff_g1)"
      />
      {/* Right F stroke */}
      <path
        d="M17 5.5h11.5v4H21v5h5.5v4H21V26.5H17V5.5Z"
        fill="url(#ff_g2)"
      />
      {/* Horizontal connector — the "flow" bar */}
      <rect x="3.5" y="14.5" width="25" height="4" rx="2" fill="url(#ff_bar)" opacity="0.4" />
      <defs>
        <linearGradient id="ff_g1" x1="3.5" y1="5.5" x2="14" y2="26.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4A853" />
          <stop offset="1" stopColor="#8B6835" />
        </linearGradient>
        <linearGradient id="ff_g2" x1="17" y1="5.5" x2="28.5" y2="26.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4A853" />
          <stop offset="1" stopColor="#8B6835" />
        </linearGradient>
        <linearGradient id="ff_bar" x1="3.5" y1="16.5" x2="28.5" y2="16.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4A853" />
          <stop offset="1" stopColor="#8B6835" />
        </linearGradient>
      </defs>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={className} style={{ display: 'inline-flex' }}>
        <Icon sz={s.icon} />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span
        className={className}
        style={{
          fontFamily: "'Inter', 'Geist', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: s.text,
          letterSpacing: '-0.03em',
          color: '#FFFBF4',
          lineHeight: 1,
        }}
      >
        FlowForge
      </span>
    );
  }

  // Default: full logo (icon + wordmark)
  return (
    <div
      className={`flex items-center ${className}`}
      style={{ gap: s.gap }}
      role="img"
      aria-label="FlowForge"
    >
      <Icon sz={s.icon} />
      <span
        style={{
          fontFamily: "'Inter', 'Geist', system-ui, sans-serif",
          fontWeight: 700,
          fontSize: s.text,
          letterSpacing: '-0.03em',
          color: '#FFFBF4',
          lineHeight: 1,
        }}
      >
        FlowForge
      </span>
    </div>
  );
}
