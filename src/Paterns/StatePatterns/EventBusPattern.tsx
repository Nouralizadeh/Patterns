import { useEffect, useState } from "react";

// ============================================================================
// 1. Event Bus Core Logic
// ============================================================================
type Callback = (data: any) => void;

class EventBus {
  private events: { [key: string]: Callback[] } = {};

  // Subscribe to an event
  on(event: string, callback: Callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // Unsubscribe from an event
  off(event: string, callback: Callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  // Emit/trigger an event
  emit(event: string, data?: any) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  }
}

// Create a single global instance of the bus
export const globalEventBus = new EventBus();

// ============================================================================
// 2. Components Using the Event Bus
// ============================================================================

// Sender Component: Triggers a notification signal
function ActionComponent() {
  const triggerNotification = () => {
    globalEventBus.emit("SHOW_TOAST", "Operation completed successfully! 🎉");
  };

  return (
    <div className="p-4 border border-dashed rounded-xl border-slate-300 dark:border-slate-500">
      <p className="label1 mb-2">
        Sender Component (No direct link to receiver)
      </p>
      <button onClick={triggerNotification} className="btn-accept">
        Trigger Global Signal
      </button>
    </div>
  );
}

// Receiver Component: Listens for the notification signal
function NotificationToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleToast = (msg: string) => {
      setMessage(msg);
      // Auto-hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    };

    // Listen to this specific event
    globalEventBus.on("SHOW_TOAST", handleToast);

    // Cleanup to prevent memory leaks
    return () => {
      globalEventBus.off("SHOW_TOAST", handleToast);
    };
  }, []);

  if (!message)
    return <p className="label2 text-center">Waiting for event...</p>;

  return <div className="succsess">{message}</div>;
}

// ============================================================================
// 3. Main Export for App.tsx
// ============================================================================
export function EventBusPattern() {
  return (
    <div className="elevated-container">
      <h2 className="title">Event Bus Pattern 🚌</h2>
      <div className="space-y-6">
        <ActionComponent />
        <NotificationToast />
      </div>
    </div>
  );
}
