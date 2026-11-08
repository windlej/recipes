import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories, difficulties, filterRecipes, recipes } from '../lib/recipes'
import { formatMinutes } from '../lib/format'
import Modal from './Modal'
import RecipeImage from './RecipeImage'
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ClockIcon,
  DiceIcon,
  SlidersIcon,
  SparkleIcon,
} from './icons'

function pickRandom(list, excludeId) {
  if (!list.length) return null
  const candidates = list.filter((recipe) => recipe.id !== excludeId)
  const pool = candidates.length ? candidates : list
  return pool[Math.floor(Math.random() * pool.length)]
}

const TIME_OPTIONS = [
  { value: 0, label: 'Any time' },
  { value: 30, label: '30 min or less' },
  { value: 45, label: '45 min or less' },
  { value: 60, label: '1 hour or less' },
]

export default function RandomPicker({ open, preset = {}, onClose }) {
  const titleId = useId()
  const navigate = useNavigate()
  const initialCategories = preset.categories ?? []
  const initialMaxTime = preset.maxTime ?? 0
  const initialDifficulty = preset.difficulty ?? 'All'
  const initialFiltersActive =
    initialCategories.length > 0 || initialMaxTime > 0 || initialDifficulty !== 'All'

  const [selectedCategories, setSelectedCategories] = useState(initialCategories)
  const [maxTime, setMaxTime] = useState(initialMaxTime)
  const [difficulty, setDifficulty] = useState(initialDifficulty)
  const [picked, setPicked] = useState(() =>
    pickRandom(
      filterRecipes(recipes, {
        selectedCategories: initialCategories,
        maxTime: initialMaxTime,
        difficulty: initialDifficulty,
      }),
    ),
  )
  const [rolling, setRolling] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(initialFiltersActive)
  const [rollKey, setRollKey] = useState(0)
  const rollTimer = useRef(null)
  const firstFilterRender = useRef(true)

  const filtered = useMemo(
    () =>
      filterRecipes(recipes, {
        selectedCategories,
        maxTime,
        difficulty,
      }),
    [selectedCategories, maxTime, difficulty],
  )

  const filterSignature = `${selectedCategories.join('|')}|${maxTime}|${difficulty}`
  const activeFilterCount =
    selectedCategories.length + (maxTime ? 1 : 0) + (difficulty !== 'All' ? 1 : 0)

  useEffect(() => {
    if (firstFilterRender.current) {
      firstFilterRender.current = false
      return
    }
    setPicked(pickRandom(filtered, picked?.id))
    // We only want to re-pick when the filter signature changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSignature])

  useEffect(
    () => () => {
      if (rollTimer.current) window.clearTimeout(rollTimer.current)
    },
    [],
  )

  function toggleCategory(category) {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    )
  }

  function resetFilters() {
    setSelectedCategories([])
    setMaxTime(0)
    setDifficulty('All')
  }

  function rollAgain() {
    if (!filtered.length || rolling) return
    setRolling(true)
    if (rollTimer.current) window.clearTimeout(rollTimer.current)
    rollTimer.current = window.setTimeout(() => {
      setPicked((current) => pickRandom(filtered, current?.id))
      setRollKey((key) => key + 1)
      setRolling(false)
    }, 320)
  }

  function viewRecipe() {
    if (!picked) return
    onClose()
    navigate(`/recipe/${picked.id}`)
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="max-w-2xl">
      <div className="relative overflow-hidden border-b-2 border-black bg-bauhaus-yellow px-5 py-5 pr-16 sm:px-7 sm:py-7">
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-12 hidden size-40 rounded-full border-2 border-black bg-bauhaus-blue sm:block"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-10 right-16 hidden size-24 rounded-full bg-bauhaus-red sm:block"
        />
        <p className="label-caps relative">The indecision solver</p>
        <h2 id={titleId} className="relative mt-2 text-3xl leading-none sm:text-4xl">
          What&apos;s for dinner?
        </h2>
        <p className="relative mt-2 max-w-sm text-sm font-medium">
          Set a few guardrails, roll the dice, and commit to dinner.
        </p>
      </div>

      <div className="p-5 sm:p-7">
        <p className="sr-only" aria-live="polite">
          {picked ? `Tonight's pick: ${picked.title}` : 'No recipes match these filters'}
        </p>

        {picked ? (
          <div
            key={`${picked.id}-${rollKey}`}
            className={`overflow-hidden rounded-[18px] border-2 border-black bg-mist ${
              rolling ? 'animate-shuffle' : 'animate-pop'
            }`}
          >
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-36 shrink-0 overflow-hidden border-b-2 border-black sm:h-auto sm:w-44 sm:border-b-0 sm:border-r-2">
                <RecipeImage recipe={picked} className="h-full" imgClassName="h-full" />
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <p className="label-caps flex items-center gap-1.5">
                  <SparkleIcon size={13} />
                  Tonight&apos;s pick
                </p>
                <h3 className="mt-2 text-2xl leading-[1.05]">{picked.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-700">
                  {picked.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="chip-static">
                    <ClockIcon size={13} />
                    {formatMinutes(picked.totalTime)}
                  </span>
                  <span className="chip-static italic">{picked.difficulty}</span>
                  <span className="chip-static">{picked.categories[0]}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 border-t-2 border-black p-4 sm:justify-end sm:p-5">
              <button
                type="button"
                onClick={rollAgain}
                className="btn btn-white btn-sm flex-1 whitespace-nowrap px-3 sm:flex-none sm:px-4"
                disabled={rolling}
              >
                <DiceIcon size={17} />
                {rolling ? 'Rolling…' : 'Pick again'}
              </button>
              <button
                type="button"
                onClick={viewRecipe}
                className="btn btn-primary btn-sm flex-1 whitespace-nowrap px-3 sm:flex-none sm:px-4"
              >
                View recipe
                <ArrowRightIcon size={17} />
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-[18px] border-2 border-black bg-mist p-6 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-black bg-bauhaus-red">
              <DiceIcon size={26} />
            </div>
            <h3 className="mt-3 text-xl">No recipes match those filters.</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-700">
              Loosen the time limit or clear a category and roll again.
            </p>
            <button type="button" onClick={resetFilters} className="btn btn-white btn-sm mt-4">
              Reset filters
            </button>
          </div>
        )}

        <details
          className="group mt-5 rounded-[18px] border-2 border-black bg-white"
          open={filtersOpen}
          onToggle={(event) => setFiltersOpen(event.currentTarget.open)}
        >
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <span className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-bold">
              <SlidersIcon size={17} />
              Refine the pick
              {activeFilterCount > 0 ? (
                <span className="rounded-full border-2 border-black bg-bauhaus-yellow px-2 py-0.5 text-[10px] font-bold leading-none">
                  {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'}
                </span>
              ) : null}
            </span>
            <ChevronDownIcon
              size={20}
              className="shrink-0 transition-transform group-open:rotate-180"
            />
          </summary>

          <div className="border-t-2 border-black p-4 sm:p-5">
            <fieldset>
              <legend className="label-caps">Only from these categories</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const active = selectedCategories.includes(category)
                  return (
                    <button
                      key={category}
                      type="button"
                      className="chip min-h-11"
                      data-active={active}
                      aria-pressed={active}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="label-caps">Max total time</span>
                <select
                  className="field mt-2"
                  value={maxTime}
                  onChange={(event) => setMaxTime(Number(event.target.value))}
                >
                  {TIME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="label-caps">Difficulty</span>
                <select
                  className="field mt-2"
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                >
                  <option value="All">Any difficulty</option>
                  {difficulties.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {activeFilterCount > 0 ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold underline decoration-2 underline-offset-4"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        </details>
      </div>
    </Modal>
  )
}
