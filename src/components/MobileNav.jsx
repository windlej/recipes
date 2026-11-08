import { NavLink } from 'react-router-dom'
import { BookIcon, DiceIcon, FridgeIcon, HeartIcon } from './icons'

const items = [
  { to: '/', label: 'Recipes', icon: BookIcon, end: true },
  { to: '/fridge', label: 'Fridge', icon: FridgeIcon },
  { to: '/favorites', label: 'Saved', icon: HeartIcon },
]

export default function MobileNav({ onSurprise }) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t-2 border-black bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="grid grid-cols-4">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex min-h-[60px] flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${
                isActive ? 'bg-bauhaus-yellow' : 'hover:bg-mist'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-5 top-0 h-1 rounded-b-full bg-bauhaus-blue"
                  />
                ) : null}
                <Icon size={21} />
                {label}
              </>
            )}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={onSurprise}
          className="flex min-h-[60px] flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-bauhaus-yellow-light"
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-bauhaus-red">
            <DiceIcon size={16} />
          </span>
          Surprise
        </button>
      </div>
    </nav>
  )
}
