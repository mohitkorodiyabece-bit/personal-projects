import { CheckCircle2 } from 'lucide-react'

export default function SuccessScreen({ referenceId, onReset }) {
  return (
    <div className="success" role="status">
      <div className="success__icon" aria-hidden="true">
        <CheckCircle2 size={40} strokeWidth={1.75} />
      </div>

      <h2 className="success__heading">Account setup complete</h2>
      <p className="success__text">
        Your workspace account has been created. You can use your username
        and password to sign in once your account is activated.
      </p>

      <div className="success__reference">
        <span className="success__reference-label">Reference ID</span>
        <span className="success__reference-value">{referenceId}</span>
      </div>

      <button type="button" className="button button--primary" onClick={onReset}>
        Start new application
      </button>
    </div>
  )
}