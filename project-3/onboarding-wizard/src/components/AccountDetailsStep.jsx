import FormField from './FormField.jsx'
import PasswordField from './PasswordField.jsx'

export default function AccountDetailsStep() {
  return (
    <div className="step">
      <div className="step__header">
        <h2 className="step__title">Account setup</h2>
        <p className="step__description">
          Choose the credentials you&apos;ll use to sign in to your
          workspace.
        </p>
      </div>

      <div className="step__fields">
        <FormField
          name="username"
          label="Username"
          autoComplete="username"
          helperText="Choose a unique name for signing in."
        />

        <PasswordField
          name="password"
          label="Password"
          autoComplete="new-password"
          helperText="Use at least 8 characters with uppercase, lowercase, and a number."
        />

        <PasswordField
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          helperText="Re-enter your password exactly as above."
        />
      </div>
    </div>
  )
}