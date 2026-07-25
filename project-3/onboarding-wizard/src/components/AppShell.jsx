import { ShieldCheck } from 'lucide-react'

const CONTEXT_STEPS = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Account Setup' },
  { id: 3, label: 'Review' },
]

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Onboarding context">
        <div className="app-sidebar__brand">
          <div className="app-sidebar__logo" aria-hidden="true">
            N
          </div>
          <span className="app-sidebar__brand-name">Northstar</span>
        </div>

        <div className="app-sidebar__context">
          <p className="app-sidebar__eyebrow">Workspace setup</p>
          <h1 className="app-sidebar__heading">
            Set up your workspace account
          </h1>
          <p className="app-sidebar__description">
            This should take about two minutes. You can review everything
            before it&apos;s submitted.
          </p>
        </div>

        <ul className="app-sidebar__steps">
          {CONTEXT_STEPS.map((step) => (
            <li key={step.id} className="app-sidebar__step">
              <span className="app-sidebar__step-index">{step.id}</span>
              <span>{step.label}</span>
            </li>
          ))}
        </ul>

        <div className="app-sidebar__trust">
          <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
          <p>
            Your information is used only to set up this workspace and is
            never shared with third parties.
          </p>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-main__inner">{children}</div>
      </main>
    </div>
  )
}