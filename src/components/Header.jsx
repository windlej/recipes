import { Link, NavLink } from 'react-router-dom'
import { DiceIcon, FridgeIcon } from './icons'

const navItems = [
  { to: '/', label: 'Recipes', end: true },
  { to: '/fridge', label: 'Fridge matcher' },
  { to: '/favorites', label: 'Saved' },
]

function LogoMark() {
  return (
    <span aria-hidden="true" className="relative block size-10 shrink-0 sm:size-11">
      <span className="absolute left-0 top-1.5 size-7 rounded-full bg-bauhaus-blue sm:size-8" />
      <span className="absolute bottom-1 right-0 size-6 rounded-tl-full bg-bauhaus-red sm:size-7" />
      <span className="absolute left-1.5 top-4 h-1.5 w-6 rounded-full bg-black sm:top-5 sm:w-7" />
      <span className="absolute right-1 top-0 size-2.5 rounded-full bg-black" />
    </span>
  )
}

export default function Header({ onSurprise }) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-black bg-bauhaus-yellow">
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-2.5 rounded-full pr-2 focus-visible:outline-offset-4"
          title="Windle Family Recipes home"
        >
          <LogoMark />
          <span className="leading-none">
            <span className="block font-serif text-[1.35rem] font-black tracking-[-0.035em] sm:text-2xl">
              Windle
            </span>
            <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.22em] sm:text-[10px]">
              Family Recipes
            </span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 text-sm font-bold transition-colors ${
                  isActive
                    ? 'border-black bg-white'
                    : 'border-transparent hover:border-black hover:bg-bauhaus-yellow-light'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? <span aria-hidden="true" className="size-1.5 rounded-full bg-bauhaus-blue" /> : null}
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button type="button" onClick={onSurprise} className="btn btn-red btn-sm hidden shrink-0 md:inline-flex">
          <DiceIcon size={18} />
          Surprise me
        </button>

        <Link
          to="/fridge"
          aria-label="Open the fridge matcher"
          className="btn-icon shrink-0 md:hidden"
        >
          <FridgeIcon size={20} />
        </Link>
      </div>
    </header>
  )
}
