# Recipe data

Every recipe on the site lives in [`recipes.json`](./recipes.json). There is no
admin UI and no database: to add, edit, or remove a recipe, edit this file and
redeploy.

## Adding a recipe

1. Add a new object to the `recipes` array.
2. Give it a unique, URL-safe `id` (lowercase, hyphens).
3. Save the photo in `public/images/recipes/` and point `image` at it
   (for example `images/recipes/my-recipe.jpg`). Do not start the path with a
   slash — asset paths are relative so the site works on GitHub Pages.
4. Use only categories listed in `meta.categories`. Tags are free-form, but use
   lowercase kebab-case (`under-30-min`, `one-pan`) so filters stay tidy.
5. `prepTime`, `cookTime`, and `totalTime` are whole minutes.
6. Each ingredient has an `amount`, an `item`, and optional `note`/`group`/
   `optional`. The fridge matcher compares the **`item`** field, so keep it to
   the bare ingredient name (`chicken thighs`, not `2 lb bone-in chicken
   thighs`). Put quantities in `amount` and preparation in `note`.
7. `optional: true` ingredients are shown in the recipe but ignored by the
   fridge matcher and the ingredient count.

## Template

```json
{
  "id": "my-new-recipe",
  "title": "My New Recipe",
  "description": "One or two inviting sentences for the card and detail page.",
  "image": "images/recipes/my-new-recipe.jpg",
  "imageAlt": "Describe the photo for screen readers.",
  "prepTime": 15,
  "cookTime": 30,
  "totalTime": 45,
  "servings": "4",
  "difficulty": "Easy",
  "categories": ["Dinner", "Comfort Food"],
  "tags": ["one-pan", "weeknight", "lemon"],
  "featured": false,
  "ingredients": [
    {
      "group": "Main",
      "amount": "2 tbsp",
      "item": "olive oil"
    },
    {
      "group": "Main",
      "amount": "1",
      "item": "lemon",
      "note": "zested and juiced"
    },
    {
      "group": "To finish",
      "amount": "1 handful",
      "item": "parsley",
      "note": "chopped",
      "optional": true
    }
  ],
  "steps": [
    "Write each instruction as one clear sentence or short paragraph.",
    "They render as a numbered list automatically."
  ],
  "notes": "Optional tips, substitutions, or storage advice.",
  "source": "Optional source, cookbook, or family card"
}
```

`featured: true` recipes may appear in the home-page featured slot. Only the
first featured recipe is used there, so keep one or two marked at a time.

## Checking your edits

Run:

```bash
npm run validate
```

(or simply `npm run build`, which runs it automatically). The validator checks
required fields, unique ids, category/difficulty values, ingredient and step
shapes, tag formatting, and that every referenced image exists in `public/`.

## Fridge matching tips

- Use simple, canonical ingredient names across recipes so the matcher can
  connect them (`yellow onion` and `red onion` are different items).
- The matcher already handles common plural forms and aliases such as
  scallions/green onions, cilantro/coriander, stock/broth, and yogurt/yoghurt.
- If an ingredient should never count toward a fridge match, mark it
  `optional`.
- Pantry staples are chosen by the visitor and saved in their browser; they are
  not stored in this file.
