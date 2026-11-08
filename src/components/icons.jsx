function Svg({ size = 20, className = '', children, fill = 'none', ...props }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {children}
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4.2-4.2" />
    </Svg>
  )
}

export function ClockIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  )
}

export function HeartIcon({ filled = false, ...props }) {
  return (
    <Svg {...props} fill={filled ? 'currentColor' : 'none'}>
      <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </Svg>
  )
}

export function FridgeIcon(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
      <path d="M5 9h14M8 5.5v2M8 12v3" />
    </Svg>
  )
}

export function SparkleIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </Svg>
  )
}

export function DiceIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function PrinterIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <rect x="7" y="14" width="10" height="7" rx="1" />
    </Svg>
  )
}

export function ArrowRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </Svg>
  )
}

export function ArrowLeftIcon(props) {
  return (
    <Svg {...props}>
      <path d="M20 12H4M10 6l-6 6 6 6" />
    </Svg>
  )
}

export function PlusIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  )
}

export function CloseIcon(props) {
  return (
    <Svg {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Svg>
  )
}

export function CheckIcon(props) {
  return (
    <Svg {...props}>
      <path d="m4 12 5 5L20 6" />
    </Svg>
  )
}

export function StarIcon({ filled = false, ...props }) {
  return (
    <Svg {...props} fill={filled ? 'currentColor' : 'none'}>
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
    </Svg>
  )
}

export function BookIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 6.5C10.5 4.8 8.3 4 5 4H2v15h4c2.8 0 4.8.7 6 2.2 1.2-1.5 3.2-2.2 6-2.2h4V4h-3c-3.3 0-5.5.8-7 2.5Z" />
      <path d="M12 6.5V21" />
    </Svg>
  )
}

export function SlidersIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h8M16 18h4" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="8" cy="12" r="2" />
      <circle cx="14" cy="18" r="2" />
    </Svg>
  )
}

export function TrashIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </Svg>
  )
}

export function PencilIcon(props) {
  return (
    <Svg {...props}>
      <path d="m4 20 4.5-1L20 7.5a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z" />
      <path d="m14.5 7 3 3" />
    </Svg>
  )
}

export function ChevronDownIcon(props) {
  return (
    <Svg {...props}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  )
}


export function ChefHatIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 13a4.5 4.5 0 1 1 1-8.9 4.5 4.5 0 0 1 10 0A4.5 4.5 0 1 1 18 13v4.5H6V13Z" />
      <path d="M6 21h12M9.5 13v4.5M14.5 13v4.5" />
    </Svg>
  )
}

export function TimerIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2M9 2h6" />
    </Svg>
  )
}
