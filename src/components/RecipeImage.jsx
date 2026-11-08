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

  if (failed) {
    return (
      <div
        role="img"
        aria-label={recipe.imageAlt || recipe.title}
        className={`relative flex items-center justify-center overflow-hidden bg-bauhaus-yellow ${className}`}
      >
        <div aria-hidden="true" className="absolute -right-8 -top-8 size-32 rounded-full bg-bauhaus-blue" />
        <div aria-hidden="true" className="absolute -bottom-10 -left-10 size-32 rounded-full bg-bauhaus-red" />
        <span className="relative flex size-16 items-center justify-center rounded-full border-2 border-black bg-white">
          <ChefHatIcon size={28} />
        </span>
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
