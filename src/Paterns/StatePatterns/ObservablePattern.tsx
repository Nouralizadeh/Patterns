import { useEffect, useState } from "react";

// ============================================================================
// 1. Observable Store Core
// ============================================================================
class StoreObservable<T> {
  private listeners: Set<(state: T) => void> = new Set();
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  // Get the current state value
  get(): T {
    return this.state;
  }

  // Update the state and notify all registered listeners
  set(nextState: T) {
    this.state = nextState;
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Register a listener to be notified on state changes
  subscribe(listener: (state: T) => void) {
    this.listeners.add(listener);
    // Return an unsubscribe function for easy cleanup
    return () => {
      this.listeners.delete(listener);
    };
  }
}

// Create a single global observable store instance for tracking likes count
const likesStore = new StoreObservable<number>(0);

// ============================================================================
// 2. Components Observing the State
// ============================================================================

// Component 1: Action button that mutates and displays the state
function LikeButton() {
  const [likes, setLikes] = useState(likesStore.get());

  useEffect(() => {
    // Subscribe to store updates on mount
    const unsubscribe = likesStore.subscribe((nextLikes) => {
      setLikes(nextLikes);
    });
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return (
    <div className="dashed-border-container">
      <p className="label1 mb-2">Component One (Mutates & Displays)</p>
      <button
        onClick={() => likesStore.set(likesStore.get() + 1)}
        className="btn-primary"
      >
        👍 Like ({likes})
      </button>
    </div>
  );
}

// Component 2: Completely independent dashboard that syncs with the same state
function AnalyticsDashboard() {
  const [likes, setLikes] = useState(likesStore.get());

  useEffect(() => {
    // Subscribe to store updates on mount
    const unsubscribe = likesStore.subscribe((nextLikes) => {
      setLikes(nextLikes);
    });
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
      <p className="label1 text-sm">Analytics Dashboard (Component Two):</p>
      <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
        Total System Clicks: <span className="label2">{likes}</span>
      </p>
    </div>
  );
}

// ============================================================================
// 3. Main Export for App.tsx
// ============================================================================
export function ObservablePattern() {
  return (
    <div className="elevated-container">
      <h2 className="title">Observable Pattern 👀</h2>
      <div className="space-y-4">
        <LikeButton />
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
