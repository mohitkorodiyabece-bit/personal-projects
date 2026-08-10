import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

/**
 * A password input with an accessible visibility toggle. Kept separate
 * from FormField because it needs local UI state (show/hide) and a second
 * interactive element inside the control.
 */
export default function PasswordField({
  name,
  label,
  autoComplete,
  helperText,
}) {
  const [isVisible, setIsVisible] = useState(false)
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]
  const inputId = `field-${name}`
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`

  const describedBy =
    [helperText ? helperId : null, error ? errorId : null]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <div className="field">
      <label htmlFor={inputId} className="field__label">
        {label}
        <span className="field__required" aria-hidden="true">
          *
        </span>
      </label>

      <div className="field__password-wrap">
        <input
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          className="field__input field__input--password"
          autoComplete={autoComplete}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          {...register(name)}
        />
        <button
          type="button"
          className="field__password-toggle"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeOff size={18} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={18} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      {helperText && !error && (
        <p id={helperId} className="field__helper">
          {helperText}
        </p>
      )}

      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}