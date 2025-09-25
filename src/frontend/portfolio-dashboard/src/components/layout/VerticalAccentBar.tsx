interface VerticalAccentBarProps {
  accent: string;
}

export function VerticalAccentBar({ accent }: VerticalAccentBarProps) {
  return <div className="vertical-accent" aria-hidden="true" data-accent={accent} />;
}
