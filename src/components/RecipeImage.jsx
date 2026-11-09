import { useEffect, useState } from 'react'
import { assetUrl } from '../lib/recipes'
import { ChefHatIcon } from './icons'

export default function RecipeImage({
  recipe,
  className = '',
  imgClassName = '',
  loading = 'lazy',
  eager = false,
}) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [recipe?.image])

  if (!recipe) return null

  const hasImage = Boolean(recipe.image)
  const unavailable = hasImage && failed

  if (!hasImage || failed) {
    return (
      <div
        role="img"
        aria-label={
          recipe.imageAlt ||
          `${recipe.title} — ${unavailable ? 'photo unavailable' : 'photo coming soon'}`
        }
        className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-bauhaus-yellow ${className}`}
      >
        <div aria-hidden="true" className="absolute -right-8 -top-8 size-32 rounded-full bg-bauhaus-blue" />
        <div aria-hidden="true" className="absolute -bottom-10 -left-10 size-32 rounded-full bg-bauhaus-red" />
        <div className="relative flex flex-col items-center gap-2 px-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full border-2 border-black bg-white">
            <ChefHatIcon size={28} />
          </span>
          <span className="inline-flex min-h-7 items-center rounded-full border-2 border-black bg-white px-2.5 text-[9px] font-bold uppercase tracking-[0.14em]">
            {unavailable ? 'Photo unavailable' : 'Photo coming soon'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={assetUrl(recipe.image)}
      alt={recipe.imageAlt || recipe.title}
      width="1200"
      height="900"
      loading={eager ? 'eager' : loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${imgClassName}`}
    />
  )
}
