import clsx from "classnames";

export interface Step {
  id: string;
  title: string;
  description?: string;
  status: "complete" | "current" | "upcoming";
}

interface StepperProps {
  steps: Step[];
  orientation?: "horizontal" | "vertical";
}

export const Stepper = ({ steps, orientation = "horizontal" }: StepperProps) => {
  const isHorizontal = orientation === "horizontal";
  return (
    <ol
      className={clsx(
        "flex gap-6",
        isHorizontal ? "flex-row" : "flex-col"
      )}
      aria-label="Progress"
    >
      {steps.map((step, index) => (
        <li
          key={step.id}
          className={clsx(
            "relative flex items-start gap-3",
            isHorizontal && "flex-1"
          )}
        >
          <span
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-full border-2 font-semibold",
              step.status === "complete" && "border-emerald-500 bg-emerald-500 text-white",
              step.status === "current" && "border-accent-energy text-text-primary",
              step.status === "upcoming" && "border-line-soft text-text-muted"
            )}
            aria-hidden
          >
            {step.status === "complete" ? "✓" : index + 1}
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text-primary">{step.title}</p>
            {step.description && (
              <p className="text-xs text-text-muted">{step.description}</p>
            )}
          </div>
          {index < steps.length - 1 && (
            <span
              className={clsx(
                "absolute left-[18px] top-9 block",
                isHorizontal ? "h-0.5 w-full bg-line-soft" : "h-full w-0.5 bg-line-soft"
              )}
              aria-hidden
            />
          )}
        </li>
      ))}
    </ol>
  );
};
