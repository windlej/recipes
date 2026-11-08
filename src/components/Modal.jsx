import { useEffect, useRef } from 'react'
import { CloseIcon } from './icons'

/**
 * A native <dialog> wrapper. The native element gives us focus trapping,
 * Escape-to-close, and top-layer rendering for free. The backdrop is solid
 * black to stay within the no-transparency design rules.
 */
export default function Modal({ open, onClose, labelledBy, children, className = '' }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined

    if (open && !dialog.open) {
      dialog.showModal()
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previousOverflow
      }
    }

    if (!open && dialog.open) {
      dialog.close()
    }
    return undefined
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    return () => {
      if (dialog?.open) dialog.close()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className={`m-auto max-h-[90dvh] w-[calc(100vw-2rem)] overflow-y-auto rounded-[24px] border-2 border-black bg-white p-0 text-ink ${className}`}
    >
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          className="btn-icon absolute right-4 top-4 z-30"
          aria-label="Close dialog"
        >
          <CloseIcon size={20} />
        </button>
        {children}
      </div>
    </dialog>
  )
}
