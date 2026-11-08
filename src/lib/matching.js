// ---------------------------------------------------------------------------
// Fridge matcher
// ---------------------------------------------------------------------------
// The matcher is deliberately forgiving but predictable:
//   1. Normalise both sides (case, punctuation, preparation words).
//   2. Resolve a small list of common aliases (scallions/green onions, etc.).
//   3. Compare token sets, so "chicken" matches "chicken thighs" and
//      "tomato" matches "roma tomatoes".
// One visitor ingredient can satisfy one recipe ingredient. Optional
// ingredients are excluded from the match entirely.
// ---------------------------------------------------------------------------

const PHRASE_ALIASES = [
  [/\bgreen onions?\b/g, 'scallions'],
  [/\bspring onions?\b/g, 'scallions'],
  [/\bscallion\b/g, 'scallion'],
  [/\bcoriander leaves?\b/g, 'cilantro'],
  [/\bcoriander\b/g, 'cilantro'],
  [/\bgarbanzo beans?\b/g, 'chickpeas'],
  [/\bprawns?\b/g, 'shrimp'],
  [/\bcourgettes?\b/g, 'zucchini'],
  [/\baubergines?\b/g, 'eggplant'],
  [/\byoghurt\b/g, 'yogurt'],
  [/\bbroth\b/g, 'stock'],
  [/\bconfectioners sugar\b/g, 'powdered sugar'],
  [/\bicing sugar\b/g, 'powdered sugar'],
  [/\bminced beef\b/g, 'ground beef'],
  [/\bmince\b/g, 'ground beef'],
  [/\bparmigiano( Reggiano)?\b/g, 'parmesan'],
  [/\bcotija\b/g, 'feta'],
  [/\bneutral oil\b/g, 'neutral oil'],
  [/\bcanola oil\b/g, 'neutral oil'],
  [/\bvegetable oil\b/g, 'neutral oil'],
  [/\broma tomatoes?\b/g, 'tomato'],
  [/\bcherry tomatoes?\b/g, 'tomato'],
  [/\bcrushed tomatoes?\b/g, 'tomato'],
  [/\bcanned tomatoes?\b/g, 'tomato'],
  [/\btinned tomatoes?\b/g, 'tomato'],
  [/\bground beef\b/g, 'beef'],
]

const PREP_WORDS = new Set([
  'a',
  'about',
  'all',
  'an',
  'and',
  'as',
  'at',
  'baby',
  'bone',
  'boneless',
  'bunch',
  'can',
  'canned',
  'chopped',
  'clove',
  'cloves',
  'cold',
  'crushed',
  'cup',
  'cups',
  'cut',
  'diced',
  'drained',
  'dried',
  'each',
  'extra',
  'finely',
  'for',
  'fresh',
  'from',
  'grated',
  'ground',
  'half',
  'halved',
  'handful',
  'head',
  'heads',
  'in',
  'into',
  'large',
  'lb',
  'lbs',
  'medium',
  'melted',
  'more',
  'of',
  'on',
  'optional',
  'or',
  'ounces',
  'oz',
  'peeled',
  'plus',
  'pounds',
  'prepared',
  'rinsed',
  'ripe',
  'room',
  'roughly',
  'seeds',
  'shredded',
  'skin',
  'skinless',
  'sliced',
  'small',
  'softened',
  'such',
  'tablespoon',
  'tablespoons',
  'teaspoon',
  'teaspoons',
  'the',
  'thinly',
  'to',
  'toasted',
  'torn',
  'tbsp',
  'temperature',
  'tsp',
  'virgin',
  'with',
])

function stemWord(word) {
  if (word.length <= 3) return word
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`
  if (word.endsWith('oes')) return word.slice(0, -2)
  if (word.endsWith('us')) return word
  if (word.endsWith('ss')) return word
  if (word.endsWith('s')) return word.slice(0, -1)
  return word
}

export function normalizeIngredient(value = '') {
  let text = String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/-/g, ' ')

  for (const [pattern, replacement] of PHRASE_ALIASES) {
    text = text.replace(pattern, replacement)
  }

  return text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word && !PREP_WORDS.has(word) && !/^\d+$/.test(word))
    .map(stemWord)
    .join(' ')
    .trim()
}

function tokenize(value) {
  return normalizeIngredient(value).split(' ').filter(Boolean)
}

/**
 * True when two ingredient names refer to the same thing for matching
 * purposes. Plurals are stemmed and either side can be more specific.
 */
export function ingredientNamesMatch(a, b) {
  const normalizedA = normalizeIngredient(a)
  const normalizedB = normalizeIngredient(b)
  if (!normalizedA || !normalizedB) return false
  if (normalizedA === normalizedB) return true

  const tokensA = normalizedA.split(' ')
  const tokensB = normalizedB.split(' ')

  const [shorter, longer] = tokensA.length <= tokensB.length ? [tokensA, tokensB] : [tokensB, tokensA]
  return shorter.every((token) => longer.includes(token))
}

export function addUniqueIngredient(list, rawValue) {
  const trimmed = String(rawValue).trim().replace(/\s+/g, ' ')
  if (!trimmed) return list
  const exists = list.some(
    (item) => normalizeIngredient(item) === normalizeIngredient(trimmed),
  )
  return exists ? list : [...list, trimmed]
}

export function addManyIngredients(list, values) {
  return values.reduce((next, value) => addUniqueIngredient(next, value), list)
}

export function removeIngredient(list, rawValue) {
  const target = normalizeIngredient(rawValue)
  return list.filter((item) => normalizeIngredient(item) !== target)
}

export function analyzeRecipe(recipe, availableItems) {
  const required = recipe.ingredients.filter((ingredient) => !ingredient.optional)
  const have = []
  const missing = []

  for (const ingredient of required) {
    const isAvailable = availableItems.some((item) => ingredientNamesMatch(item, ingredient.item))
    if (isAvailable) have.push(ingredient)
    else missing.push(ingredient)
  }

  return {
    recipe,
    have,
    missing,
    total: required.length,
    haveCount: have.length,
    missingCount: missing.length,
    coverage: required.length === 0 ? 0 : have.length / required.length,
  }
}

export function buildAvailableItems(fridgeItems, pantryItems, includePantry = true) {
  const combined = includePantry ? [...fridgeItems, ...pantryItems] : [...fridgeItems]
  const seen = new Set()
  return combined.filter((item) => {
    const normalized = normalizeIngredient(item)
    if (!normalized || seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
}

/**
 * Returns matching recipes, ranked by how many ingredients the visitor already
 * has (then by coverage, then by total time). Recipes with zero matches are
 * left out so the results feel useful rather than noisy.
 */
export function rankFridgeMatches(
  recipes,
  { fridgeItems = [], pantryItems = [], includePantry = true, maxMissing = null } = {},
) {
  const available = buildAvailableItems(fridgeItems, pantryItems, includePantry)

  return recipes
    .map((recipe) => analyzeRecipe(recipe, available))
    .filter((result) => result.haveCount > 0)
    .filter((result) => maxMissing == null || result.missingCount <= maxMissing)
    .sort(
      (a, b) =>
        b.haveCount - a.haveCount ||
        b.coverage - a.coverage ||
        a.recipe.totalTime - b.recipe.totalTime ||
        a.recipe.title.localeCompare(b.recipe.title),
    )
}
