import { useState, useEffect } from "react";

// ============================================================================
// 1. Global Cache Store (Outside of React Lifecycle)
// ============================================================================
interface CacheMemory {
  [key: string]: any;
}
const globalQueryCache: CacheMemory = {};

// ============================================================================
// 2. The Custom Data Fetching & Cache Hook
// ============================================================================
function useQuery<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(globalQueryCache[key] || null);
  const [isLoading, setIsLoading] = useState<boolean>(!globalQueryCache[key]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If data is already in cache, don't trigger loading UI, just sync it
    if (globalQueryCache[key]) {
      setData(globalQueryCache[key]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetcher()
      .then((result) => {
        if (isMounted) {
          globalQueryCache[key] = result; // Save to global memory
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "An error occurred");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [key]); // Re-run only if cache key changes

  // Function to manually clear cache and re-fetch
  const invalidate = () => {
    delete globalQueryCache[key];
    setIsLoading(true);
    // Tiny state trigger to force re-render and re-run useEffect
    setData(null);
  };

  return { data, isLoading, error, invalidate };
}

// ============================================================================
// 3. Dummy API Fetcher Function
// ============================================================================
interface Post {
  id: number;
  title: string;
}

const mockFetchPosts = async (): Promise<Post[]> => {
  // Simulate 1.5 seconds network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return [
    { id: 1, title: "Mastering React Client-Side Caching" },
    { id: 2, title: "Architecting Scalable Front-End Systems" },
  ];
};

// ============================================================================
// 4. Sub-Component to Test Re-mounting Behavior
// ============================================================================
function PostsList() {
  // Utilizing our custom hook with a unique cache key
  const { data, isLoading, invalidate } = useQuery<Post[]>(
    "posts_list",
    mockFetchPosts,
  );

  if (isLoading) {
    return (
      <p className="label2 text-xs text-center animate-pulse py-4">
        Fetching from network (1.5s)...
      </p>
    );
  }

  return (
    <div className="space-y-3 text-left">
      <ul className="space-y-2">
        {data?.map((post) => (
          <li
            key={post.id}
            className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/40 text-xs"
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <button
          onClick={invalidate}
          className="btn-denied text-[10px] px-2 py-1 m-0"
        >
          Invalidate (Clear Cache)
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 5. Main Export Component
// ============================================================================
export default function DataFetchingCachePattern() {
  const [isComponentRendered, setIsComponentRendered] = useState<boolean>(true);

  return (
    <div className="elevated-container">
      <h2 className="title">Data Cache Pattern 💾</h2>
      <p className="label1 text-xs mb-6">
        Simulates React Query cache. Toggle the component off and on to see that
        it loads instantly without hitting the network again!
      </p>

      <div className="w-full space-y-4">
        <div className="flex justify-center">
          <button
            onClick={() => setIsComponentRendered((prev) => !prev)}
            className="btn-primary text-xs m-0"
          >
            {isComponentRendered ? "Unmount Component" : "Mount Component"}
          </button>
        </div>

        <div className="dashed-border-container min-h-[140px] flex flex-col justify-center">
          {isComponentRendered ? (
            <PostsList />
          ) : (
            <p className="text-xs text-slate-400 text-center italic">
              Component is unmounted. Memory cache is still preserved!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
