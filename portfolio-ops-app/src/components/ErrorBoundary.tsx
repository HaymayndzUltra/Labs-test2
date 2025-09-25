import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="card-surface flex flex-col gap-3">
          <h3 className="text-[16px] font-semibold text-danger-500">Something went wrong</h3>
          <p className="text-[14px] text-[var(--color-text-muted)]">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            className="w-fit rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
