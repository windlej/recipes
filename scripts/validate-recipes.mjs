import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Fails the production build when the recipe data is structurally invalid or a
// referenced photo is missing. Photos themselves are optional.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'src/data/recipes.json')
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
const errors = []

const categories = new Set(data.meta?.categories ?? [])
const difficulties = new Set(data.meta?.difficulties ?? [])
const seenIds = new Set()
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function requireString(recipe, key, index) {
  if (typeof recipe[key] !== 'string' || !recipe[key].trim()) {
    errors.push(`Recipe ${index + 1} (${recipe.id || 'missing id'}): "${key}" must be a non-empty string.`)
  }
}

if (!Array.isArray(data.recipes) || data.recipes.length === 0) {
  errors.push('"recipes" must be a non-empty array.')
}

for (const [index, recipe] of (data.recipes ?? []).entries()) {
  const label = `Recipe ${index + 1} (${recipe.id || 'missing id'})`

  for (const key of ['id', 'title', 'description', 'servings', 'difficulty']) {
    requireString(recipe, key, index)
  }

  if (recipe.id && !slugPattern.test(recipe.id)) {
    errors.push(`${label}: id must be lowercase, URL-safe kebab-case.`)
  }
  if (recipe.id && seenIds.has(recipe.id)) {
    errors.push(`${label}: duplicate id "${recipe.id}".`)
  }
  seenIds.add(recipe.id)

  for (const key of ['prepTime', 'cookTime', 'totalTime']) {
    if (!Number.isFinite(recipe[key]) || recipe[key] <= 0) {
      errors.push(`${label}: "${key}" must be a positive number of minutes.`)
    }
  }

  if (!difficulties.has(recipe.difficulty)) {
    errors.push(`${label}: difficulty "${recipe.difficulty}" is not in meta.difficulties.`)
  }

  if (!Array.isArray(recipe.categories) || recipe.categories.length === 0) {
    errors.push(`${label}: at least one category is required.`)
  } else {
    for (const category of recipe.categories) {
      if (!categories.has(category)) {
        errors.push(`${label}: category "${category}" is not in meta.categories.`)
      }
    }
  }

  if (!Array.isArray(recipe.tags) || recipe.tags.length === 0) {
    errors.push(`${label}: at least one tag is required.`)
  } else {
    for (const tag of recipe.tags) {
      if (typeof tag !== 'string' || !slugPattern.test(tag)) {
        errors.push(`${label}: tag "${tag}" must be lowercase kebab-case.`)
      }
    }
  }

  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    errors.push(`${label}: at least one ingredient is required.`)
  } else {
    for (const [ingredientIndex, ingredient] of recipe.ingredients.entries()) {
      if (!ingredient?.item || typeof ingredient.item !== 'string') {
        errors.push(`${label}: ingredient ${ingredientIndex + 1} needs an "item".`)
      }
      if (!ingredient?.amount || typeof ingredient.amount !== 'string') {
        errors.push(`${label}: ingredient ${ingredientIndex + 1} needs an "amount".`)
      }
      if (ingredient?.optional !== undefined && typeof ingredient.optional !== 'boolean') {
        errors.push(`${label}: ingredient ${ingredientIndex + 1} "optional" must be a boolean.`)
      }
    }
  }

  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) {
    errors.push(`${label}: at least one step is required.`)
  } else {
    for (const [stepIndex, step] of recipe.steps.entries()) {
      if (typeof step !== 'string' || !step.trim()) {
        errors.push(`${label}: step ${stepIndex + 1} must be a non-empty string.`)
      }
    }
  }

  // A photo is optional. When one is supplied, its alt text and file must
  // also be present. Missing photos render the shared "Photo coming soon" UI.
  if (recipe.image !== undefined && recipe.image !== null && recipe.image !== '') {
    if (typeof recipe.image !== 'string') {
      errors.push(`${label}: "image" must be a string path when present.`)
    } else {
      if (typeof recipe.imageAlt !== 'string' || !recipe.imageAlt.trim()) {
        errors.push(`${label}: "imageAlt" is required whenever "image" is set.`)
      }
      const imagePath = path.join(root, 'public', recipe.image.replace(/^\/+/, ''))
      if (!fs.existsSync(imagePath)) {
        errors.push(`${label}: image not found at public/${recipe.image}.`)
      }
    }
  } else if (recipe.imageAlt !== undefined) {
    errors.push(`${label}: "imageAlt" is set but "image" is missing.`)
  }

  if (recipe.source !== undefined && typeof recipe.source !== 'string') {
    errors.push(`${label}: "source" must be a string when present.`)
  }
  if (recipe.notes !== undefined && typeof recipe.notes !== 'string') {
    errors.push(`${label}: "notes" must be a string when present.`)
  }
}

if (errors.length > 0) {
  console.error(`\nRecipe validation failed with ${errors.length} issue(s):\n`)
  for (const error of errors) console.error(`  • ${error}`)
  console.error('')
  process.exit(1)
}

console.log(`✓ ${data.recipes.length} recipes validated.`)
