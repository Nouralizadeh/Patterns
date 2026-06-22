import { useState } from "react";

// ============================================================================
// 1. Define the Component Variant Specifications (The Factory Outputs)
// ============================================================================
interface NotificationProps {
  title: string;
  message: string;
  onAction: () => void;
}

function SuccessNotification({ title, message, onAction }: NotificationProps) {
  return (
    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl flex justify-between items-center animate-fadeIn">
      <div className="text-left">
        <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
          🟢 {title}
        </h4>
        <p className="text-[11px] text-emerald-700/80 dark:text-emerald-500 mt-0.5">
          {message}
        </p>
      </div>
      <button
        onClick={onAction}
        className="btn-primary m-0 text-[10px] bg-emerald-600 hover:bg-emerald-700 border-none px-3 py-1"
      >
        Dismiss
      </button>
    </div>
  );
}

function WarningNotification({ title, message, onAction }: NotificationProps) {
  return (
    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl flex justify-between items-center animate-fadeIn">
      <div className="text-left">
        <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">
          ⚠️ {title}
        </h4>
        <p className="text-[11px] text-amber-700/80 dark:text-amber-500 mt-0.5">
          {message}
        </p>
      </div>
      <button
        onClick={onAction}
        className="btn-primary m-0 text-[10px] bg-amber-600 hover:bg-amber-700 border-none px-3 py-1"
      >
        Fix Now
      </button>
    </div>
  );
}

function ErrorNotification({ title, message, onAction }: NotificationProps) {
  return (
    <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl flex justify-between items-center animate-fadeIn">
      <div className="text-left">
        <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400">
          🚨 {title}
        </h4>
        <p className="text-[11px] text-rose-700/80 dark:text-rose-500 mt-0.5">
          {message}
        </p>
      </div>
      <button
        onClick={onAction}
        className="btn-primary m-0 text-[10px] bg-rose-600 hover:bg-rose-700 border-none px-3 py-1"
      >
        Retry Request
      </button>
    </div>
  );
}

// ============================================================================
// 2. The Factory Component (The Orchestrator Factory)
// ============================================================================
type NotificationType = "SUCCESS" | "WARNING" | "ERROR";

interface NotificationFactoryProps extends NotificationProps {
  type: NotificationType;
}

function NotificationFactory({ type, ...props }: NotificationFactoryProps) {
  // The Factory decides which exact UI component class/blueprint to construct
  switch (type) {
    case "SUCCESS":
      return <SuccessNotification {...props} />;
    case "WARNING":
      return <WarningNotification {...props} />;
    case "ERROR":
      return <ErrorNotification {...props} />;
    default:
      return null;
  }
}

// ============================================================================
// 3. Main Consumer Layer
// ============================================================================
export default function FactoryPattern() {
  const [logMessage, setLogMessage] = useState<string>(
    "Click any banner action button...",
  );

  const handleAction = (variant: string) => {
    setLogMessage(`Action executed from the [${variant}] factory module!`);
  };

  return (
    <div className="elevated-container max-w-md">
      <h2 className="title">Factory Design Pattern 🏭</h2>
      <p className="label1 text-xs mb-6">
        Centralized component instantiation based on dynamic configuration
        types.
      </p>

      {/* The Factory producing 3 distinct variants from a single core component contract */}
      <div className="w-full space-y-3">
        <NotificationFactory
          type="SUCCESS"
          title="Payment Settled"
          message="Transaction completed successfully."
          onAction={() => handleAction("SUCCESS")}
        />

        <NotificationFactory
          type="WARNING"
          title="Backup Delayed"
          message="Cloud synchronization is taking longer than expected."
          onAction={() => handleAction("WARNING")}
        />

        <NotificationFactory
          type="ERROR"
          title="Gateway Timeout"
          message="Failed to establish secure handshake with banking node."
          onAction={() => handleAction("ERROR")}
        />

        {/* Live UX Feedback Log */}
        <div className="p-2.5 mt-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-center font-mono text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
          Console: {logMessage}
        </div>
      </div>
    </div>
  );
}
