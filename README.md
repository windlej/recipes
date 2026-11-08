# Windle Family Recipes

A fully static, personal family cookbook with a bold Digital Bauhaus look. Built with Vite,
React, and Tailwind CSS. There is no backend, no database, no authentication, and no
user-facing way to add or edit recipes.

All recipe content lives in one file: [`src/data/recipes.json`](./src/data/recipes.json).
Favorites, made-it notes, and pantry staples are stored in the visitor's browser.

## Features

- **Recipe library** — responsive card grid with search, category/tag filters, time and
  difficulty filters, and sorting.
- **Fridge matcher** — free-text entry, quick-add ingredient chips, saved pantry staples,
  ranked matches, and a clear list of missing ingredients.
- **Surprise me** — a filtered random picker (categories, max time, difficulty) available from
  every page.
- **Recipe detail** — large photo, quantities, grouped ingredients, numbered steps, notes,
  source, related recipes, and a clean print stylesheet.
- **Favorites / Make soon** — stored locally.
- **Made it log** — optional 1–5 star rating and personal notes, stored locally.
- **Photo credits** — licensed photography is attributed at `/credits` (under the `#/credits`
  route).

## Run locally

Requires Node.js 20.19+ (Node 22 is used in CI).

```bash
npm install
npm run dev
```

Validate the recipe data on its own (also runs automatically before every build):

```bash
npm run validate
```

Production build:

```bash
npm run build
npm run preview
```

The build fails if a recipe is missing required fields, references an unknown
category/difficulty, uses a duplicate id, or points at a missing image.

## Project structure

```text
.
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── public/
│   ├── .nojekyll                  # tell Pages not to run Jekyll
│   ├── favicon.svg
│   └── images/recipes/            # optimized 1200×900 recipe photos
├── scripts/
│   └── validate-recipes.mjs       # data + image integrity check (prebuild)
├── src/
│   ├── components/                # Layout, cards, dialogs, filters, icons
│   ├── context/AppContext.jsx     # favorites, made-it, pantry + toast state
│   ├── data/
│   │   ├── recipes.json           # THE recipe database
│   │   ├── README.md              # how to add a recipe + data model
│   │   └── photoCredits.js
│   ├── lib/
│   │   ├── matching.js            # fridge matching and ingredient normalisation
│   │   ├── recipes.js             # search, filtering, sorting, related recipes
│   │   ├── storage.js             # localStorage hook
│   │   └── format.js
│   ├── pages/                     # Home, Recipe, Fridge, Favorites, Credits, 404
│   ├── App.jsx
│   ├── index.css                  # Digital Bauhaus theme + print styles
│   └── main.jsx
└── package.json
```

## Adding or editing recipes

Edit `src/data/recipes.json`. There is intentionally no UI for this. The full data model and a
copy-paste template live in [`src/data/README.md`](./src/data/README.md).

Rules of thumb:

- Add the picture to `public/images/recipes/` and reference it without a leading slash, e.g.
  `images/recipes/my-dish.jpg`.
- Keep ingredient `item` names simple and canonical (`chicken thighs`, not
  `2 lb chicken thighs`). Quantities go in `amount`; preparation notes go in `note`.
- Mark optional ingredients with `"optional": true` — they are excluded from fridge matching.
- Use categories from `meta.categories`. Tags are free-form lowercase kebab-case.
- Recipe `id` values must be unique, lowercase, hyphenated, and URL-safe.
- Deploy after editing. Data is bundled at build time, so changes require a rebuild.
  `npm run build` runs the validator first and refuses to build broken data.

## How the fridge matcher works

`src/lib/matching.js` normalises ingredient names by:

1. Lowercasing, stripping punctuation/accents, and removing preparation words.
2. Resolving common aliases (scallions/green onions, cilantro/coriander, stock/broth,
   yogurt/yoghurt, etc.).
3. Stemming simple plural forms.
4. Comparing token sets, so `chicken` matches `chicken thighs` and `tomato` matches
   `roma tomatoes`.

Each recipe is scored by:

1. How many required ingredients the visitor already has (descending).
2. Coverage percentage (descending).
3. Total time (ascending).

Recipes with zero matches are hidden. Optional ingredients are never counted. The visitor can
turn pantry staples on/off for matching and limit results to recipes that are three or fewer
ingredients away.

## Browser storage

Only three keys are used, all versioned and namespaced:

| Key                  | Contents                                      |
| -------------------- | --------------------------------------------- |
| `wfr:favorites:v1`   | Array of saved recipe ids                     |
| `wfr:made-it:v1`     | Map of recipe id → `{ rating, notes, madeOn }` |
| `wfr:pantry:v1`      | Array of pantry staple names                  |

The fridge list itself is intentionally **not** persisted. Local storage is per browser/device;
clearing site data removes these lists.

## Deploying to GitHub Pages

The repository includes [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

1. Push the repo to GitHub (default branch `main`).
2. In **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main` or run the workflow manually.

The app uses `base: './'` in `vite.config.js` so the same build works at
`https://username.github.io/recipes/` or on a custom domain without changes. Routing uses
`HashRouter`, which avoids GitHub Pages 404s on refresh or deep links. The URL shape is
`/#/recipe/lemon-herb-chicken-thighs`.

If you rename the repo or use a user site, no build changes are needed.

## Design notes

The Digital Bauhaus system is defined once in `src/index.css` as Tailwind v4 theme tokens:

- Yellow `#FACC15` / `#FCD34D` backgrounds
- Blue `#1D4ED8` / `#2563EB` shapes and accents
- Red `#E63946` / `#DC2626` accents
- Black outlines and text, white card surfaces, `#F8F8F8` soft neutral
- Serif display headings (Fraunces, falling back to Georgia) and a geometric sans body
  (Space Grotesk)
- 20px card corners, pill buttons, flat borders, zero shadows, no gradients used for depth,
  no blur or glass effects

To customise the look, edit the CSS custom properties in the `@theme` block. To change the
logo or decorations, look at `Header.jsx`, `Footer.jsx`, and the page hero sections.

## Accessibility & print

- Mobile-first layouts with 44px minimum touch targets for chips, filters, and actions.
- Visible focus rings, semantic headings, skip link, labelled form fields, `aria-pressed` filter
  chips, live result counts, and a native `<dialog>` for modal focus trapping/Escape handling.
- Ingredient checkboxes are keyboard accessible.
- `@media print` hides navigation, footers, decorative shapes, action buttons, related
  recipes, and UI chrome. The detail page prints as a clean title/meta/ingredients/steps sheet.
  Use the **Print recipe** button on a detail page.

## Photography

Recipe photography is licensed under Creative Commons Attribution 2.0 and is credited on the
site's [photo credits page](src/pages/CreditsPage.jsx) (data in
`src/data/photoCredits.js`). Images were cropped to 4:3 and optimized to 1200×900 JPEGs.
Photography is not included under any code license; it remains under the licenses shown.

## License

Recipe text and site code are for personal family use. Third-party photography retains its
Creative Commons licenses as listed on the credits page.
