import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatMinutes } from '../lib/format'
import RecipeImage from './RecipeImage'
import { ClockIcon, HeartIcon } from './icons'

export default function RecipeCard({ recipe, priority = false }) {
  const { isFavorite, toggleFavorite } = useApp()
  const favorite = isFavorite(recipe.id)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border-2 border-black bg-white transition-colors duration-200 hover:border-bauhaus-blue">
      <Link
        to={`/recipe/${recipe.id}`}
        aria-label={`View recipe: ${recipe.title}`}
        className="absolute inset-0 z-10 rounded-[18px] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-bauhaus-blue"
      />

      <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black bg-bauhaus-yellow">
        <RecipeImage
          recipe={recipe}
          loading={priority ? 'eager' : 'lazy'}
          imgClassName="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="pointer-events-none absolute left-3 top-3 z-20 inline-flex min-h-8 items-center rounded-full border-2 border-black bg-white px-3 text-[10px] font-bold uppercase tracking-[0.14em]">
          {recipe.categories[0]}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            toggleFavorite(recipe.id)
          }}
          aria-pressed={favorite}
          aria-label={favorite ? `Remove ${recipe.title} from Make soon` : `Save ${recipe.title} to Make soon`}
          className="btn-icon absolute right-3 top-3 z-20"
        >
          <HeartIcon
            filled={favorite}
            size={19}
            className={favorite ? 'text-bauhaus-red' : 'text-ink'}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-[1.35rem] leading-[1.08] transition-colors group-hover:text-bauhaus-blue sm:text-2xl">
          {recipe.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-700">
          {recipe.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon size={16} />
            {formatMinutes(recipe.totalTime)}
          </span>
          <span aria-hidden="true" className="size-1 rounded-full bg-bauhaus-red" />
          <span className="italic text-neutral-700">{recipe.difficulty}</span>
        </div>

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-4" aria-label="Tags">
          {recipe.tags.slice(0, 3).map((tag) => (
            <li
              key={tag}
              className="inline-flex min-h-7 items-center rounded-full border-2 border-black bg-mist px-2.5 text-[11px] font-bold leading-none"
            >
              #{tag}
            </li>
          ))}
          {recipe.tags.length > 3 ? (
            <li className="inline-flex min-h-7 items-center px-1.5 text-[11px] font-bold italic">
              +{recipe.tags.length - 3}
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  )
}
