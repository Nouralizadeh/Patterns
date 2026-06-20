import { Suspense } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useSuspenseQuery,
} from "@tanstack/react-query";

// 1. Initialize the global Query Client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Turned off for easy local testing
    },
  },
});

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// 2. Mock API function with intentional network latency
const fetchServerTodo = async (): Promise<Todo> => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
  return {
    id: 101,
    title: "Implement Production-Ready React Query Suspense Architecture",
    completed: false,
  };
};

// ============================================================================
// 3. The Core Component (Notice: No isLoading or error handling here!)
// ============================================================================
function TodoDetails() {
  // useSuspenseQuery automatically integrates with React's native <Suspense>
  // It guarantees that 'data' is defined when the component renders!
  const { data } = useSuspenseQuery<Todo>({
    queryKey: ["suspense_todo"],
    queryFn: fetchServerTodo,
  });

  return (
    <div className="dashed-border-container bg-slate-50 dark:bg-slate-800/60 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-indigo-500 uppercase font-mono">
          Task Received
        </span>
        <span className="bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-medium">
          Pending
        </span>
      </div>
      <h3 className="label2 text-sm mt-2 font-semibold">{data.title}</h3>
      <p className="text-[11px] text-slate-400 mt-1">
        ID Location: Backend Database Node #{data.id}
      </p>
    </div>
  );
}

// ============================================================================
// 4. Main Export & Orchestration Layout
// ============================================================================
export default function SuspensePattern() {
  return (
    // Wrap with Provider so React Query works flawlessly inside the test environment
    <QueryClientProvider client={queryClient}>
      <div className="elevated-container">
        <h2 className="title">Suspense Architecture ⏳</h2>
        <p className="label1 text-xs mb-6">
          Using <span className="label2">@tanstack/react-query</span>'s suspense
          hook to completely separate data fetching from loading layouts.
        </p>

        <div className="w-full">
          {/* The orchestrator controls the loading layout right here. 
            The Child component inside (TodoDetails) stays 100% clean and focus-driven.
          */}
          <Suspense
            fallback={
              <div className="dashed-border-container border-slate-200 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col items-center justify-center py-6 animate-pulse">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="label2 text-[11px]">
                  Streaming asynchronous query stream (2.0s)...
                </p>
              </div>
            }
          >
            <TodoDetails />
          </Suspense>
        </div>
      </div>
    </QueryClientProvider>
  );
}
