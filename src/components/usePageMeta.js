import { useEffect } from 'react'

export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — Windle Family Recipes` : 'Windle Family Recipes'

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        description ||
          'Windle Family Recipes — a hand-picked family cookbook with a fridge matcher, favorites, and a surprise-me picker.',
      )
    }
  }, [title, description])
}
