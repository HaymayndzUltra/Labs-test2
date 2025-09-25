import { useState } from "react";
import { useToast } from "../toast/ToastContext";

export interface AutomationStep {
  id: string;
  label: string;
  description: string;
}

interface AutomationBuilderProps {
  triggerOptions: AutomationStep[];
  conditionOptions: AutomationStep[];
  actionOptions: AutomationStep[];
  cadenceOptions: AutomationStep[];
  onSave: (payload: AutomationPayload) => Promise<void>;
}

export interface AutomationPayload {
  trigger: string;
  conditions: string[];
  actions: string[];
  cadence: string;
  name: string;
}

export const AutomationBuilder: React.FC<AutomationBuilderProps> = ({
  triggerOptions,
  conditionOptions,
  actionOptions,
  cadenceOptions,
  onSave
}) => {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState(triggerOptions[0]?.id ?? "");
  const [conditions, setConditions] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [cadence, setCadence] = useState(cadenceOptions[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const toggleSelection = (value: string, setValue: (values: string[]) => void, values: string[]) => {
    setValue(values.includes(value) ? values.filter((id) => id !== value) : [...values, value]);
  };

  const handleSave = async () => {
    setLoading(true);
    const payload: AutomationPayload = { name, trigger, conditions, actions, cadence };
    const undoId = crypto.randomUUID();
    addToast({
      title: "Automation saved",
      description: "Changes will sync across modules.",
      tone: "success",
      actionLabel: "Undo",
      onAction: () => {
        window.dispatchEvent(new CustomEvent("automation:undo", { detail: { id: undoId, payload } }));
      }
    });
    try {
      await onSave(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
      style={{ display: "grid", gap: "24px" }}
    >
      <div>
        <label htmlFor="automation-name" style={labelStyle}>
          Automation name
        </label>
        <input
          id="automation-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          style={inputStyle}
        />
      </div>
      <StepSection title="Trigger" options={triggerOptions} selected={[trigger]} onToggle={(id) => setTrigger(id)} single />
      <StepSection title="Conditions" options={conditionOptions} selected={conditions} onToggle={(id) => toggleSelection(id, setConditions, conditions)} />
      <StepSection title="Actions" options={actionOptions} selected={actions} onToggle={(id) => toggleSelection(id, setActions, actions)} />
      <StepSection title="Cadence" options={cadenceOptions} selected={[cadence]} onToggle={(id) => setCadence(id)} single />
      <button type="submit" disabled={loading} className="focus-ring" style={submitStyle}>
        {loading ? "Saving…" : "Save automation"}
      </button>
    </form>
  );
};

interface StepSectionProps {
  title: string;
  options: AutomationStep[];
  selected: string[];
  onToggle: (id: string) => void;
  single?: boolean;
}

const StepSection: React.FC<StepSectionProps> = ({ title, options, selected, onToggle, single }) => (
  <fieldset style={{ border: "1px solid var(--border-color)", borderRadius: "16px", padding: "16px 20px" }}>
    <legend style={{ fontWeight: 600, fontSize: "14px" }}>{title}</legend>
    <div style={{ display: "grid", gap: "12px" }}>
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            role={single ? "radio" : "checkbox"}
            aria-checked={isSelected}
            onClick={() => onToggle(option.id)}
            style={{
              borderRadius: "12px",
              border: isSelected ? "2px solid var(--primary-500)" : "1px solid var(--border-color)",
              background: isSelected ? "var(--primary-50)" : "var(--surface-s1)",
              padding: "12px 16px",
              textAlign: "left",
              cursor: "pointer"
            }}
          >
            <span style={{ display: "block", fontWeight: 600 }}>{option.label}</span>
            <span style={{ display: "block", fontSize: "12px", color: "var(--text-secondary)" }}>{option.description}</span>
          </button>
        );
      })}
    </div>
  </fieldset>
);

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  color: "var(--text-secondary)",
  marginBottom: "8px"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "12px",
  border: "1px solid var(--border-color)",
  padding: "12px 16px",
  background: "var(--surface-s1)",
  color: "var(--text-primary)"
};

const submitStyle: React.CSSProperties = {
  borderRadius: "12px",
  padding: "14px 20px",
  border: "none",
  background: "var(--primary-500)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer"
};
