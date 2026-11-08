import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="no-print relative overflow-hidden border-t-2 border-black bg-bauhaus-yellow">
      <div
        aria-hidden="true"
        className="pattern-dots absolute bottom-8 left-6 size-20 text-black"
      />
      <div className="container-page relative py-10 sm:py-12">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-3xl font-black tracking-[-0.03em]">Windle Family Recipes</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed">
              A small, hand-picked cookbook for the meals we actually make. No accounts, no ads,
              no noise — just dinner.
            </p>
            <div className="mt-5 flex items-center gap-2" aria-hidden="true">
              <span className="size-3 rounded-full bg-bauhaus-blue" />
              <span className="size-3 rounded-full bg-bauhaus-red" />
              <span className="size-3 rounded-full border-2 border-black bg-white" />
            </div>
          </div>

          <div>
            <p className="label-caps">Explore</p>
            <ul className="mt-3 space-y-1">
              <li>
                <Link to="/" className="inline-flex min-h-11 items-center font-semibold hover:underline">
                  All recipes
                </Link>
              </li>
              <li>
                <Link
                  to="/fridge"
                  className="inline-flex min-h-11 items-center font-semibold hover:underline"
                >
                  What&apos;s in my fridge
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="inline-flex min-h-11 items-center font-semibold hover:underline"
                >
                  Saved &amp; made
                </Link>
              </li>
              <li>
                <Link
                  to="/credits"
                  className="inline-flex min-h-11 items-center font-semibold hover:underline"
                >
                  Photo credits
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="label-caps">The fine print</p>
            <p className="mt-3 text-sm leading-relaxed">
              Recipes live in a static JSON file in the repo. Favorites, ratings, and pantry
              staples stay in your browser.
            </p>
            <p className="mt-3 text-xs font-semibold italic">Made for our table. Shared with yours.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t-2 border-black pt-4 text-xs font-semibold sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Windle Family Recipes</p>
          <p className="italic">Built with a fondness for yellow, blue, and dinner.</p>
        </div>
      </div>
    </footer>
  )
}
