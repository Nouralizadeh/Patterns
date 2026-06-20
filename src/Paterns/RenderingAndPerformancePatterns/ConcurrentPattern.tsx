import { useState, useTransition, ChangeEvent } from "react";

// ============================================================================
// 1. Generate Dummy Data (10,000 items)
// ============================================================================
const BIG_LIST = Array.from(
  { length: 10000 },
  (_, i) => `Product Schema Entry # ${i + 1}`,
);

export default function ConcurrentPattern() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredList, setFilteredList] = useState<string[]>(BIG_LIST);

  // isPending: true when the background transition is actively rendering
  // startTransition: wraps the non-urgent state update
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Urgent Update: Update the input field immediately so the user sees what they type
    setSearchTerm(value);

    // Non-Urgent Update: Tell React to filter the heavy 10k list in the background
    startTransition(() => {
      // Artificial heavy loop inside the filter to maximize rendering stress
      const filtered = BIG_LIST.filter((item) => {
        const startTime = performance.now();
        while (performance.now() - startTime < 0.05) {
          // Intentionally wasting microseconds to simulate a heavy UI component
        }
        return item.toLowerCase().includes(value.toLowerCase());
      });

      setFilteredList(filtered);
    });
  };

  return (
    <div className="elevated-container">
      <h2 className="title">Concurrent Rendering 🏎️</h2>
      <p className="label1 text-xs mb-6">
        Keeps the UI responsive during massive data filtration using{" "}
        <span className="label2">useTransition</span>.
      </p>

      <div className="w-full space-y-4">
        {/* Input stays 100% fluid and responsive because filtering doesn't block it */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Type fast to filter 10,000 heavy rows..."
            className="input-standard"
          />
          {isPending && (
            <span className="absolute right-4 top-3.5 text-xs text-amber-500 font-medium animate-pulse">
              Filtering...
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-400 text-left">
          Matches Found:{" "}
          <span className="font-mono font-bold text-slate-600">
            {filteredList.length}
          </span>
        </p>

        {/* The rendered list container */}
        <div
          className={`w-full max-h-[180px] overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-xl px-2 py-1 ${
            isPending ? "opacity-50 transition-opacity" : ""
          }`}
        >
          {filteredList.slice(0, 100).map((item, index) => (
            <div
              key={index}
              className="py-1 text-xs text-left border-b border-slate-50 dark:border-slate-800 font-mono text-slate-600 dark:text-slate-400"
            >
              {item}
            </div>
          ))}
          {filteredList.length > 100 && (
            <p className="text-[10px] text-slate-400 text-center mt-2 italic">
              Showing first 100 rows only...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
