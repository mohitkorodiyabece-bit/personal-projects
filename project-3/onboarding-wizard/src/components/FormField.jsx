import { useFormContext } from 'react-hook-form'

/**
 * A labeled input bound to react-hook-form's context. Handles the
 * label/input association, helper text, and inline validation error
 * display so step components stay focused on layout instead of repeating
 * this wiring per field.
 */
export default function FormField({
  name,
  label,
  type = 'text',
  autoComplete,
  helperText,
  required = true,
  inputMode,
  maxLength,
  placeholder,
}) {
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
        {required && (
          <span className="field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={inputId}
        type={type}
        className="field__input"
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        {...register(name)}
      />

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