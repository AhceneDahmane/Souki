interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 28, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
        <path
          d="M8 18c0-3 2-6 4-7l2 2c-2 1-3 3-3 5s1 4 3 5l-2 2c-2-1-4-4-4-7z"
          fill="black" opacity="0.9"
        />
        <path
          d="M12 16c0-2 1.5-3.5 3-4.5l1.5 1.5c-1 .7-2 1.7-2 3s1 2.3 2 3l-1.5 1.5c-1.5-1-3-2.5-3-4.5z"
          fill="black" opacity="0.9"
        />
        <circle cx="20" cy="16" r="2.5" fill="black" />
        <path
          d="M24 10l-2 2 1 1 2-2-1-1zM24 20l-2 2 1 1 2-2-1-1zM24 15h-3v2h3v-2z"
          fill="black" opacity="0.9"
        />
      </svg>
      {showText && (
        <span className="text-lg font-bold text-white tracking-tight">
          Souki
        </span>
      )}
    </div>
  );
}
