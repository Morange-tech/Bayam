import { cn } from '@/lib/utils'

function getScore(password) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return Math.min(score, 4)
}

const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500', 'bg-green-600']
const labels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort']

export function PasswordStrengthBar({ password }) {
  if (!password) return null

  const score = getScore(password)

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i <= score ? colors[score] : 'bg-beige-border'
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          'mt-1 text-xs transition-colors',
          score <= 1 ? 'text-red-500' : score <= 2 ? 'text-orange-500' : 'text-green-600'
        )}
      >
        {labels[score]}
      </p>
    </div>
  )
}
