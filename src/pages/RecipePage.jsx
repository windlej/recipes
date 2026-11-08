import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatDate, formatMinutes } from '../lib/format'
import { getRecipe, getRelatedRecipes } from '../lib/recipes'
import usePageMeta from '../components/usePageMeta'
import MadeItDialog from '../components/MadeItDialog'
import RecipeCard from '../components/RecipeCard'
import RecipeImage from '../components/RecipeImage'
import StarRating from '../components/StarRating'
import NotFoundPage from './NotFoundPage'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookIcon,
  ChefHatIcon,
  CheckIcon,
  HeartIcon,
  PencilIcon,
  PrinterIcon,
  StarIcon,
  TimerIcon,
} from '../components/icons'

export default function RecipePage() {
  const { id } = useParams()
  const recipe = getRecipe(id)
  const related = useMemo(() => getRelatedRecipes(recipe, 3), [recipe])
  const { isFavorite, toggleFavorite, madeIt, saveMadeIt, removeMadeIt } = useApp()
  const [checked, setChecked] = useState(() => new Set())
  const [madeItOpen, setMadeItOpen] = useState(false)

  usePageMeta(recipe?.title ?? 'Recipe not found', recipe?.description)

  useEffect(() => {
    setChecked(new Set())
  }, [id])

  if (!recipe) return <NotFoundPage />

  const made = madeIt[recipe.id]
  const favorite = isFavorite(recipe.id)

  const groupedIngredients = recipe.ingredients.reduce((groups, ingredient) => {
    const group = ingredient.group || 'Ingredients'
    if (!groups[group]) groups[group] = []
    groups[group].push(ingredient)
    return groups
  }, {})

  const requiredCount = recipe.ingredients.filter((ingredient) => !ingredient.optional).length

  function toggleChecked(index) {
    setChecked((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <>
      <section className="recipe-hero relative overflow-hidden border-b-2 border-black bg-bauhaus-yellow">
        <div
          aria-hidden="true"
          className="print-hide absolute -left-20 top-20 hidden size-64 rounded-full border-2 border-black bg-bauhaus-blue sm:block sm:size-80"
        />
        <div
          aria-hidden="true"
          className="print-hide absolute -bottom-16 right-1/3 hidden size-40 rounded-t-full bg-bauhaus-red sm:block"
        />
        <div
          aria-hidden="true"
          className="print-hide pattern-dots absolute right-8 top-8 size-24 text-black"
        />

        <div className="container-page relative py-6 sm:py-8 lg:py-10">
          <nav aria-label="Breadcrumb" className="print-hide mb-6 flex flex-wrap items-center gap-2 text-sm font-bold">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-1.5 underline decoration-2 underline-offset-4 hover:text-bauhaus-blue"
            >
              <ArrowLeftIcon size={15} />
              All recipes
            </Link>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-bauhaus-red" />
            <span>{recipe.categories[0]}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 print:block">
            <div className="flex flex-col justify-center">
              <div className="print-hide flex flex-wrap gap-2">
                {recipe.categories.map((category) => (
                  <Link
                    key={category}
                    to={`/?category=${encodeURIComponent(category)}`}
                    className="chip-static min-h-11 bg-white hover:bg-bauhaus-yellow-light"
                  >
                    {category}
                  </Link>
                ))}
                <span className="chip-static min-h-8 italic">{recipe.difficulty}</span>
              </div>

              <h1 className="mt-4 text-balance text-[2.8rem] leading-[0.92] tracking-[-0.035em] sm:text-6xl lg:text-[4.7rem]">
                {recipe.title}
              </h1>

              <p className="mt-4 max-w-2xl text-pretty text-base font-medium leading-relaxed sm:text-lg">
                {recipe.description}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-[16px] border-2 border-black bg-white px-3 py-2.5">
                  <dt className="label-caps text-[9px]">Prep</dt>
                  <dd className="mt-1 font-serif text-xl font-black leading-none">
                    {formatMinutes(recipe.prepTime)}
                  </dd>
                </div>
                <div className="rounded-[16px] border-2 border-black bg-white px-3 py-2.5">
                  <dt className="label-caps text-[9px]">Cook</dt>
                  <dd className="mt-1 font-serif text-xl font-black leading-none">
                    {formatMinutes(recipe.cookTime)}
                  </dd>
                </div>
                <div className="rounded-[16px] border-2 border-black bg-bauhaus-yellow-light px-3 py-2.5">
                  <dt className="label-caps text-[9px]">Total</dt>
                  <dd className="mt-1 font-serif text-xl font-black leading-none">
                    {formatMinutes(recipe.totalTime)}
                  </dd>
                </div>
                <div className="rounded-[16px] border-2 border-black bg-white px-3 py-2.5">
                  <dt className="label-caps text-[9px]">Serves</dt>
                  <dd className="mt-1 font-serif text-xl font-black leading-none">
                    {recipe.servings}
                  </dd>
                </div>
              </dl>

              <div className="print-hide mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleFavorite(recipe.id)}
                  aria-pressed={favorite}
                  className={`btn btn-sm ${favorite ? 'border-black bg-bauhaus-red' : 'btn-white'}`}
                >
                  <HeartIcon filled={favorite} size={17} />
                  {favorite ? 'Saved for later' : 'Make this soon'}
                </button>
                <button
                  type="button"
                  onClick={() => setMadeItOpen(true)}
                  className={`btn btn-sm ${made ? 'border-black bg-bauhaus-yellow-light' : 'btn-white'}`}
                >
                  <ChefHatIcon size={17} />
                  {made ? 'Update your notes' : 'I made this'}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-white btn-sm"
                >
                  <PrinterIcon size={17} />
                  Print recipe
                </button>
              </div>

              {made ? (
                <div className="print-hide mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
                  <StarRating value={made.rating} size={16} />
                  <span className="italic">
                    Made it {formatDate(made.madeOn)}
                    {made.notes ? ' · your notes are saved' : ''}
                  </span>
                  <Link
                    to="/favorites?tab=made"
                    className="inline-flex min-h-11 items-center font-bold underline decoration-2 underline-offset-4"
                  >
                    View Made it
                  </Link>
                </div>
              ) : null}
            </div>

            <div className="print-hide relative">
              <div
                aria-hidden="true"
                className="absolute -right-3 -top-3 z-10 flex size-20 rotate-6 items-center justify-center rounded-full border-2 border-black bg-bauhaus-red text-center font-serif text-xs font-black uppercase leading-tight"
              >
                Family
                <br />
                tested
              </div>
              <div className="overflow-hidden rounded-[20px] border-2 border-black bg-white p-2">
                <div className="aspect-[4/3] overflow-hidden rounded-[14px] border-2 border-black bg-bauhaus-yellow">
                  <RecipeImage recipe={recipe} eager imgClassName="h-full" />
                </div>
                <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
                  <span className="label-caps flex items-center gap-1.5">
                    <StarIcon size={13} filled className="text-bauhaus-red" />
                    From the family box
                  </span>
                  <span className="text-xs font-bold italic">{formatMinutes(recipe.totalTime)} total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist py-8 sm:py-12 print:bg-white print:py-0">
        <div className="container-page print-grid grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-5">
            <div id="ingredients" className="print-card rounded-[20px] border-2 border-black bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3 border-b-2 border-black pb-4">
                <div>
                  <p className="label-caps">What you need</p>
                  <h2 className="mt-1 text-3xl leading-none">Ingredients</h2>
                </div>
                <span className="chip-static min-h-9 shrink-0">{recipe.servings} servings</span>
              </div>

              <p className="print-hide mt-3 text-xs font-medium italic text-neutral-700">
                Tick things off as you gather them. {requiredCount} core ingredients.
              </p>

              <div className="mt-2">
                {Object.entries(groupedIngredients).map(([group, ingredients]) => (
                  <div key={group} className="mt-4 first:mt-0">
                    {Object.keys(groupedIngredients).length > 1 ? (
                      <h3 className="label-caps text-[10px] text-bauhaus-blue">{group}</h3>
                    ) : null}
                    <ul className="mt-1 divide-y-2 divide-dotted divide-black">
                      {ingredients.map((ingredient) => {
                        const index = recipe.ingredients.indexOf(ingredient)
                        const isChecked = checked.has(index)
                        return (
                          <li key={`${group}-${ingredient.item}-${index}`}>
                            <label className="group flex min-h-12 cursor-pointer items-start gap-3 py-2.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleChecked(index)}
                                className="peer sr-only"
                              />
                              <span
                                className={`print-hide mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[6px] border-2 border-black transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bauhaus-blue ${
                                  isChecked ? 'bg-bauhaus-yellow' : 'bg-white group-hover:bg-mist'
                                }`}
                              >
                                {isChecked ? <CheckIcon size={13} /> : null}
                              </span>
                              <span
                                className={`text-sm leading-relaxed transition-colors print:text-black print:no-underline ${
                                  isChecked ? 'text-neutral-700 line-through' : ''
                                }`}
                              >
                                <strong className="font-bold">{ingredient.amount}</strong>{' '}
                                {ingredient.item}
                                {ingredient.note ? (
                                  <span className="text-neutral-700">, {ingredient.note}</span>
                                ) : null}
                                {ingredient.optional ? (
                                  <span className="ml-1 font-serif text-xs italic text-neutral-700">
                                    (optional)
                                  </span>
                                ) : null}
                              </span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="print-hide rounded-[20px] border-2 border-black bg-white p-5">
              <p className="label-caps">Filed under</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {recipe.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex min-h-11 items-center rounded-full border-2 border-black bg-mist px-3 text-xs font-bold hover:bg-bauhaus-yellow"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              <p className="mt-4 border-t-2 border-dotted border-black pt-3 text-xs leading-relaxed text-neutral-700">
                Add this recipe to Make soon, or mark it made to keep your own rating and notes.
                Everything stays on this device.
              </p>
            </div>
          </aside>

          <div className="space-y-5">
            <div className="print-card rounded-[20px] border-2 border-black bg-white p-5 sm:p-7">
              <div className="flex items-start justify-between gap-3 border-b-2 border-black pb-4">
                <div>
                  <p className="label-caps">The method</p>
                  <h2 className="mt-1 text-3xl leading-none sm:text-4xl">Let&apos;s cook</h2>
                </div>
                <span className="mt-1 hidden shrink-0 items-center gap-1.5 text-xs font-bold italic sm:flex">
                  <TimerIcon size={15} />
                  {formatMinutes(recipe.totalTime)}
                </span>
              </div>

              <ol className="print-steps mt-5 space-y-5">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="print-avoid-break flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-bauhaus-yellow font-serif text-lg font-black"
                    >
                      {index + 1}
                    </span>
                    <p className="pt-1 text-pretty text-sm leading-relaxed sm:text-base">
                      <span className="sr-only">Step {index + 1}: </span>
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {recipe.notes ? (
              <div className="print-card overflow-hidden rounded-[20px] border-2 border-black bg-white">
                <div className="flex items-center justify-between gap-3 border-b-2 border-black bg-bauhaus-yellow-light px-5 py-3">
                  <p className="label-caps flex items-center gap-2">
                    <span aria-hidden="true" className="print-hide size-2 rounded-full bg-bauhaus-red" />
                    Notes from the family
                  </p>
                  <PencilIcon size={16} className="print-hide" />
                </div>
                <p className="whitespace-pre-line p-5 text-sm leading-relaxed sm:text-base">{recipe.notes}</p>
              </div>
            ) : null}

            <div className="print-card rounded-[20px] border-2 border-black bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="label-caps">Where it came from</p>
                  <p className="mt-1 flex items-center gap-2 font-serif text-xl font-bold">
                    <BookIcon size={18} />
                    {recipe.source || 'The Windle family kitchen'}
                  </p>
                </div>
                <div className="print-hide flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-3 rounded-full bg-bauhaus-blue" />
                  <span className="size-3 rounded-full bg-bauhaus-red" />
                  <span className="size-3 rounded-full bg-bauhaus-yellow" />
                </div>
              </div>
            </div>

            <div className="print-hide flex flex-wrap gap-2">
              <Link to="/fridge" className="btn btn-white btn-sm">
                <ArrowLeftIcon size={16} />
                Match this to my fridge
              </Link>
              <Link to="/favorites" className="btn btn-white btn-sm">
                <HeartIcon size={16} />
                Saved &amp; made
              </Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="print-hide relative overflow-hidden border-t-2 border-black bg-bauhaus-yellow py-10 sm:py-14">
          <div
            aria-hidden="true"
            className="absolute -right-10 -top-10 size-40 rounded-full border-2 border-black bg-bauhaus-blue"
          />
          <div className="container-page relative">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label-caps flex items-center gap-2">
                  <span aria-hidden="true" className="size-2 rounded-full bg-bauhaus-red" />
                  Keep cooking
                </p>
                <h2 className="mt-2 text-4xl leading-none sm:text-5xl">You might also like</h2>
              </div>
              <Link
                to="/"
                className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-bold underline decoration-2 underline-offset-4 sm:self-auto"
              >
                Browse everything
                <ArrowRightIcon size={16} />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedRecipe) => (
                <RecipeCard key={relatedRecipe.id} recipe={relatedRecipe} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <MadeItDialog
        open={madeItOpen}
        recipe={recipe}
        existing={made}
        onSave={(entry) => saveMadeIt(recipe.id, entry)}
        onRemove={() => removeMadeIt(recipe.id)}
        onClose={() => setMadeItOpen(false)}
      />
    </>
  )
}
