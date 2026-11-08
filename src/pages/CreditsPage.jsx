import { Link } from 'react-router-dom'
import { photoCredits } from '../data/photoCredits'
import { assetUrl } from '../lib/recipes'
import usePageMeta from '../components/usePageMeta'
import { ArrowLeftIcon, ArrowRightIcon } from '../components/icons'

export default function CreditsPage() {
  usePageMeta(
    'Photo credits',
    'Photography credits and Creative Commons licenses for the Windle Family Recipes recipe images.',
  )

  return (
    <>
      <section className="relative overflow-hidden border-b-2 border-black bg-bauhaus-yellow">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-24 size-48 rounded-full border-2 border-black bg-bauhaus-blue sm:-right-16 sm:-top-16 sm:size-80"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-14 left-1/4 hidden size-40 rounded-t-full bg-bauhaus-red sm:block"
        />
        <div className="container-page relative py-10 sm:py-14">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold underline decoration-2 underline-offset-4"
          >
            <ArrowLeftIcon size={16} />
            Back to the recipes
          </Link>
          <p className="label-caps mt-5">The credits</p>
          <h1 className="mt-2 text-[2.8rem] leading-[0.92] sm:text-6xl">Photo credits.</h1>
          <p className="mt-4 max-w-2xl text-pretty text-base font-medium leading-relaxed sm:text-lg">
            The recipe photograph used here is licensed under Creative Commons Attribution 2.0.
            Photography is cropped to a 4:3 aspect ratio for the site. Thank you to the
            photographers who made this little cookbook look alive. The chicken noodle soup
            artwork is an original illustration made for this site.
          </p>
        </div>
      </section>

      <section className="bg-mist py-8 sm:py-12">
        <div className="container-page">
          <ul className="grid gap-4 md:grid-cols-2">
            {photoCredits.map((credit) => (
              <li
                key={credit.file}
                className="grid overflow-hidden rounded-[20px] border-2 border-black bg-white sm:grid-cols-[10rem_1fr]"
              >
                <div className="aspect-[4/3] overflow-hidden border-b-2 border-black bg-bauhaus-yellow sm:aspect-auto sm:border-b-0 sm:border-r-2">
                  <img
                    src={assetUrl(`images/recipes/${credit.file}`)}
                    alt={`Photo used for ${credit.recipe}`}
                    width="1200"
                    height="900"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <p className="label-caps text-[10px] text-bauhaus-blue">{credit.recipe}</p>
                  <h2 className="mt-1 font-serif text-xl font-bold leading-tight">{credit.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed">
                    Photo by{' '}
                    <a
                      href={credit.creatorUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold underline decoration-2 underline-offset-4 hover:text-bauhaus-blue"
                    >
                      {credit.creator}
                    </a>
                    , licensed under{' '}
                    <a
                      href={credit.licenseUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold underline decoration-2 underline-offset-4 hover:text-bauhaus-blue"
                    >
                      {credit.license}
                    </a>
                    .
                  </p>
                  <a
                    href={credit.source}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold underline decoration-2 underline-offset-4 hover:text-bauhaus-blue"
                  >
                    View the original
                    <ArrowRightIcon size={15} />
                  </a>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-neutral-700">
            Recipe text, site design, and code are original to Windle Family Recipes. Recipe
            imagery is credited above and remains the property of the respective photographers
            under the licenses shown.
          </p>
        </div>
      </section>
    </>
  )
}
