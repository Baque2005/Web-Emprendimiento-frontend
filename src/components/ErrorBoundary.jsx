import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('UI crashed:', error);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    const message = typeof error?.message === 'string' && error.message.trim()
      ? error.message
      : 'Ocurrió un error inesperado en la interfaz.';

    return (
      <div className="min-h-screen bg-background">
        <div className="container py-16">
          <div className="max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <div>
                <AlertTitle>Algo salió mal</AlertTitle>
                <AlertDescription>
                  <p>{message}</p>
                </AlertDescription>
              </div>
            </Alert>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Recargar
              </Button>
              <Button variant="ghost" onClick={this.reset}>
                <RotateCcw className="h-4 w-4" />
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
