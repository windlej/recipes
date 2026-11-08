import { useCallback, useEffect, useRef, useState } from 'react'

export const STORAGE_KEYS = {
  favorites: 'wfr:favorites:v1',
  madeIt: 'wfr:made-it:v1',
  pantry: 'wfr:pantry:v1',
}

function readValue(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeValue(key, value) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable in private mode or when the quota is full.
    // The app still works for the current session; it just will not persist.
  }
}

/**
 * A small, SSR-safe localStorage-backed state hook.
 * It also listens for storage events so two open tabs stay in sync.
 */
export function useLocalStorage(key, initialValue) {
  const fallbackRef = useRef(initialValue)
  const [value, setValue] = useState(() => readValue(key, initialValue))
  const keyRef = useRef(key)

  useEffect(() => {
    if (keyRef.current !== key) {
      keyRef.current = key
      setValue(readValue(key, fallbackRef.current))
    }
  }, [key])

  useEffect(() => {
    writeValue(key, value)
  }, [key, value])

  useEffect(() => {
    function handleStorage(event) {
      if (event.key !== key) return
      try {
        setValue(event.newValue === null ? fallbackRef.current : JSON.parse(event.newValue))
      } catch {
        // Ignore malformed values written by another tab.
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  const update = useCallback((next) => {
    setValue((current) => (typeof next === 'function' ? next(current) : next))
  }, [])

  return [value, update]
}
