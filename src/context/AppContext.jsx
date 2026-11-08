import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { addManyIngredients, removeIngredient } from '../lib/matching'
import { STORAGE_KEYS, useLocalStorage } from '../lib/storage'

const AppContext = createContext(null)

function sanitizeFavorites(value) {
  if (!Array.isArray(value)) return []
  return [...new Set(value.filter((item) => typeof item === 'string' && item))]
}

function sanitizeMadeIt(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => entry && typeof entry === 'object')
      .map(([id, entry]) => [
        id,
        {
          rating: Number(entry.rating) || 0,
          notes: typeof entry.notes === 'string' ? entry.notes : '',
          madeOn: typeof entry.madeOn === 'string' ? entry.madeOn : new Date().toISOString(),
        },
      ]),
  )
}

function sanitizePantry(value) {
  if (!Array.isArray(value)) return []
  return value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
}

export function AppProvider({ children }) {
  const [rawFavorites, setRawFavorites] = useLocalStorage(STORAGE_KEYS.favorites, [])
  const [rawMadeIt, setRawMadeIt] = useLocalStorage(STORAGE_KEYS.madeIt, {})
  const [rawPantry, setRawPantry] = useLocalStorage(STORAGE_KEYS.pantry, [])
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const favorites = useMemo(() => sanitizeFavorites(rawFavorites), [rawFavorites])
  const madeIt = useMemo(() => sanitizeMadeIt(rawMadeIt), [rawMadeIt])
  const pantry = useMemo(() => sanitizePantry(rawPantry), [rawPantry])

  const notify = useCallback((message) => {
    setToast({ message, id: `${Date.now()}-${Math.random()}` })
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    },
    [],
  )

  const isFavorite = useCallback(
    (recipeId) => favorites.includes(recipeId),
    [favorites],
  )

  const toggleFavorite = useCallback(
    (recipeId) => {
      const exists = favorites.includes(recipeId)
      setRawFavorites(exists ? favorites.filter((id) => id !== recipeId) : [...favorites, recipeId])
      notify(exists ? 'Removed from Make soon' : 'Saved to Make soon')
    },
    [favorites, notify, setRawFavorites],
  )

  const saveMadeIt = useCallback(
    (recipeId, entry) => {
      const previous = madeIt[recipeId]
      setRawMadeIt({
        ...madeIt,
        [recipeId]: {
          rating: Number(entry?.rating) || 0,
          notes: typeof entry?.notes === 'string' ? entry.notes : '',
          madeOn: previous?.madeOn ?? new Date().toISOString(),
        },
      })
      notify(previous ? 'Your notes are updated' : 'Added to your Made it list')
    },
    [madeIt, notify, setRawMadeIt],
  )

  const removeMadeIt = useCallback(
    (recipeId) => {
      const next = { ...madeIt }
      delete next[recipeId]
      setRawMadeIt(next)
      notify('Removed from Made it')
    },
    [madeIt, notify, setRawMadeIt],
  )

  const addPantryItems = useCallback(
    (values) => {
      const items = Array.isArray(values) ? values : [values]
      const next = addManyIngredients(pantry, items)
      if (next.length === pantry.length) return
      setRawPantry(next)
      notify('Pantry staples saved on this device')
    },
    [notify, pantry, setRawPantry],
  )

  const removePantryItem = useCallback(
    (item) => {
      setRawPantry(removeIngredient(pantry, item))
      notify('Pantry staple removed')
    },
    [notify, pantry, setRawPantry],
  )

  const clearPantry = useCallback(() => {
    setRawPantry([])
    notify('Pantry cleared')
  }, [notify, setRawPantry])

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
      madeIt,
      saveMadeIt,
      removeMadeIt,
      pantry,
      addPantryItems,
      removePantryItem,
      clearPantry,
    }),
    [
      favorites,
      isFavorite,
      toggleFavorite,
      madeIt,
      saveMadeIt,
      removeMadeIt,
      pantry,
      addPantryItems,
      removePantryItem,
      clearPantry,
    ],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="no-print pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex justify-center px-4 md:bottom-8"
      >
        {toast ? (
          <div
            key={toast.id}
            className="animate-pop flex items-center gap-2 rounded-full border-2 border-black bg-bauhaus-yellow px-5 py-3 text-sm font-bold text-ink"
          >
            <span aria-hidden="true" className="size-2.5 rounded-full bg-bauhaus-blue" />
            {toast.message}
          </div>
        ) : null}
      </div>
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
