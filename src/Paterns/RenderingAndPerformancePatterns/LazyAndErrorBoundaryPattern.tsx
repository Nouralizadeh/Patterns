import {
  Component,
  ErrorInfo,
  lazy,
  ReactNode,
  Suspense,
  useState,
} from "react";

// ============================================================================
// 1. Error Boundary Component (Class Component for Safety)
// ============================================================================
interface ErrorBoundaryProps {
  children: ReactNode; // Explicitly defining children here
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Pass the props interface as the first Generic parameter
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 [ErrorBoundary caught an error]:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg text-center">
          <p className="font-bold text-sm mb-2">
            Failed to load this section! 💥
          </p>
          <p className="text-xs font-mono bg-white dark:bg-slate-900 p-2 rounded border border-red-100 dark:border-red-950 mb-3">
            {this.state.error?.message || "ChunkLoadError or Rendering Error"}
          </p>
          <button
            onClick={this.handleReset}
            className="btn-denied m-0 text-xs px-3 py-1.5"
          >
            Try Again
          </button>
        </div>
      );
    }

    // Now TypeScript knows this.props.children exists and is a ReactNode
    return this.props.children;
  }
}

// ============================================================================
// 2. Heavy Component (Simulated for Lazy Loading)
// ============================================================================

// We simulate a component that crashes when a certain condition is met
interface HeavyWidgetProps {
  shouldCrash: boolean;
}

function HeavyWidget({ shouldCrash }: HeavyWidgetProps) {
  if (shouldCrash) {
    throw new Error("Critical rendering error inside HeavyWidget!");
  }

  return (
    <div className="dashed-border-container bg-slate-50 dark:bg-slate-800/50">
      <h3 className="label2 text-sm mb-2">⚡ Analytics Core Engine</h3>
      <p className="label1 text-xs">
        This heavy dashboard chunk was loaded on-demand using React.lazy!
      </p>
    </div>
  );
}

// Simulating a network delay so we can actually see the Suspense loader
const LazyHeavyWidget = lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { default: HeavyWidget };
});

// ============================================================================
// 3. Main Export for App.tsx
// ============================================================================
export default function LazyAndErrorBoundaryPattern() {
  const [showWidget, setShowWidget] = useState<boolean>(false);
  const [triggerCrash, setTriggerCrash] = useState<boolean>(false);

  return (
    <div className="elevated-container">
      <h2 className="title">Lazy & Error Boundary 🛡️</h2>
      <p className="label1 text-xs mb-6">
        Combines on-demand code splitting with isolated crash protection.
      </p>

      <div className="w-full space-y-4">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setShowWidget((prev) => !prev)}
            className="btn-primary m-0 text-xs"
          >
            {showWidget ? "Hide Widget" : "Load Heavy Widget"}
          </button>

          {showWidget && (
            <button
              onClick={() => setTriggerCrash((prev) => !prev)}
              className="btn-denied m-0 text-xs"
            >
              {triggerCrash ? "Fix Widget" : "Force Widget Error"}
            </button>
          )}
        </div>

        {showWidget && (
          /* Step 1: Wrap with ErrorBoundary to catch network/render failures */
          <ErrorBoundary>
            {/* Step 2: Wrap with Suspense to handle the chunk loading state */}
            <Suspense
              fallback={
                <p className="label2 text-xs text-center animate-pulse">
                  Downloading chunk (1.5s)...
                </p>
              }
            >
              <LazyHeavyWidget shouldCrash={triggerCrash} />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}
