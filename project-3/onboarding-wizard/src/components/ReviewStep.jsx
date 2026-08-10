import { useFormContext } from 'react-hook-form'
import { Pencil } from 'lucide-react'

function formatDateOfBirth(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function ReviewRow({ label, value }) {
  return (
    <div className="review__row">
      <span className="review__row-label">{label}</span>
      <span className="review__row-value">{value || '—'}</span>
    </div>
  )
}

export default function ReviewStep({ onEditStep }) {
  const { getValues } = useFormContext()
  const values = getValues()

  return (
    <div className="step">
      <div className="step__header">
        <h2 className="step__title">Review &amp; submit</h2>
        <p className="step__description">
          Confirm your details below. You can go back and edit either
          section before submitting.
        </p>
      </div>

      <section className="review__section" aria-labelledby="review-personal">
        <div className="review__section-header">
          <h3 id="review-personal" className="review__section-title">
            Personal information
          </h3>
          <button
            type="button"
            className="review__edit-button"
            onClick={() => onEditStep(1)}
          >
            <Pencil size={14} strokeWidth={2} aria-hidden="true" />
            Edit personal info
          </button>
        </div>

        <div className="review__rows">
          <ReviewRow label="Full name" value={values.fullName} />
          <ReviewRow label="Email" value={values.email} />
          <ReviewRow label="Phone" value={values.phone} />
          <ReviewRow
            label="Date of birth"
            value={formatDateOfBirth(values.dateOfBirth)}
          />
        </div>
      </section>

      <section className="review__section" aria-labelledby="review-account">
        <div className="review__section-header">
          <h3 id="review-account" className="review__section-title">
            Account details
          </h3>
          <button
            type="button"
            className="review__edit-button"
            onClick={() => onEditStep(2)}
          >
            <Pencil size={14} strokeWidth={2} aria-hidden="true" />
            Edit account details
          </button>
        </div>

        <div className="review__rows">
          <ReviewRow label="Username" value={values.username} />
          <ReviewRow
            label="Password"
            value={values.password ? '•'.repeat(10) : '—'}
          />
        </div>
      </section>
    </div>
  )
}