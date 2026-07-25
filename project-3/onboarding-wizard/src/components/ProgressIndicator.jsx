import { Check } from 'lucide-react'

const STEPS = [
  { id: 1, name: 'Personal Info' },
  { id: 2, name: 'Account Setup' },
  { id: 3, name: 'Review' },
]

export default function ProgressIndicator({ currentStep }) {
  const percentComplete = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="progress" role="group" aria-label="Onboarding progress">
      <div className="progress__meta">
        <span className="progress__label">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="progress__current-name">
          {STEPS.find((step) => step.id === currentStep)?.name}
        </span>
      </div>

      <div
        className="progress__track"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
      >
        <div
          className="progress__fill"
          style={{ width: `${percentComplete}%` }}
        />
      </div>

      <ol className="progress__steps">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep
          const isActive = step.id === currentStep

          return (
            <li
              key={step.id}
              className={[
                'progress__step',
                isActive ? 'progress__step--active' : '',
                isCompleted ? 'progress__step--completed' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="progress__step-marker" aria-hidden="true">
                {isCompleted ? <Check size={13} strokeWidth={2.5} /> : step.id}
              </span>
              <span className="progress__step-name">{step.name}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}