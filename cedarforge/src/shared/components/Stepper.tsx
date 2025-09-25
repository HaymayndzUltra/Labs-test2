import clsx from 'clsx';

export type StepperStep = {
  id: string;
  label: string;
  description?: string;
};

type StepperProps = {
  steps: StepperStep[];
  active: string;
  onChange: (id: string) => void;
};

export function Stepper({ steps, active, onChange }: StepperProps) {
  return (
    <ol className="flex gap-4" role="list">
      {steps.map((step, index) => {
        const completed = steps.findIndex((item) => item.id === active) > index;
        const current = step.id === active;
        return (
          <li key={step.id} className="flex flex-1 items-center gap-3">
            <button
              type="button"
              className={clsx(
                'flex h-11 flex-1 items-center justify-between rounded-[16px] border-[1.5px] px-4 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--focus-ring)]',
                completed
                  ? 'border-jade-400 text-jade-300'
                  : current
                  ? 'border-[color:var(--accent-finops)] text-[color:var(--accent-finops)]'
                  : 'border-[color:var(--line-soft)] text-[color:var(--text-secondary)]'
              )}
              onClick={() => onChange(step.id)}
              aria-current={current ? 'step' : undefined}
            >
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide">Step {index + 1}</span>
                <span className="block text-sm">{step.label}</span>
              </span>
              <span className="text-xs text-[color:var(--text-secondary)]">{step.description}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
