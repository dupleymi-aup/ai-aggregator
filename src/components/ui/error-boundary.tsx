'use client';

import { Component, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Что-то пошло не так</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              {error?.message || 'Неизвестная ошибка при рендеринге компонента'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={this.resetErrorBoundary}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Попробовать снова
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && error && (
            <details className="w-full max-w-lg mt-4 text-left">
              <summary className="cursor-pointer text-xs text-muted-foreground">
                Детали ошибки (dev)
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto text-left">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return children;
  }
}
