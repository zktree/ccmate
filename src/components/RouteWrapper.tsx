import { Suspense, ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { QueryErrorFallback } from "./QueryErrorFallback";

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

interface RouteWrapperProps {
  children: ReactNode;
}

export function RouteWrapper({ children }: RouteWrapperProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }: FallbackProps) => (
            <QueryErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

