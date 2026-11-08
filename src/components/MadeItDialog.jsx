import { useEffect, useId, useState } from 'react'
import Modal from './Modal'
import { StarIcon, TrashIcon } from './icons'

export default function MadeItDialog({ open, recipe, existing, onSave, onRemove, onClose }) {
  const titleId = useId()
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState('')
  const [hovered, setHovered] = useState(0)

  useEffect(() => {
    if (!open) return
    setRating(existing?.rating ?? 0)
    setNotes(existing?.notes ?? '')
    setHovered(0)
  }, [open, existing])

  function handleSave(event) {
    event.preventDefault()
    onSave({ rating, notes: notes.trim() })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} className="max-w-lg">
      <form onSubmit={handleSave}>
        <div className="border-b-2 border-black bg-bauhaus-yellow px-5 py-6 pr-16 sm:px-7">
          <p className="label-caps">A note for future you</p>
          <h2 id={titleId} className="mt-2 text-3xl leading-none">
            I made this
          </h2>
          <p className="mt-2 text-sm font-semibold italic">{recipe?.title}</p>
        </div>

        <div className="p-5 sm:p-7">
          <fieldset>
            <legend className="label-caps">How did it turn out?</legend>
            <div
              className="mt-3 flex items-center gap-1"
              role="group"
              aria-label="Rating from 1 to 5 stars"
              onMouseLeave={() => setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hovered || rating)
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star === rating ? 0 : star)}
                    onMouseEnter={() => setHovered(star)}
                    aria-label={`Rate ${star} out of 5`}
                    aria-pressed={rating === star}
                    className="inline-flex size-12 items-center justify-center rounded-full transition-colors hover:bg-mist"
                  >
                    <StarIcon
                      size={30}
                      filled={active}
                      className={active ? 'text-bauhaus-red' : 'text-black'}
                    />
                  </button>
                )
              })}
              <span className="ml-2 text-sm font-bold">
                {rating > 0 ? `${rating} / 5` : 'Optional'}
              </span>
            </div>
          </fieldset>

          <label className="mt-5 block">
            <span className="label-caps">Personal notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              maxLength={1200}
              placeholder="Doubled the garlic. Needed 10 more minutes. The kids asked for it again."
              className="field mt-2 resize-y rounded-2xl"
            />
            <span className="mt-1 block text-right text-xs text-neutral-700">
              {notes.length}/1200 · saved only on this device
            </span>
          </label>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            {existing ? (
              <button
                type="button"
                onClick={() => {
                  onRemove()
                  onClose()
                }}
                className="btn btn-white btn-sm self-start border-bauhaus-red"
              >
                <TrashIcon size={16} />
                Remove
              </button>
            ) : (
              <span />
            )}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={onClose} className="btn btn-white btn-sm">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                {existing ? 'Update notes' : 'Save to Made it'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}
