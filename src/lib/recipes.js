import data from '../data/recipes.json'

export const recipes = [...data.recipes]
export const categories = data.meta.categories
export const difficulties = data.meta.difficulties

const tagCountMap = new Map()
for (const recipe of recipes) {
  for (const tag of recipe.tags) {
    tagCountMap.set(tag, (tagCountMap.get(tag) ?? 0) + 1)
  }
}

export const tags = [...tagCountMap.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([tag, count]) => ({ tag, count }))

export function getRecipe(id) {
  return recipes.find((recipe) => recipe.id === id)
}

export function getFeaturedRecipe() {
  return recipes.find((recipe) => recipe.featured) ?? recipes[0]
}

export function assetUrl(path = '') {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

export function recipeSearchText(recipe) {
  return [
    recipe.title,
    recipe.description,
    recipe.notes,
    recipe.source,
    ...recipe.categories,
    ...recipe.tags,
    ...recipe.ingredients.map((ingredient) => `${ingredient.item} ${ingredient.note ?? ''}`),
  ]
    .join(' ')
    .toLowerCase()
}

export function searchRecipes(list, query) {
  const normalized = query.trim().toLowerCase().replace(/#/g, ' ')
  if (!normalized.trim()) return list
  const tokens = normalized.split(/\s+/).filter(Boolean)
  return list.filter((recipe) => {
    const haystack = recipeSearchText(recipe)
    return tokens.every((token) => haystack.includes(token))
  })
}

export function filterRecipes(
  list,
  { query = '', selectedCategories = [], selectedTags = [], maxTime = 0, difficulty = 'All' } = {},
) {
  let result = searchRecipes(list, query)

  if (selectedCategories.length > 0) {
    result = result.filter((recipe) =>
      selectedCategories.every((category) => recipe.categories.includes(category)),
    )
  }

  if (selectedTags.length > 0) {
    result = result.filter((recipe) => selectedTags.every((tag) => recipe.tags.includes(tag)))
  }

  if (maxTime > 0) {
    result = result.filter((recipe) => recipe.totalTime <= maxTime)
  }

  if (difficulty !== 'All') {
    result = result.filter((recipe) => recipe.difficulty === difficulty)
  }

  return result
}

export function sortRecipes(list, sort = 'recommended') {
  const copy = [...list]
  switch (sort) {
    case 'quickest':
      return copy.sort((a, b) => a.totalTime - b.totalTime || a.title.localeCompare(b.title))
    case 'slowest':
      return copy.sort((a, b) => b.totalTime - a.totalTime || a.title.localeCompare(b.title))
    case 'az':
      return copy.sort((a, b) => a.title.localeCompare(b.title))
    case 'za':
      return copy.sort((a, b) => b.title.localeCompare(a.title))
    default:
      return copy
  }
}

export function getRelatedRecipes(recipe, limit = 3) {
  if (!recipe) return []
  return recipes
    .filter((candidate) => candidate.id !== recipe.id)
    .map((candidate) => {
      const sharedCategories = candidate.categories.filter((category) =>
        recipe.categories.includes(category),
      ).length
      const sharedTags = candidate.tags.filter((tag) => recipe.tags.includes(tag)).length
      return { candidate, score: sharedCategories * 2 + sharedTags }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.totalTime - b.candidate.totalTime)
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

export function getRecipesByIds(ids = []) {
  return ids.map((id) => getRecipe(id)).filter(Boolean)
}
