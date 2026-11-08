import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatDate, pluralize } from '../lib/format'
import { getRecipe, getRecipesByIds } from '../lib/recipes'
import usePageMeta from '../components/usePageMeta'
import MadeItDialog from '../components/MadeItDialog'
import RecipeCard from '../components/RecipeCard'
import RecipeImage from '../components/RecipeImage'
import StarRating from '../components/StarRating'
import {
  ArrowRightIcon,
  ChefHatIcon,
  FridgeIcon,
  HeartIcon,
  PencilIcon,
  StarIcon,
  TrashIcon,
} from '../components/icons'

export default function FavoritesPage() {
  const { favorites, madeIt, saveMadeIt, removeMadeIt } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') === 'made' ? 'made' : 'saved'
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  usePageMeta(
    'Saved & Made',
    'Your saved Windle Family Recipes shortlist and personal made-it notes, stored only in your browser.',
  )

  const savedRecipes = useMemo(
    () => getRecipesByIds([...favorites].reverse()),
    [favorites],
  )

  const madeEntries = useMemo(
    () =>
      Object.entries(madeIt)
        .map(([id, entry]) => ({ recipe: getRecipe(id), entry }))
        .filter((item) => Boolean(item.recipe))
        .sort((a, b) => new Date(b.entry.madeOn) - new Date(a.entry.madeOn)),
    [madeIt],
  )

  function setActiveTab(tab) {
    setSearchParams(tab === 'made' ? { tab: 'made' } : {}, { replace: true })
  }

  function openEditor(recipe) {
    setEditingRecipe(recipe)
    setDialogOpen(true)
  }

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-black bg-bauhaus-yellow">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 hidden size-56 rounded-full border-2 border-black bg-bauhaus-blue sm:-right-16 sm:-top-16 sm:block sm:size-96"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/4 hidden size-32 rounded-t-full bg-bauhaus-red sm:block sm:size-44"
        />
        <div
          aria-hidden="true"
          className="pattern-dots absolute right-10 top-10 hidden size-20 text-black sm:block"
        />
        <div className="container-page relative py-10 sm:py-14">
          <p className="label-caps flex items-center gap-2">
            <HeartIcon size={15} />
            Your personal box
          </p>
          <h1 className="mt-3 text-[2.8rem] leading-[0.92] sm:text-6xl lg:text-7xl">
            Saved &amp; made.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base font-medium leading-relaxed sm:text-lg">
            The shortlist for next week and the notes from last time. No account, no sync —
            just this browser.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
            <span className="chip-static min-h-9">
              <HeartIcon size={13} />
              {pluralize(favorites.length, 'saved recipe')}
            </span>
            <span className="chip-static min-h-9">
              <ChefHatIcon size={13} />
              {pluralize(madeEntries.length, 'recipe')} made
            </span>
            <span className="chip-static min-h-9">Stored on this device</span>
          </div>
        </div>
      </section>

      <section className="bg-mist py-8 sm:py-12">
        <div className="container-page">
          <div className="flex flex-col gap-4 border-b-2 border-black pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label-caps">Two lists, one kitchen</p>
              <h2 className="mt-2 text-4xl leading-none sm:text-5xl">
                {activeTab === 'saved' ? 'Make this soon' : 'Made it'}
              </h2>
            </div>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Choose saved list"
            >
              <button
                type="button"
                className="chip"
                data-active={activeTab === 'saved'}
                aria-pressed={activeTab === 'saved'}
                onClick={() => setActiveTab('saved')}
              >
                <HeartIcon size={15} />
                Make soon
                <span className="rounded-full border-2 border-black bg-white px-1.5 py-0.5 text-[10px] leading-none">
                  {favorites.length}
                </span>
              </button>
              <button
                type="button"
                className="chip"
                data-active={activeTab === 'made'}
                aria-pressed={activeTab === 'made'}
                onClick={() => setActiveTab('made')}
              >
                <ChefHatIcon size={15} />
                Made it
                <span className="rounded-full border-2 border-black bg-white px-1.5 py-0.5 text-[10px] leading-none">
                  {madeEntries.length}
                </span>
              </button>
            </div>
          </div>

          {activeTab === 'saved' ? (
            savedRecipes.length > 0 ? (
              <>
                <p className="mt-4 text-sm text-neutral-700" aria-live="polite">
                  {pluralize(savedRecipes.length, 'recipe')} saved for later. Newest additions
                  first.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {savedRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-6 grid overflow-hidden rounded-[20px] border-2 border-black bg-white md:grid-cols-[1fr_1.35fr]">
                <div className="relative flex min-h-56 items-center justify-center overflow-hidden bg-bauhaus-yellow">
                  <span className="absolute -left-10 -top-10 size-44 rounded-full border-2 border-black bg-bauhaus-blue" />
                  <span className="absolute -bottom-10 -right-8 size-36 rounded-full border-2 border-black bg-bauhaus-red" />
                  <span className="relative flex size-24 items-center justify-center rounded-full border-2 border-black bg-white">
                    <HeartIcon size={40} />
                  </span>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <p className="label-caps">Nothing on the shortlist</p>
                  <h3 className="mt-2 text-3xl leading-none">Save something for later.</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-700">
                    Tap the heart on any recipe to keep it here. Make-soon recipes are stored in
                    your browser and survive a refresh.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link to="/" className="btn btn-primary btn-sm">
                      Browse recipes
                      <ArrowRightIcon size={16} />
                    </Link>
                    <Link to="/fridge" className="btn btn-white btn-sm">
                      <FridgeIcon size={16} />
                      Match my fridge
                    </Link>
                  </div>
                </div>
              </div>
            )
          ) : madeEntries.length > 0 ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-neutral-700">
                {pluralize(madeEntries.length, 'recipe')} in your cooking log. Ratings and notes
                are private to this browser.
              </p>
              <ul className="space-y-4">
                {madeEntries.map(({ recipe, entry }) => (
                  <li
                    key={recipe.id}
                    className="overflow-hidden rounded-[20px] border-2 border-black bg-white"
                  >
                    <div className="grid sm:grid-cols-[11rem_1fr]">
                      <Link
                        to={`/recipe/${recipe.id}`}
                        className="relative block aspect-[16/9] overflow-hidden border-b-2 border-black bg-bauhaus-yellow sm:aspect-auto sm:min-h-48 sm:border-b-0 sm:border-r-2"
                        aria-label={`Open ${recipe.title}`}
                      >
                        <RecipeImage recipe={recipe} imgClassName="h-full" />
                      </Link>
                      <div className="p-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="label-caps text-[10px] text-bauhaus-blue">
                              Made {formatDate(entry.madeOn)}
                            </p>
                            <h3 className="mt-1 text-2xl leading-none sm:text-3xl">
                              <Link
                                to={`/recipe/${recipe.id}`}
                                className="hover:text-bauhaus-blue"
                              >
                                {recipe.title}
                              </Link>
                            </h3>
                          </div>
                          <div className="text-right">
                            <StarRating value={entry.rating} size={17} />
                            <p className="mt-1 text-xs font-semibold italic text-neutral-700">
                              {entry.rating ? `${entry.rating} / 5` : 'Not rated'}
                            </p>
                          </div>
                        </div>

                        {entry.notes ? (
                          <blockquote className="mt-3 rounded-[12px] border-2 border-dashed border-black bg-mist px-3 py-2 text-sm italic leading-relaxed">
                            “{entry.notes}”
                          </blockquote>
                        ) : (
                          <p className="mt-3 rounded-[12px] border-2 border-dashed border-black px-3 py-2 text-sm italic text-neutral-700">
                            No notes yet. Add what you&apos;d change next time.
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditor(recipe)}
                            className="btn btn-white btn-sm"
                          >
                            <PencilIcon size={15} />
                            Edit rating &amp; notes
                          </button>
                          <Link to={`/recipe/${recipe.id}`} className="btn btn-primary btn-sm">
                            Open recipe
                            <ArrowRightIcon size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeMadeIt(recipe.id)}
                            className="btn btn-white btn-sm border-bauhaus-red"
                            aria-label={`Remove ${recipe.title} from Made it`}
                          >
                            <TrashIcon size={15} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-6 grid overflow-hidden rounded-[20px] border-2 border-black bg-white md:grid-cols-[1fr_1.35fr]">
              <div className="relative flex min-h-56 items-center justify-center overflow-hidden bg-bauhaus-yellow">
                <span className="absolute -left-10 -top-10 size-44 rounded-full border-2 border-black bg-bauhaus-blue" />
                <span className="absolute -bottom-10 -right-8 size-36 rounded-full border-2 border-black bg-bauhaus-red" />
                <span className="relative flex size-24 items-center justify-center rounded-full border-2 border-black bg-white">
                  <StarIcon size={40} className="text-bauhaus-red" />
                </span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="label-caps">The cooking log</p>
                <h3 className="mt-2 text-3xl leading-none">Cook it, then tell on it.</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-700">
                  Open any recipe and press <strong>I made this</strong> to save a star rating and
                  personal notes. It all stays right here in your browser.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link to="/" className="btn btn-primary btn-sm">
                    Find something to cook
                    <ArrowRightIcon size={16} />
                  </Link>
                  <button
                    type="button"
                    className="btn btn-white btn-sm"
                    onClick={() => setActiveTab('saved')}
                  >
                    <HeartIcon size={16} />
                    See saved recipes
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-neutral-700">
            Local storage is per browser and per device. Clearing site data will clear these
            lists. Pantry staples live on the{' '}
            <Link to="/fridge" className="font-bold underline decoration-2 underline-offset-4">
              fridge matcher
            </Link>{' '}
            page.
          </p>
        </div>
      </section>

      <MadeItDialog
        open={dialogOpen}
        recipe={editingRecipe}
        existing={editingRecipe ? madeIt[editingRecipe.id] : undefined}
        onSave={(entry) => {
          if (editingRecipe) saveMadeIt(editingRecipe.id, entry)
        }}
        onRemove={() => {
          if (editingRecipe) removeMadeIt(editingRecipe.id)
        }}
        onClose={() => setDialogOpen(false)}
      />
    </>
  )
}
