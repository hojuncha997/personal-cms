import { theme } from '@/constants/styles/theme'

interface LogoProps {
  width?: number;
  height?: number;
  isDarkMode?: boolean;
}

export function Logo({ width = 40, height = 40, isDarkMode = false }: LogoProps) {
  const strokeColor = isDarkMode ? "white" : theme.colors.primary;
  const fillColor = isDarkMode ? "white" : theme.colors.primary;
  
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={width} height={height}>
      <g stroke={strokeColor} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="40" y="50" width="15" height="70" fill={fillColor} />
        <rect x="65" y="30" width="15" height="90" fill={fillColor} />
        <rect x="90" y="60" width="15" height="60" fill={fillColor} />
        <rect x="115" y="20" width="15" height="100" fill={fillColor} />
        <rect x="140" y="80" width="15" height="40" fill={fillColor} />
        
        <line x1="47.5" y1="120" x2="47.5" y2="140" stroke={strokeColor} strokeWidth="2" />
        <line x1="72.5" y1="120" x2="72.5" y2="140" stroke={strokeColor} strokeWidth="2" />
        <line x1="97.5" y1="120" x2="97.5" y2="140" stroke={strokeColor} strokeWidth="2" />
        <line x1="122.5" y1="120" x2="122.5" y2="140" stroke={strokeColor} strokeWidth="2" />
        <line x1="147.5" y1="120" x2="147.5" y2="140" stroke={strokeColor} strokeWidth="2" />
        
        <circle cx="47.5" cy="140" r="5" fill={fillColor} />
        <circle cx="72.5" cy="140" r="5" fill={fillColor} />
        <circle cx="97.5" cy="140" r="5" fill={fillColor} />
        <circle cx="122.5" cy="140" r="5" fill={fillColor} />
        <circle cx="147.5" cy="140" r="5" fill={fillColor} />
      </g>
    </svg>
  );
} 