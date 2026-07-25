import { useMemo, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

import {
  onboardingSchema,
  defaultOnboardingValues,
  STEP_FIELDS,
} from '../schemas/onboardingSchema.js'
import ProgressIndicator from './ProgressIndicator.jsx'
import PersonalInfoStep from './PersonalInfoStep.jsx'
import AccountDetailsStep from './AccountDetailsStep.jsx'
import ReviewStep from './ReviewStep.jsx'
import SuccessScreen from './SuccessScreen.jsx'

const TOTAL_STEPS = 3

function generateReferenceId() {
  const segment = Math.random().toString(36).slice(2, 8).toUpperCase()
  const timestampSegment = Date.now().toString().slice(-4)
  return `NS-${segment}-${timestampSegment}`
}

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [referenceId, setReferenceId] = useState('')

  // A single react-hook-form instance is the source of truth for the whole
  // wizard. Step components read/write into this via useFormContext, so
  // navigating Next/Back never loses data — nothing unmounts the form,
  // only the visible step JSX changes.
  const methods = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: defaultOnboardingValues,
    mode: 'onChange',
    shouldUnregister: false,
  })

  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods

  // Step-scoped validity check. We intentionally do NOT rely on the global
  // `isValid` flag here, since that only becomes true once every field in
  // the entire schema (across all steps) is valid — which would keep Next
  // disabled on Step 1 because of untouched Step 2 fields. Instead we
  // check only the errors that belong to the current step's field list.
  const currentStepFields = STEP_FIELDS[currentStep] ?? []
  const isCurrentStepValid = useMemo(() => {
    if (currentStepFields.length === 0) return true
    return currentStepFields.every((fieldName) => !errors[fieldName])
  }, [errors, currentStepFields])

  async function goToNextStep() {
    const fieldsToValidate = STEP_FIELDS[currentStep] ?? []
    const isStepValid = await trigger(fieldsToValidate, { shouldFocus: true })
    if (!isStepValid) return

    setCurrentStep((step) => Math.min(step + 1, TOTAL_STEPS))
  }

  function goToPreviousStep() {
    setCurrentStep((step) => Math.max(step - 1, 1))
  }

  function handleEditStep(step) {
    setCurrentStep(step)
  }

  const onSubmit = (data) => {
    const finalPayload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      username: data.username,
      password: data.password,
    }

    // eslint-disable-next-line no-console
    console.log('Final onboarding payload:', finalPayload)

    setReferenceId(generateReferenceId())
    setIsSubmitted(true)
  }

  function handleReset() {
    methods.reset(defaultOnboardingValues)
    setCurrentStep(1)
    setIsSubmitted(false)
    setReferenceId('')
  }

  if (isSubmitted) {
    return <SuccessScreen referenceId={referenceId} onReset={handleReset} />
  }

  return (
    <FormProvider {...methods}>
      <header className="wizard-header">
        <h1 className="wizard-header__title">Workspace account setup</h1>
        <p className="wizard-header__subtitle">
          Complete each section to activate your account.
        </p>
      </header>

      <ProgressIndicator currentStep={currentStep} />

      <form
        className="wizard-card"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {currentStep === 1 && <PersonalInfoStep />}
        {currentStep === 2 && <AccountDetailsStep />}
        {currentStep === 3 && <ReviewStep onEditStep={handleEditStep} />}

        <div className="wizard-card__actions">
          {currentStep > 1 && (
            <button
              type="button"
              className="button button--secondary"
              onClick={goToPreviousStep}
            >
              <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
              Back
            </button>
          )}

          <div className="wizard-card__actions-spacer" />

          {currentStep < TOTAL_STEPS && (
            <button
              type="button"
              className="button button--primary"
              onClick={goToNextStep}
              disabled={!isCurrentStepValid}
              aria-disabled={!isCurrentStepValid}
            >
              Next
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          )}

          {currentStep === TOTAL_STEPS && (
            <button type="submit" className="button button--primary">
              <Check size={16} strokeWidth={2} aria-hidden="true" />
              Submit
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}