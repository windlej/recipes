# Agent notes for Windle Family Recipes

These notes apply to future coding-agent sessions working in this repository.

## Adding recipes

- Recipes are added only by editing `src/data/recipes.json`. There is no admin UI.
- Keep additions minimal. Do not rename, remove, or restyle unrelated recipes, categories,
  assets, or pages unless explicitly asked.
- **Do not generate, source, or add placeholder imagery for recipes.** The owner uploads real
  photos separately in another chat. This includes AI images, illustrations, SVGs, stock photos,
  and downloaded stand-ins.
- If a recipe does not have a photo yet, omit both `image` and `imageAlt`. The app renders the
  shared “Photo coming soon” placeholder automatically.
- When the owner later provides a photo, save it under `public/images/recipes/` and add both
  `image` (e.g. `images/recipes/my-dish.jpg`) and `imageAlt`. Do not start the path with a slash.
- Only update `src/data/photoCredits.js` and `CREDITS.md` for third-party photos that require
  attribution. The owner's own uploads do not need a photo credit.
- The Chicken Noodle Soup illustration predates this rule; leave it in place unless the owner
  asks to replace it.

## Before committing

```bash
npm run validate
npm run build
```

`npm run build` also runs the validator automatically. The validator allows photos to be
omitted, but checks any referenced image file exists.

The site is live at <https://windlej.github.io/recipes/>. Pushing to `main` deploys through
GitHub Actions. Deploy only when the owner asks for the change to go live.
