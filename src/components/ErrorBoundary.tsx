import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div style={{ padding: 24, color: '#f3efe4', fontFamily: 'system-ui' }}>
          <p style={{ fontSize: 32 }}>⚠️</p>
          <p>{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
