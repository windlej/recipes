import { Link } from 'react-router-dom'
import usePageMeta from '../components/usePageMeta'
import { ArrowLeftIcon, BookIcon, DiceIcon, FridgeIcon } from '../components/icons'

export default function NotFoundPage() {
  usePageMeta('Page not found')

  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-bauhaus-yellow py-12 sm:py-20">
      <div
        aria-hidden="true"
        className="absolute -right-16 -top-20 size-72 rounded-full border-2 border-black bg-bauhaus-blue sm:size-96"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-20 left-1/3 size-56 rounded-t-full bg-bauhaus-red"
      />
      <div className="container-page relative">
        <div className="mx-auto max-w-2xl rounded-[20px] border-2 border-black bg-white p-6 sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="label-caps">Page not found</p>
            <span className="flex size-14 rotate-6 items-center justify-center rounded-full border-2 border-black bg-bauhaus-red">
              <BookIcon size={26} />
            </span>
          </div>
          <h1 className="mt-4 text-5xl leading-[0.92] sm:text-7xl">This page is off the menu.</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-700 sm:text-base">
            The recipe or page you were looking for is not here. Head back to the box, or let the
            fridge decide instead.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/" className="btn btn-primary">
              <ArrowLeftIcon size={18} />
              Back to the recipes
            </Link>
            <Link to="/fridge" className="btn btn-white">
              <FridgeIcon size={18} />
              Fridge matcher
            </Link>
            <Link to="/favorites" className="btn btn-white">
              <DiceIcon size={18} />
              Saved recipes
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
