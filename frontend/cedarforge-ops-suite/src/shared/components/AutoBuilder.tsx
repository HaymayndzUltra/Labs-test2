import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Stepper } from "@shared/components/Stepper";
import { Card } from "@shared/components/Card";
import { Check } from "lucide-react";
import clsx from "classnames";

export interface AutomationDraft {
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  cadence: string;
  dryRun: boolean;
}

const defaultValues: AutomationDraft = {
  name: "",
  trigger: "threshold",
  conditions: [],
  actions: ["notify"],
  cadence: "hourly",
  dryRun: true,
};

const triggerOptions = [
  { value: "schedule", label: "Schedule" },
  { value: "threshold", label: "Threshold" },
  { value: "anomaly", label: "Anomaly" },
  { value: "webhook", label: "Webhook" },
  { value: "manual", label: "Manual" },
];

const conditionOptions = [
  "Segment: enterprise",
  "Region: NAMER",
  "Severity ≥ High",
  "Budget usage ≥ 80%",
  "Quiet hours respect",
];

const actionOptions = [
  { value: "notify", label: "Notify (Slack/Email/SMS)" },
  { value: "ticket", label: "Create ticket" },
  { value: "webhook", label: "Call webhook" },
  { value: "schedule", label: "Schedule retry" },
];

const cadenceOptions = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

interface AutoBuilderProps {
  onSubmit?: (draft: AutomationDraft) => Promise<void> | void;
}

export const AutoBuilder = ({ onSubmit }: AutoBuilderProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const {
    handleSubmit,
    control,
    watch,
    register,
    formState: { errors },
  } = useForm<AutomationDraft>({ defaultValues });

  const steps = [
    { id: "trigger", title: "Trigger", status: stepIndex > 0 ? "complete" : "current" },
    { id: "conditions", title: "Conditions", status: stepIndex > 1 ? "complete" : stepIndex === 1 ? "current" : "upcoming" },
    { id: "actions", title: "Actions", status: stepIndex > 2 ? "complete" : stepIndex === 2 ? "current" : "upcoming" },
    { id: "cadence", title: "Cadence", status: stepIndex === 3 ? "current" : "upcoming" },
  ];

  const currentTrigger = watch("trigger");
  const selectedActions = watch("actions");

  const submit = handleSubmit(async (data) => {
    await onSubmit?.(data);
  });

  return (
    <form
      className="space-y-6"
      onSubmit={submit}
      aria-labelledby="automation-builder"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="automation-builder" className="text-xl font-semibold text-text-primary">
            Automation Builder
          </h2>
          <p className="text-sm text-text-muted">
            Compose guardrailed automations with dependency checks and dry-runs.
          </p>
        </div>
        <Stepper steps={steps} />
      </div>

      <Card title="Metadata" padding="md">
        <label className="flex flex-col gap-2 text-sm text-text-secondary">
          Automation name
          <input
            type="text"
            className="h-11 rounded-md border border-line-strong bg-background-card px-3"
            placeholder="Leakage detector for EU BIN"
            {...register("name", { required: true })}
          />
        </label>
      </Card>

      {stepIndex === 0 && (
        <Card title="Select a trigger" subtitle="Pick how this automation starts" padding="md">
          <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label="Trigger type">
            {triggerOptions.map((option) => (
              <label
                key={option.value}
                className={clsx(
                  "flex min-h-[88px] cursor-pointer items-start gap-3 rounded-lg border border-line-soft bg-background-card p-4",
                  currentTrigger === option.value && "border-accent-energy shadow-elevation1"
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="mt-1 h-4 w-4"
                  {...register("trigger", { required: true })}
                />
                <div>
                  <p className="text-sm font-semibold text-text-primary">{option.label}</p>
                  <p className="text-xs text-text-muted">Supports guardrails and dependency checks.</p>
                </div>
              </label>
            ))}
          </div>
        </Card>
      )}

      {stepIndex === 1 && (
        <Card title="Define conditions" subtitle="Refine scope with guardrails" padding="md">
          <fieldset className="space-y-3">
            {conditionOptions.map((condition) => (
              <label key={condition} className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="conditions"
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={field.value.includes(condition)}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...field.value, condition]
                          : field.value.filter((item) => item !== condition);
                        field.onChange(next);
                      }}
                    />
                  )}
                />
                <span className="text-sm text-text-secondary">{condition}</span>
              </label>
            ))}
          </fieldset>
        </Card>
      )}

      {stepIndex === 2 && (
        <Card title="Choose actions" subtitle="Configure the downstream effect" padding="md">
          <fieldset className="grid gap-3 md:grid-cols-2">
            {actionOptions.map((action) => (
              <label
                key={action.value}
                className={clsx(
                  "flex min-h-[72px] cursor-pointer items-center gap-3 rounded-lg border border-line-soft bg-background-card p-4",
                  selectedActions.includes(action.value) && "border-accent-logistics shadow-elevation1"
                )}
              >
                <Controller
                  control={control}
                  name="actions"
                  render={({ field }) => {
                    const checked = field.value.includes(action.value);
                    return (
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={checked}
                        onChange={(event) => {
                          const next = event.target.checked
                            ? [...field.value, action.value]
                            : field.value.filter((item) => item !== action.value);
                          field.onChange(next);
                        }}
                      />
                    );
                  }}
                />
                <span className="text-sm text-text-secondary">{action.label}</span>
              </label>
            ))}
          </fieldset>
        </Card>
      )}

      {stepIndex === 3 && (
        <Card title="Cadence & safeguards" subtitle="Prevent runaway automations" padding="md">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-text-secondary">
              Frequency
              <select
                className="h-11 rounded-md border border-line-strong bg-background-card px-3"
                {...register("cadence", { required: true })}
              >
                {cadenceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" className="h-4 w-4" {...register("dryRun")} />
              Dry-run with preview
            </label>
          </div>
          <div className="mt-4 rounded-lg border border-line-soft bg-background-raised p-4 text-sm text-text-secondary">
            <p className="font-semibold text-text-primary">Dry-run preview</p>
            <ul className="mt-2 space-y-1">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-accent-energy" />
                Would notify collectors channel and attach leakage diff.
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-accent-energy" />
                Frequency cap: 2 per entity per day.
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-accent-energy" />
                Quiet hours: 10pm–6am local respected.
              </li>
            </ul>
          </div>
        </Card>
      )}

      {errors.name && <p className="text-sm text-carmine-500">Name is required.</p>}

      <div className="flex items-center justify-between border-t border-line-soft pt-4">
        <button
          type="button"
          className="rounded-md border border-line-soft px-4 py-2 text-sm font-semibold text-text-primary disabled:opacity-60"
          onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
          disabled={stepIndex === 0}
        >
          Back
        </button>
        <div className="flex items-center gap-3">
          {stepIndex < steps.length - 1 && (
            <button
              type="button"
              className="rounded-md border border-line-strong bg-background-card px-4 py-2 text-sm font-semibold text-text-primary"
              onClick={() => setStepIndex((index) => Math.min(steps.length - 1, index + 1))}
            >
              Continue
            </button>
          )}
          {stepIndex === steps.length - 1 && (
            <button
              type="submit"
              className="rounded-md bg-accent-energy px-5 py-2 text-sm font-semibold text-white shadow-elevation1"
            >
              Launch automation
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
