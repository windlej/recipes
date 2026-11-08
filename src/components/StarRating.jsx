import { StarIcon } from './icons'

export default function StarRating({ value = 0, size = 16, className = '', showEmpty = true }) {
  const rounded = Math.round(Number(value) || 0)

  if (!showEmpty && rounded === 0) return null

  return (
    <span
      role="img"
      aria-label={rounded > 0 ? `${rounded} out of 5 stars` : 'Not rated yet'}
      className={`inline-flex items-center gap-0.5 ${className}`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          size={size}
          filled={star <= rounded}
          className={star <= rounded ? 'text-bauhaus-red' : 'text-black'}
        />
      ))}
    </span>
  )
}
