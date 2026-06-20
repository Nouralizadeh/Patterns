import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

// 1. Initialize the Query Client
const queryClient = new QueryClient();

interface Article {
  id: number;
  title: string;
  body: string;
}

// 2. Mock API simulation with 1-second delay
const fetchArticleFromServer = async (id: number): Promise<Article> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    id,
    title: `Deep Dive into Pattern Architecture #${id}`,
    body: "This technical document contains verified production strategies for front-end engineers...",
  };
};

// ============================================================================
// 3. Main Orchestrator Component
// ============================================================================
export default function PrefetchPattern() {
  const [activeId, setActiveId] = useState<number | null>(null);

  // This function triggers as soon as the user hovers over a button
  const handlePrefetch = async (id: number) => {
    // Prefetch the data and store it in the React Query cache
    await queryClient.prefetchQuery({
      queryKey: ["article", id],
      queryFn: () => fetchArticleFromServer(id),
      staleTime: 10000, // Data stays fresh for 10 seconds
    });
    console.log(`🎯 Prefetched data for Article #${id} into cache!`);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="elevated-container">
        <h2 className="title">Preload / Prefetch Pattern 🚀</h2>
        <p className="label1 text-xs mb-6">
          Hover over the buttons below. React Query will prefetch the data
          instantly, making the actual click feel lightning fast.
        </p>

        <div className="w-full space-y-6">
          {/* Action Buttons with onMouseEnter events */}
          <div className="flex justify-center gap-4">
            {[1, 2].map((id) => (
              <button
                key={id}
                onMouseEnter={() => handlePrefetch(id)} // Trigger prefetch on hover
                onClick={() => setActiveId(id)}
                className={`text-xs px-3 py-2 m-0 transition-all ${
                  activeId === id ? "btn-primary" : "btn-secondary"
                }`}
              >
                Article #{id}
              </button>
            ))}
          </div>

          {/* Render Area */}
          <div className="dashed-border-container min-h-[140px] flex flex-col justify-center bg-slate-50/50 dark:bg-slate-800/20">
            {activeId ? (
              <ArticleDisplay id={activeId} />
            ) : (
              <p className="text-xs text-slate-400 text-center italic">
                Hover over a button to prefetch, then click to view instantly.
              </p>
            )}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

// ============================================================================
// 4. Sub-component to consumer the query data
// ============================================================================
function ArticleDisplay({ id }: { id: number }) {
  // If data was prefetched during hover, isLoading will immediately be false!
  const { data, isLoading } = useQuery<Article>({
    queryKey: ["article", id],
    queryFn: () => fetchArticleFromServer(id),
    staleTime: 10000,
  });

  if (isLoading) {
    return (
      <p className="label2 text-xs text-center animate-pulse">
        Fetching from network (1.0s)...
      </p>
    );
  }

  return (
    <div className="text-left animate-fadeIn">
      <h3 className="label2 font-bold text-sm text-indigo-600 dark:text-indigo-400">
        {data?.title}
      </h3>
      <p className="label1 text-xs mt-2 leading-relaxed">{data?.body}</p>
    </div>
  );
}
