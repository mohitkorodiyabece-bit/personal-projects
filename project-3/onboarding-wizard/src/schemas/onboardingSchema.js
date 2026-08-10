import { z } from 'zod'

// Regex patterns, defined once and reused so validation rules are not duplicated
// across the schema.
const NAME_REGEX = /^[A-Za-z]+(?:[' -][A-Za-z]+)*(?: [A-Za-z]+(?:[' -][A-Za-z]+)*)+$/
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/
const UPPERCASE_REGEX = /[A-Z]/
const LOWERCASE_REGEX = /[a-z]/
const NUMBER_REGEX = /[0-9]/

function isNotFutureDate(value) {
  if (!value) return false
  const inputDate = new Date(value)
  if (Number.isNaN(inputDate.getTime())) return false

  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return inputDate.getTime() <= today.getTime()
}

function isReasonableBirthYear(value) {
  if (!value) return false
  const inputDate = new Date(value)
  if (Number.isNaN(inputDate.getTime())) return false

  const earliestAllowed = new Date()
  earliestAllowed.setFullYear(earliestAllowed.getFullYear() - 120)
  return inputDate.getTime() >= earliestAllowed.getTime()
}

// ---- Step 1: Personal Information ----
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required.')
    .min(3, 'Full name must be at least 3 characters.')
    .max(80, 'Full name must be under 80 characters.')
    .regex(
      NAME_REGEX,
      'Enter your first and last name using letters only.'
    ),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required.')
    .regex(
      INDIAN_MOBILE_REGEX,
      'Enter a valid 10-digit mobile number.'
    ),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required.')
    .refine(isNotFutureDate, 'Date of birth cannot be in the future.')
    .refine(
      isReasonableBirthYear,
      'Enter a valid date of birth.'
    ),
})

// ---- Step 2: Account Details ----
export const accountDetailsSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, 'Username is required.')
      .min(4, 'Username must be at least 4 characters.')
      .max(24, 'Username must be under 24 characters.')
      .regex(
        USERNAME_REGEX,
        'Use only letters, numbers, and underscores.'
      ),
    password: z
      .string()
      .min(1, 'Password is required.')
      .min(8, 'Password must be at least 8 characters.')
      .regex(UPPERCASE_REGEX, 'Include at least one uppercase letter.')
      .regex(LOWERCASE_REGEX, 'Include at least one lowercase letter.')
      .regex(NUMBER_REGEX, 'Include at least one number.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

// ---- Full onboarding schema (Step 1 + Step 2 merged) ----
// Step 3 (Review) has no new fields of its own; it validates the union of
// everything collected so far before final submission.
export const onboardingSchema = personalInfoSchema.and(accountDetailsSchema)

export const defaultOnboardingValues = {
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  username: '',
  password: '',
  confirmPassword: '',
}

// Field groups used by the wizard to run step-scoped validation with
// react-hook-form's `trigger()`, so Next only checks the fields relevant to
// the step currently on screen.
export const STEP_FIELDS = {
  1: ['fullName', 'email', 'phone', 'dateOfBirth'],
  2: ['username', 'password', 'confirmPassword'],
}