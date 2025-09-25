import { PropsWithChildren, ReactNode } from "react";
import clsx from "classnames";

interface CardProps extends PropsWithChildren {
  title?: string;
  actions?: ReactNode;
  subtitle?: string;
  padding?: "md" | "lg";
}

export const Card = ({
  title,
  subtitle,
  actions,
  padding = "lg",
  children,
}: CardProps) => {
  return (
    <section
      className={clsx(
        "rounded-lg bg-background-card shadow-elevation1 border border-line-soft",
        padding === "lg" ? "p-6" : "p-5",
        "transition-shadow duration-200 ease-in-out focus-within:shadow-elevation2"
      )}
      role={title ? "region" : undefined}
      aria-label={title}
    >
      {(title || actions || subtitle) && (
        <header className="flex items-start justify-between gap-4 pb-4">
          <div>
            {title && (
              <h3 className="text-[16px] leading-6 font-semibold tracking-tight text-text-primary">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm leading-5 text-text-muted">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="space-y-4">{children}</div>
    </section>
  );
};
