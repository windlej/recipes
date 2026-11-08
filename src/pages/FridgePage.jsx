import { useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SUGGESTED_STAPLES, QUICK_ADD_GROUPS } from '../lib/ingredients'
import {
  addManyIngredients,
  buildAvailableItems,
  normalizeIngredient,
  rankFridgeMatches,
  removeIngredient,
} from '../lib/matching'
import { formatMinutes, pluralize } from '../lib/format'
import { recipes } from '../lib/recipes'
import usePageMeta from '../components/usePageMeta'
import RecipeImage from '../components/RecipeImage'
import {
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
  FridgeIcon,
  HeartIcon,
  PlusIcon,
  SearchIcon,
  SparkleIcon,
  TrashIcon,
} from '../components/icons'

const ALL_INGREDIENT_NAMES = [
  ...new Set(recipes.flatMap((recipe) => recipe.ingredients.map((ingredient) => ingredient.item))),
].sort((a, b) => a.localeCompare(b))

function splitIngredientInput(value) {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function FridgePage() {
  const { pantry, addPantryItems, removePantryItem, clearPantry, favorites, isFavorite, toggleFavorite } =
    useApp()
  const [fridgeItems, setFridgeItems] = useState([])
  const [input, setInput] = useState('')
  const [pantryInput, setPantryInput] = useState('')
  const [activeGroup, setActiveGroup] = useState(QUICK_ADD_GROUPS[0].id)
  const [includePantry, setIncludePantry] = useState(true)
  const [onlyClose, setOnlyClose] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const resultsRef = useRef(null)
  const inputRef = useRef(null)
  const datalistId = useId()

  usePageMeta(
    "What's in My Fridge",
    'Enter what you have and find the Windle family recipes you are closest to making, including exactly which ingredients are missing.',
  )

  const activeGroupItems =
    QUICK_ADD_GROUPS.find((group) => group.id === activeGroup)?.items ?? QUICK_ADD_GROUPS[0].items

  const allResults = useMemo(
    () =>
      rankFridgeMatches(recipes, {
        fridgeItems,
        pantryItems: pantry,
        includePantry,
      }),
    [fridgeItems, pantry, includePantry],
  )

  const results = useMemo(
    () =>
      rankFridgeMatches(recipes, {
        fridgeItems,
        pantryItems: pantry,
        includePantry,
        maxMissing: onlyClose ? 3 : null,
      }),
    [fridgeItems, pantry, includePantry, onlyClose],
  )

  const availableItems = useMemo(
    () => buildAvailableItems(fridgeItems, pantry, includePantry),
    [fridgeItems, pantry, includePantry],
  )

  const pantryStaplesToAdd = SUGGESTED_STAPLES.filter(
    (staple) =>
      !pantry.some((item) => normalizeIngredient(item) === normalizeIngredient(staple)),
  )

  function addItems() {
    const values = splitIngredientInput(input)
    if (!values.length) return
    setFridgeItems((current) => addManyIngredients(current, values))
    setInput('')
    inputRef.current?.focus()
  }

  function handleAddSubmit(event) {
    event.preventDefault()
    addItems()
  }

  function toggleQuickItem(item) {
    const exists = fridgeItems.some(
      (current) => normalizeIngredient(current) === normalizeIngredient(item),
    )
    setFridgeItems((current) =>
      exists
        ? removeIngredient(current, item)
        : addManyIngredients(current, [item]),
    )
  }

  function handlePantrySubmit(event) {
    event.preventDefault()
    const values = splitIngredientInput(pantryInput)
    if (!values.length) return
    addPantryItems(values)
    setPantryInput('')
  }

  function findRecipes(event) {
    event?.preventDefault()
    if (!fridgeItems.length) return
    setHasSearched(true)
    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function removeFridgeItem(item) {
    setFridgeItems((current) => removeIngredient(current, item))
  }

  const closeMatchCount = allResults.filter((result) => result.missingCount <= 3).length
  const readyToMakeCount = allResults.filter((result) => result.missingCount === 0).length

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-black bg-bauhaus-yellow">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 size-56 rounded-full border-2 border-black bg-bauhaus-blue sm:-right-16 sm:-top-20 sm:size-96"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-1/4 hidden size-28 rounded-t-full bg-bauhaus-red sm:block sm:size-40"
        />
        <div
          aria-hidden="true"
          className="pattern-dots absolute left-6 top-10 hidden size-20 text-black sm:block"
        />
        <div className="container-page relative py-10 sm:py-14">
          <p className="label-caps flex items-center gap-2">
            <FridgeIcon size={15} />
            The fridge matcher
          </p>
          <h1 className="mt-3 max-w-3xl text-balance text-[2.8rem] leading-[0.92] sm:text-6xl lg:text-7xl">
            What&apos;s in my fridge?
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base font-medium leading-relaxed sm:text-lg">
            Type what you have, tap the usual suspects, and we&apos;ll rank the recipes
            you&apos;re closest to making. Missing ingredients are always shown — no guessing.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold">
            <span className="chip-static min-h-9">
              <SparkleIcon size={13} />
              {recipes.length} recipes indexed
            </span>
            <span className="chip-static min-h-9">
              <CheckIcon size={13} />
              {pluralize(pantry.length, 'pantry staple')} saved
            </span>
            <span className="chip-static min-h-9">Stays on this device</span>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-black bg-mist py-8 sm:py-12">
        <div className="container-page grid items-start gap-4 lg:grid-cols-[1.5fr_1fr]">
          {/* INGREDIENT INPUT */}
          <div className="rounded-[20px] border-2 border-black bg-white p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="label-caps">Step one</p>
                <h2 className="mt-1 text-2xl leading-none sm:text-3xl">Add what you have</h2>
              </div>
              {fridgeItems.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setFridgeItems([])
                    setHasSearched(false)
                  }}
                  className="inline-flex min-h-11 items-center gap-1 text-xs font-bold underline decoration-2 underline-offset-4"
                >
                  <TrashIcon size={14} />
                  Clear
                </button>
              ) : null}
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4">
              <label htmlFor="fridge-input" className="label-caps">
                Ingredients
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <PlusIcon
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black"
                  />
                  <input
                    ref={inputRef}
                    id="fridge-input"
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="chicken, rice, lemons…"
                    className="field field-pill pl-11"
                    autoComplete="off"
                    list={datalistId}
                    enterKeyHint="done"
                  />
                  <datalist id={datalistId}>
                    {ALL_INGREDIENT_NAMES.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary shrink-0 sm:min-h-12"
                  disabled={!splitIngredientInput(input).length}
                >
                  Add
                </button>
              </div>
              <p className="mt-2 text-xs text-neutral-700">
                Separate several ingredients with commas. Add as many as you like, then find your matches.
              </p>
            </form>

            {fridgeItems.length > 0 ? (
              <div className="mt-4">
                <p className="label-caps">In your kitchen ({fridgeItems.length})</p>
                <ul className="mt-2 flex flex-wrap gap-2" aria-label="Ingredients you have">
                  {fridgeItems.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => removeFridgeItem(item)}
                        className="chip min-h-11 gap-1.5 bg-bauhaus-yellow capitalize"
                        aria-label={`Remove ${item}`}
                      >
                        {item}
                        <CloseIcon size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 rounded-[14px] border-2 border-dashed border-black bg-mist px-4 py-3 text-sm text-neutral-700">
                Your kitchen list is empty. Add something above, or use the quick picks below.
              </p>
            )}

            <div className="mt-6 border-t-2 border-dotted border-black pt-4">
              <p className="label-caps">Quick add</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_ADD_GROUPS.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveGroup(group.id)}
                    aria-pressed={activeGroup === group.id}
                    data-active={activeGroup === group.id}
                    className="chip min-h-11 px-3 text-xs"
                  >
                    {group.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {activeGroupItems.map((item) => {
                  const selected = fridgeItems.some(
                    (current) => normalizeIngredient(current) === normalizeIngredient(item),
                  )
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleQuickItem(item)}
                      aria-pressed={selected}
                      className="chip min-h-11 capitalize"
                      data-active={selected}
                    >
                      {selected ? <CheckIcon size={14} /> : <PlusIcon size={14} />}
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t-2 border-black pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-700">
                {fridgeItems.length > 0 ? (
                  <>
                    <strong className="font-bold">{fridgeItems.length}</strong> in the kitchen
                    {includePantry && pantry.length > 0 ? (
                      <>
                        {' '}
                        + <strong className="font-bold">{pantry.length}</strong> pantry staples
                      </>
                    ) : null}
                  </>
                ) : (
                  'Add at least one ingredient to find matches.'
                )}
              </p>
              <button
                type="button"
                onClick={findRecipes}
                disabled={!fridgeItems.length}
                className="btn btn-primary w-full sm:w-auto"
              >
                Find my recipes
                <ArrowRightIcon size={18} />
              </button>
            </div>
          </div>

          {/* PANTRY */}
          <div className="rounded-[20px] border-2 border-black bg-white p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-black bg-bauhaus-blue text-white">
                <FridgeIcon size={21} />
              </span>
              <div>
                <p className="label-caps">Step two, once</p>
                <h2 className="mt-1 text-2xl leading-none">Your pantry staples</h2>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              Save the things you always have — salt, oil, flour — and they&apos;ll count
              automatically. Stored only in this browser.
            </p>

            {pantry.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Saved pantry staples">
                {pantry.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => removePantryItem(item)}
                      className="chip min-h-11 gap-1.5 px-3 text-xs capitalize"
                      aria-label={`Remove ${item} from pantry staples`}
                    >
                      {item}
                      <CloseIcon size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-[14px] border-2 border-dashed border-black bg-mist px-4 py-3 text-sm text-neutral-700">
                No staples saved yet.
              </p>
            )}

            <form onSubmit={handlePantrySubmit} className="mt-4">
              <label htmlFor="pantry-input" className="sr-only">
                Add a pantry staple
              </label>
              <div className="flex gap-2">
                <input
                  id="pantry-input"
                  type="text"
                  value={pantryInput}
                  onChange={(event) => setPantryInput(event.target.value)}
                  placeholder="Add a staple…"
                  className="field field-pill min-w-0 flex-1"
                />
                <button
                  type="submit"
                  aria-label="Add pantry staple"
                  className="btn-icon shrink-0"
                  disabled={!splitIngredientInput(pantryInput).length}
                >
                  <PlusIcon size={18} />
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addPantryItems(SUGGESTED_STAPLES)}
                className="btn btn-white btn-sm"
                disabled={pantryStaplesToAdd.length === 0}
              >
                <SparkleIcon size={15} />
                Add the basics
              </button>
              {pantry.length > 0 ? (
                <button type="button" onClick={clearPantry} className="btn btn-white btn-sm">
                  <TrashIcon size={15} />
                  Clear
                </button>
              ) : null}
            </div>

            <div className="mt-5 border-t-2 border-dotted border-black pt-4">
              <label
                htmlFor="include-pantry"
                className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-bold"
              >
                <input
                  id="include-pantry"
                  type="checkbox"
                  checked={includePantry}
                  onChange={(event) => setIncludePantry(event.target.checked)}
                  className="size-5 shrink-0 accent-[#1D4ED8]"
                />
                Count pantry staples in my matches
              </label>
              <p className="mt-1 text-xs text-neutral-700">
                Turn this off to see matches based on fresh ingredients only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section
        ref={resultsRef}
        className="scroll-mt-header relative overflow-hidden bg-mist py-8 sm:py-12"
        aria-labelledby="fridge-results-title"
      >
        <div className="container-page relative">
          <div className="flex flex-col gap-4 border-b-2 border-black pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label-caps flex items-center gap-2">
                <span aria-hidden="true" className="size-2 rounded-full bg-bauhaus-blue" />
                The shortlist
              </p>
              <h2 id="fridge-results-title" className="mt-2 text-4xl leading-none sm:text-5xl">
                Best matches
              </h2>
              <p className="mt-2 max-w-xl text-sm text-neutral-700">
                Ranked by how many ingredients you already have. Pantry staples are included
                when the toggle is on.
              </p>
            </div>
            {hasSearched && fridgeItems.length > 0 ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end">
                <p className="text-sm font-bold" aria-live="polite">
                  {results.length} {results.length === 1 ? 'recipe' : 'recipes'}
                  {onlyClose ? ' within 3 missing' : ' ranked'}
                </p>
                <label
                  htmlFor="only-close"
                  className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-bold"
                >
                  <input
                    id="only-close"
                    type="checkbox"
                    checked={onlyClose}
                    onChange={(event) => setOnlyClose(event.target.checked)}
                    className="size-5 accent-[#1D4ED8]"
                  />
                  Only 3 or fewer missing
                </label>
              </div>
            ) : null}
          </div>

          {!hasSearched ? (
            <div className="mt-6 grid overflow-hidden rounded-[20px] border-2 border-black bg-white md:grid-cols-[1fr_1.25fr]">
              <div className="relative flex min-h-56 items-center justify-center overflow-hidden bg-bauhaus-yellow p-8">
                <span className="absolute -left-12 -top-12 size-48 rounded-full border-2 border-black bg-bauhaus-blue" />
                <span className="absolute -bottom-10 -right-8 size-36 rounded-full border-2 border-black bg-bauhaus-red" />
                <span className="pattern-dots absolute right-8 top-8 size-20 text-black" />
                <span className="relative flex size-24 items-center justify-center rounded-full border-2 border-black bg-white">
                  <FridgeIcon size={40} />
                </span>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="label-caps">Waiting on you</p>
                <h3 className="mt-2 text-3xl leading-none">Your fridge, but useful.</h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-700">
                  Add a few ingredients and press <strong>Find my recipes</strong>. We&apos;ll show
                  the recipes with the most overlap, the missing items, and how close each one is
                  to dinner.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="chip-static">Already have {availableItems.length} items</span>
                  <span className="chip-static">{pluralize(readyToMakeCount, 'recipe')} ready now</span>
                </div>
              </div>
            </div>
          ) : fridgeItems.length === 0 ? (
            <div className="mt-6 rounded-[20px] border-2 border-black bg-white p-8 text-center">
              <h3 className="text-2xl">Add an ingredient to get started.</h3>
              <p className="mt-2 text-sm text-neutral-700">
                Your kitchen list is empty. Add something above and the shortlist will fill in.
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.focus()}
                className="btn btn-primary btn-sm mt-4"
              >
                <PlusIcon size={16} />
                Add an ingredient
              </button>
            </div>
          ) : results.length > 0 ? (
            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
                <span className="chip-static min-h-9 bg-bauhaus-yellow">
                  {pluralize(availableItems.length, 'ingredient')} available
                </span>
                <span className="chip-static min-h-9">
                  {pluralize(readyToMakeCount, 'recipe')} ready right now
                </span>
                <span className="chip-static min-h-9">
                  {pluralize(closeMatchCount, 'recipe')} within 3 missing
                </span>
              </div>

              <ul className="space-y-4">
                {results.map((result) => {
                  const { recipe, have, missing, total, coverage } = result
                  const favorite = isFavorite(recipe.id)
                  return (
                    <li
                      key={recipe.id}
                      className="overflow-hidden rounded-[20px] border-2 border-black bg-white"
                    >
                      <div className="grid md:grid-cols-[15rem_1fr]">
                        <Link
                          to={`/recipe/${recipe.id}`}
                          className="relative block aspect-[16/10] overflow-hidden border-b-2 border-black bg-bauhaus-yellow md:aspect-auto md:min-h-56 md:border-b-0 md:border-r-2"
                          aria-label={`Open ${recipe.title}`}
                        >
                          <RecipeImage recipe={recipe} imgClassName="h-full" />
                          <span className="absolute left-3 top-3 inline-flex min-h-9 items-center rounded-full border-2 border-black bg-white px-3 text-xs font-bold">
                            {have.length} of {total}
                          </span>
                        </Link>

                        <div className="flex flex-col p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="label-caps text-[10px] text-bauhaus-blue">
                                {missing.length === 0
                                  ? 'Everything you need'
                                  : `${missing.length} missing`}
                              </p>
                              <h3 className="mt-1 text-2xl leading-[1.03] sm:text-3xl">
                                <Link
                                  to={`/recipe/${recipe.id}`}
                                  className="hover:text-bauhaus-blue"
                                >
                                  {recipe.title}
                                </Link>
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleFavorite(recipe.id)}
                              aria-pressed={favorite}
                              aria-label={
                                favorite
                                  ? `Remove ${recipe.title} from Make soon`
                                  : `Save ${recipe.title} to Make soon`
                              }
                              className="btn-icon shrink-0"
                            >
                              <HeartIcon
                                size={18}
                                filled={favorite}
                                className={favorite ? 'text-bauhaus-red' : ''}
                              />
                            </button>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between gap-3 text-xs font-bold">
                              <span>
                                You have {have.length} of {total} ingredients
                              </span>
                              <span className="italic">{Math.round(coverage * 100)}%</span>
                            </div>
                            <div
                              className="mt-1.5 h-3 overflow-hidden rounded-full border-2 border-black bg-white"
                              role="progressbar"
                              aria-valuemin={0}
                              aria-valuemax={total}
                              aria-valuenow={have.length}
                              aria-label={`${recipe.title} match`}
                            >
                              <div
                                className="h-full bg-bauhaus-blue"
                                style={{ width: `${Math.max(3, coverage * 100)}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-neutral-700">
                            <span>{formatMinutes(recipe.totalTime)}</span>
                            <span aria-hidden="true">·</span>
                            <span className="italic">{recipe.difficulty}</span>
                            <span aria-hidden="true">·</span>
                            <span>Feeds {recipe.servings}</span>
                          </div>

                          <div className="mt-3 border-t-2 border-dotted border-black pt-3">
                            {missing.length === 0 ? (
                              <p className="inline-flex items-center gap-2 text-sm font-bold">
                                <span className="flex size-6 items-center justify-center rounded-full border-2 border-black bg-bauhaus-yellow">
                                  <CheckIcon size={14} />
                                </span>
                                You can make this right now.
                              </p>
                            ) : (
                              <>
                                <p className="text-xs font-bold uppercase tracking-[0.12em]">
                                  Still missing
                                </p>
                                <ul className="mt-2 flex flex-wrap gap-1.5">
                                  {missing.slice(0, 8).map((ingredient) => (
                                    <li
                                      key={`${ingredient.group}-${ingredient.item}`}
                                      className="inline-flex min-h-8 items-center gap-1.5 rounded-full border-2 border-bauhaus-red bg-white px-2.5 text-xs font-semibold"
                                    >
                                      <span aria-hidden="true" className="size-1.5 rounded-full bg-bauhaus-red" />
                                      {ingredient.item}
                                    </li>
                                  ))}
                                  {missing.length > 8 ? (
                                    <li className="inline-flex min-h-8 items-center px-1.5 text-xs font-bold italic">
                                      +{missing.length - 8} more
                                    </li>
                                  ) : null}
                                </ul>
                              </>
                            )}
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Link
                              to={`/recipe/${recipe.id}`}
                              className="btn btn-primary btn-sm"
                            >
                              Open recipe
                              <ArrowRightIcon size={16} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-[20px] border-2 border-black bg-white">
              <div className="grid md:grid-cols-[1fr_1.35fr]">
                <div className="relative flex min-h-52 items-center justify-center overflow-hidden bg-bauhaus-yellow">
                  <span className="absolute -left-8 -top-8 size-36 rounded-full border-2 border-black bg-bauhaus-blue" />
                  <span className="absolute -bottom-8 -right-8 size-28 rounded-full border-2 border-black bg-bauhaus-red" />
                  <span className="relative flex size-20 items-center justify-center rounded-full border-2 border-black bg-white">
                    <SearchIcon size={32} />
                  </span>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="label-caps">
                    {onlyClose ? 'Nothing that close' : 'No matches yet'}
                  </p>
                  <h3 className="mt-2 text-3xl leading-none">
                    {onlyClose ? 'Three ingredients away is a tall order.' : 'Not enough overlap yet.'}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-700">
                    {onlyClose
                      ? 'We found some recipes, but none are within three missing ingredients with your current list.'
                      : 'Add a few more ingredients or check that your spelling is close to the ingredient name. The matcher understands plurals and simple aliases.'}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {onlyClose ? (
                      <button
                        type="button"
                        onClick={() => setOnlyClose(false)}
                        className="btn btn-primary btn-sm"
                      >
                        Show all matches
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => inputRef.current?.focus()}
                        className="btn btn-primary btn-sm"
                      >
                        <PlusIcon size={16} />
                        Add more ingredients
                      </button>
                    )}
                    {fridgeItems.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setFridgeItems([])
                          setHasSearched(false)
                        }}
                        className="btn btn-white btn-sm"
                      >
                        Start over
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-neutral-700">
            Fridge lists are not saved between visits. Only favorites, made-it notes, and pantry
            staples live in your browser&apos;s local storage.
            {favorites.length > 0 ? (
              <>
                {' '}
                You have {pluralize(favorites.length, 'recipe')} in{' '}
                <Link to="/favorites" className="font-bold underline decoration-2 underline-offset-4">
                  Make soon
                </Link>
                .
              </>
            ) : null}
          </p>
        </div>
      </section>
    </>
  )
}
