import { useDeferredValue, useMemo, useState } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import {
  categories,
  difficulties,
  filterRecipes,
  getFeaturedRecipe,
  recipes,
  sortRecipes,
  tags as allTagCounts,
} from '../lib/recipes'
import { formatMinutes } from '../lib/format'
import usePageMeta from '../components/usePageMeta'
import RecipeCard from '../components/RecipeCard'
import RecipeImage from '../components/RecipeImage'
import {
  ArrowRightIcon,
  ChefHatIcon,
  CloseIcon,
  DiceIcon,
  FridgeIcon,
  HeartIcon,
  SearchIcon,
  SlidersIcon,
  SparkleIcon,
} from '../components/icons'

const TIME_FILTERS = [
  { value: 0, label: 'Any time' },
  { value: 30, label: '30 min or less' },
  { value: 45, label: '45 min or less' },
  { value: 60, label: '1 hour or less' },
]

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'quickest', label: 'Quickest first' },
  { value: 'slowest', label: 'Longest first' },
  { value: 'az', label: 'A to Z' },
  { value: 'za', label: 'Z to A' },
]

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export default function HomePage() {
  const { openPicker } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const featured = getFeaturedRecipe()

  const initialTime = Number(searchParams.get('time'))
  const initialDifficulty = searchParams.get('difficulty')

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [selectedCategories, setSelectedCategories] = useState(() =>
    searchParams.getAll('category').filter((category) => categories.includes(category)),
  )
  const [selectedTags, setSelectedTags] = useState(() => searchParams.getAll('tag'))
  const [maxTime, setMaxTime] = useState([30, 45, 60].includes(initialTime) ? initialTime : 0)
  const [difficulty, setDifficulty] = useState(
    difficulties.includes(initialDifficulty) ? initialDifficulty : 'All',
  )
  const [sort, setSort] = useState('recommended')
  const [showAllTags, setShowAllTags] = useState(selectedTags.length > 0)

  const deferredQuery = useDeferredValue(query)

  usePageMeta(
    null,
    'Windle Family Recipes — a hand-picked family cookbook with a fridge matcher, favorites, and a surprise-me picker.',
  )

  const filtered = useMemo(
    () =>
      filterRecipes(recipes, {
        query: deferredQuery,
        selectedCategories,
        selectedTags,
        maxTime,
        difficulty,
      }),
    [deferredQuery, selectedCategories, selectedTags, maxTime, difficulty],
  )

  const sorted = useMemo(() => sortRecipes(filtered, sort), [filtered, sort])

  const activeFilterCount =
    selectedCategories.length + selectedTags.length + (maxTime ? 1 : 0) + (difficulty !== 'All' ? 1 : 0)

  const hasFilters = activeFilterCount > 0 || query.trim().length > 0
  const visibleTags = showAllTags ? allTagCounts : allTagCounts.slice(0, 12)

  function clearAll() {
    setQuery('')
    setSelectedCategories([])
    setSelectedTags([])
    setMaxTime(0)
    setDifficulty('All')
    setSort('recommended')
    setSearchParams({}, { replace: true })
  }

  function scrollToLibrary() {
    document.getElementById('recipe-library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSearchSubmit(event) {
    event.preventDefault()
    scrollToLibrary()
  }

  function surpriseMe() {
    openPicker({
      categories: selectedCategories,
      maxTime,
      difficulty,
    })
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-black bg-bauhaus-yellow">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-40 size-56 rounded-full border-2 border-black bg-bauhaus-blue sm:-top-28 sm:size-80 lg:size-[28rem]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-10 top-40 hidden size-40 rounded-l-full bg-bauhaus-red sm:block sm:size-56"
        />
        <div
          aria-hidden="true"
          className="pattern-dots absolute bottom-12 left-[46%] hidden size-32 text-black lg:block"
        />

        <div className="container-page relative grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-20">
          <div className="relative z-10 max-w-3xl">
            <p className="label-caps flex items-center gap-2">
              <span aria-hidden="true" className="size-2 rounded-full bg-bauhaus-blue" />
              The Windle family cookbook
            </p>

            <h1 className="mt-4 text-balance text-[2.9rem] leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-[5.2rem]">
              The recipes we{' '}
              <span className="italic">keep coming back to.</span>
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-base font-medium leading-relaxed sm:text-lg">
              Dinner winners, weekend baking, and the reliable things we make on repeat. Pick
              something, cook it, and tell the recipe what you really thought.
            </p>

            <form onSubmit={handleSearchSubmit} className="relative mt-7 max-w-xl">
              <label htmlFor="hero-search" className="sr-only">
                Search recipes by title, ingredient, tag, or category
              </label>
              <SearchIcon
                size={22}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2"
              />
              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search chicken, soup, chocolate…"
                className="field field-pill h-16 border-[3px] pl-14 pr-16 text-base sm:text-lg"
                autoComplete="off"
              />
              <button
                type="submit"
                aria-label="Search recipes"
                className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-black bg-black text-white transition-colors hover:bg-bauhaus-blue"
              >
                <ArrowRightIcon size={20} />
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" onClick={surpriseMe} className="btn btn-red">
                <DiceIcon size={20} />
                Surprise me
              </button>
              <Link to="/fridge" className="btn btn-white">
                <FridgeIcon size={19} />
                What&apos;s in my fridge?
              </Link>
            </div>

            <dl className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-t-2 border-black pt-4 text-sm">
              <div>
                <dt className="label-caps text-[10px]">In the box</dt>
                <dd className="mt-1 font-serif text-2xl font-black leading-none">{recipes.length} recipes</dd>
              </div>
              <div>
                <dt className="label-caps text-[10px]">All occasions</dt>
                <dd className="mt-1 font-serif text-2xl font-black leading-none">{categories.length} categories</dd>
              </div>
              <div>
                <dt className="label-caps text-[10px]">No accounts</dt>
                <dd className="mt-1 font-serif text-2xl font-black leading-none">Just dinner</dd>
              </div>
            </dl>
          </div>

          {/* Featured recipe poster */}
          <div className="relative z-10 mx-auto w-full max-w-sm lg:max-w-md">
            <div
              aria-hidden="true"
              className="absolute -left-8 -top-8 size-28 rounded-full border-2 border-black bg-white"
            />
            <div
              aria-hidden="true"
              className="pattern-stripes absolute -bottom-6 -right-6 size-28 rounded-[18px] border-2 border-black bg-bauhaus-yellow-light text-black"
            />
            <div className="relative -rotate-1 overflow-hidden rounded-[20px] border-2 border-black bg-white">
              <div className="flex items-center justify-between border-b-2 border-black bg-bauhaus-yellow-light px-4 py-2.5">
                <span className="label-caps">Recipe no. 01</span>
                <SparkleIcon size={16} />
              </div>
              <div className="aspect-[4/3] overflow-hidden border-b-2 border-black bg-bauhaus-yellow">
                <RecipeImage recipe={featured} eager imgClassName="object-cover" />
              </div>
              <div className="p-4 sm:p-5">
                <p className="label-caps text-[10px] text-bauhaus-blue">Featured this week</p>
                <h2 className="mt-2 text-2xl leading-[1.03] sm:text-3xl">{featured.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-700">
                  {featured.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t-2 border-black pt-3">
                  <span className="text-xs font-bold italic">
                    {formatMinutes(featured.totalTime)} · {featured.difficulty}
                  </span>
                  <Link
                    to={`/recipe/${featured.id}`}
                    aria-label={`Open ${featured.title}`}
                    className="flex size-11 items-center justify-center rounded-full border-2 border-black bg-bauhaus-yellow transition-colors hover:bg-bauhaus-yellow-light"
                  >
                    <ArrowRightIcon size={20} />
                  </Link>
                </div>
              </div>
            </div>
            <span className="absolute -right-3 top-24 z-20 inline-flex min-h-10 rotate-3 items-center rounded-full border-2 border-black bg-bauhaus-red px-4 text-xs font-bold">
              Family tested
            </span>
          </div>
        </div>
      </section>

      {/* THREE WAYS IN */}
      <section aria-label="Ways to find a recipe" className="border-b-2 border-black bg-mist">
        <div className="container-page grid gap-3 py-6 md:grid-cols-3">
          <Link
            to="/fridge"
            className="group flex items-center gap-4 rounded-[18px] border-2 border-black bg-white p-4 transition-colors hover:bg-bauhaus-yellow"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-black bg-bauhaus-blue text-white">
              <FridgeIcon size={23} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-xl font-bold leading-none">Cook what you have</span>
              <span className="mt-1 block text-sm text-neutral-700">Tell the fridge what&apos;s inside.</span>
            </span>
            <ArrowRightIcon size={19} className="shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            type="button"
            onClick={surpriseMe}
            className="group flex items-center gap-4 rounded-[18px] border-2 border-black bg-white p-4 text-left transition-colors hover:bg-bauhaus-yellow"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-black bg-bauhaus-red">
              <DiceIcon size={23} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-xl font-bold leading-none">Let fate decide</span>
              <span className="mt-1 block text-sm text-neutral-700">Roll for tonight&apos;s dinner.</span>
            </span>
            <ArrowRightIcon size={19} className="shrink-0 transition-transform group-hover:translate-x-1" />
          </button>

          <Link
            to="/favorites"
            className="group flex items-center gap-4 rounded-[18px] border-2 border-black bg-white p-4 transition-colors hover:bg-bauhaus-yellow"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-black bg-bauhaus-yellow">
              <HeartIcon size={23} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-xl font-bold leading-none">Your saved shortlist</span>
              <span className="mt-1 block text-sm text-neutral-700">Make soon, plus what you&apos;ve made.</span>
            </span>
            <ArrowRightIcon size={19} className="shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* LIBRARY */}
      <section
        id="recipe-library"
        className="scroll-mt-header relative overflow-hidden border-b-2 border-black bg-mist py-10 sm:py-14"
      >
        <div
          aria-hidden="true"
          className="absolute -right-16 top-24 size-40 rounded-full border-2 border-black bg-bauhaus-blue sm:size-56"
        />
        <div
          aria-hidden="true"
          className="absolute -left-10 bottom-24 size-24 rounded-full border-2 border-black bg-bauhaus-red"
        />
        <div className="container-page relative">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label-caps flex items-center gap-2">
                <span aria-hidden="true" className="size-2 rounded-full bg-bauhaus-red" />
                Browse the collection
              </p>
              <h2 className="mt-2 text-4xl leading-none sm:text-5xl">The recipe box</h2>
            </div>
            <p className="max-w-sm text-sm font-medium text-neutral-700 sm:text-right">
              Everything is family-tested. Filter by mood, time, or whatever is already in the
              kitchen.
            </p>
          </div>

          <div className="mt-6 rounded-[20px] border-2 border-black bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <label htmlFor="library-search" className="sr-only">
                  Search recipes
                </label>
                <SearchIcon
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                />
                <input
                  id="library-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search title, ingredient, tag, or category"
                  className="field field-pill pl-11 pr-12"
                  autoComplete="off"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full hover:bg-mist"
                  >
                    <CloseIcon size={17} />
                  </button>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="sort-recipes" className="label-caps shrink-0">
                  Sort
                </label>
                <select
                  id="sort-recipes"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="field field-pill min-h-11 w-full py-2 text-sm lg:w-44"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <fieldset className="mt-5 border-t-2 border-dotted border-black pt-4">
              <legend className="label-caps flex items-center gap-2">
                <SlidersIcon size={14} />
                Categories
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = selectedCategories.includes(category)
                  return (
                    <button
                      key={category}
                      type="button"
                      className="chip"
                      data-active={active}
                      aria-pressed={active}
                      onClick={() => setSelectedCategories(toggleValue(selectedCategories, category))}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-4 grid gap-4 border-t-2 border-dotted border-black pt-4 md:grid-cols-[1.2fr_1fr]">
              <fieldset>
                <legend className="label-caps">Total time</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TIME_FILTERS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="chip"
                      data-active={maxTime === option.value}
                      aria-pressed={maxTime === option.value}
                      onClick={() => setMaxTime(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="label-caps">Difficulty</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['All', ...difficulties].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="chip"
                      data-active={difficulty === option}
                      aria-pressed={difficulty === option}
                      onClick={() => setDifficulty(option)}
                    >
                      {option === 'All' ? 'Any' : option}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="mt-4 border-t-2 border-dotted border-black pt-4">
              <button
                type="button"
                onClick={() => setShowAllTags((value) => !value)}
                className="label-caps inline-flex min-h-11 items-center gap-2"
                aria-expanded={showAllTags}
              >
                Tags
                <span className="font-serif text-base font-black" aria-hidden="true">
                  {showAllTags ? '−' : '+'}
                </span>
              </button>
              <div className="mt-2 flex flex-wrap gap-2">
                {visibleTags.map(({ tag, count }) => {
                  const active = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      className="chip min-h-11 px-3 text-xs"
                      data-active={active}
                      aria-pressed={active}
                      onClick={() => setSelectedTags(toggleValue(selectedTags, tag))}
                    >
                      #{tag}
                      <span className="text-[10px] font-bold text-black">{count}</span>
                    </button>
                  )
                })}
              </div>
              {allTagCounts.length > 12 ? (
                <button
                  type="button"
                  onClick={() => setShowAllTags((value) => !value)}
                  className="mt-3 inline-flex min-h-11 items-center text-sm font-bold underline decoration-2 underline-offset-4"
                >
                  {showAllTags ? 'Show fewer tags' : `Show all ${allTagCounts.length} tags`}
                </button>
              ) : null}
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t-2 border-black pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold" aria-live="polite">
                Showing {sorted.length} of {recipes.length} recipes
                {activeFilterCount > 0 ? (
                  <span className="ml-2 font-medium italic text-neutral-700">
                    {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} on
                  </span>
                ) : null}
              </p>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm font-bold underline decoration-2 underline-offset-4 hover:text-bauhaus-blue sm:self-auto"
                >
                  <CloseIcon size={15} />
                  Clear search &amp; filters
                </button>
              ) : null}
            </div>
          </div>

          {sorted.length > 0 ? (
            <div
              className={`mt-7 grid grid-cols-1 gap-4 sm:gap-5 ${
                sorted.length === 1
                  ? 'mx-auto max-w-xl'
                  : sorted.length === 2
                    ? 'mx-auto max-w-4xl sm:grid-cols-2'
                    : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              {sorted.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className="mt-7 overflow-hidden rounded-[20px] border-2 border-black bg-white">
              <div className="grid md:grid-cols-[1fr_1.4fr]">
                <div className="relative flex min-h-52 items-center justify-center overflow-hidden bg-bauhaus-yellow">
                  <span className="absolute -left-10 -top-10 size-40 rounded-full bg-bauhaus-blue" />
                  <span className="absolute -bottom-10 -right-10 size-32 rounded-full bg-bauhaus-red" />
                  <span className="relative flex size-20 items-center justify-center rounded-full border-2 border-black bg-white">
                    <SearchIcon size={34} />
                  </span>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <p className="label-caps">No results</p>
                  <h3 className="mt-2 text-3xl leading-none">Nothing matches — yet.</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-700">
                    Try a broader term, drop a category, or reset everything and browse the whole
                    box. Search works across titles, ingredients, tags, and categories.
                  </p>
                  <button type="button" onClick={clearAll} className="btn btn-primary btn-sm mt-5 self-start">
                    Reset the filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FRIDGE CTA */}
      <section className="relative overflow-hidden bg-bauhaus-yellow py-10 sm:py-14">
        <div
          aria-hidden="true"
          className="absolute -left-16 -top-16 size-52 rounded-full border-2 border-black bg-bauhaus-blue"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 right-10 size-48 rounded-full border-2 border-black bg-bauhaus-red"
        />
        <div className="container-page relative">
          <div className="grid items-center gap-6 rounded-[20px] border-2 border-black bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">
            <div className="max-w-2xl">
              <p className="label-caps flex items-center gap-2">
                <FridgeIcon size={15} />
                The hero feature
              </p>
              <h2 className="mt-2 text-balance text-3xl leading-none sm:text-5xl">
                The fridge knows what&apos;s for dinner.
              </h2>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-neutral-700 sm:text-base">
                List what you have, save your everyday staples, and we&apos;ll rank the recipes
                you&apos;re closest to making — including exactly what&apos;s missing.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/fridge" className="btn btn-primary btn-sm">
                  Open the fridge matcher
                  <ArrowRightIcon size={17} />
                </Link>
                <button type="button" onClick={surpriseMe} className="btn btn-white btn-sm">
                  <DiceIcon size={17} />
                  Or surprise me
                </button>
              </div>
            </div>
            <div aria-hidden="true" className="hidden lg:block">
              <div className="relative flex size-40 items-center justify-center rounded-full border-2 border-black bg-bauhaus-yellow">
                <span className="pattern-dots absolute inset-4 rounded-full text-black" />
                <span className="relative flex size-20 items-center justify-center rounded-full border-2 border-black bg-white">
                  <ChefHatIcon size={36} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
