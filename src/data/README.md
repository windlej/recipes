# Recipe data

Every recipe on the site lives in [`recipes.json`](./recipes.json). There is no
admin UI and no database: to add, edit, or remove a recipe, edit this file and
redeploy.

## Adding a recipe

1. Add a new object to the `recipes` array.
2. Give it a unique, URL-safe `id` (lowercase, hyphens).
3. Use only categories listed in `meta.categories` (add a new category there
   first if you need one). Tags are free-form lowercase kebab-case
   (`under-30-min`, `one-pan`).
4. `prepTime`, `cookTime`, and `totalTime` are whole minutes.
5. Each ingredient has an `amount`, an `item`, and optional `note`/`group`/
   `optional`. The fridge matcher compares the **`item`** field, so keep it to
   the bare ingredient name (`chicken thighs`, not `2 lb bone-in chicken
   thighs`). Put quantities in `amount` and preparation in `note`.
6. `optional: true` ingredients are shown in the recipe but ignored by the
   fridge matcher and the ingredient count.
7. Run `npm run validate` (or `npm run build`) before deploying.

## Photos

Photos are **optional**. The owner usually uploads real photos separately, so do
not generate, source, or add stand-in images.

- If there is no photo yet, omit both `image` and `imageAlt`. The app displays a
  shared “Photo coming soon” placeholder.
- When the real photo is ready, save it in `public/images/recipes/` and add:

  ```json
  "image": "images/recipes/my-recipe.jpg",
  "imageAlt": "A short description of the photo for screen readers."
  ```

- Do not start the path with a slash. Asset paths are relative so the site works
  on GitHub Pages.
- Update `photoCredits.js`/`CREDITS.md` only for third-party photography.

## Template

A minimal recipe with no photo yet:

```json
{
  "id": "my-new-recipe",
  "title": "My New Recipe",
  "description": "One or two inviting sentences for the card and detail page.",
  "prepTime": 15,
  "cookTime": 30,
  "totalTime": 45,
  "servings": "4",
  "difficulty": "Easy",
  "categories": ["Dinner", "Comfort Food"],
  "tags": ["one-pan", "weeknight"],
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
  "source": "Optional source, cookbook, or family card"
}
```

Optional fields: `image`, `imageAlt`, `notes`, and `featured`. Add `image` and
`imageAlt` only once a real photo exists.

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

## For coding agents

See [`AGENTS.md`](../../AGENTS.md) for repository rules, including the
no-generated-images policy.
