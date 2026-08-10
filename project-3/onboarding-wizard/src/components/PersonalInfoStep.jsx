import FormField from './FormField.jsx'

export default function PersonalInfoStep() {
  return (
    <div className="step">
      <div className="step__header">
        <h2 className="step__title">Personal information</h2>
        <p className="step__description">
          Tell us a bit about yourself. This information is used to verify
          your identity for the account.
        </p>
      </div>

      <div className="step__fields">
        <FormField
          name="fullName"
          label="Full name"
          autoComplete="name"
          helperText="Enter your name as it appears on a government-issued ID."
        />

        <FormField
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          helperText="We'll use this address for account notifications."
        />

        <FormField
          name="phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit mobile number"
          helperText="Used for account recovery and security alerts."
        />

        <FormField
          name="dateOfBirth"
          label="Date of birth"
          type="date"
          autoComplete="bday"
          helperText="You must provide your date of birth to continue."
        />
      </div>
    </div>
  )
}