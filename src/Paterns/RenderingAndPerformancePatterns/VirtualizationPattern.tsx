import { useState, useRef, UIEvent } from "react";

// ============================================================================
// 1. Setup Mock Data (10,000 items)
// ============================================================================
const TOTAL_ITEMS = 10000;
const ALL_ITEMS = Array.from(
  { length: TOTAL_ITEMS },
  (_, index) => `Item #${index + 1}`,
);

// Fixed dimensions for the virtualization logic
const ITEM_HEIGHT = 45; // Each row is exactly 45px high
const VIEWPORT_HEIGHT = 300; // The visible window box is 300px high

export default function VirtualizationPattern() {
  const [scrollTop, setScrollTop] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 2. Math Calculations for the Window Windowing
  // Calculate how many items can physically fit inside the visible view window
  const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ITEM_HEIGHT);

  // Find the index of the first item that should be visible based on scroll position
  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);

  // Find the index of the last item to render (plus a small buffer of 2 items for smooth scrolling)
  const endIndex = Math.min(TOTAL_ITEMS - 1, startIndex + visibleCount + 2);

  // Slice only the visible portion of data to render inside DOM
  const visibleItems = ALL_ITEMS.slice(startIndex, endIndex + 1);

  // Calculate the virtual layout metrics
  const totalHeight = TOTAL_ITEMS * ITEM_HEIGHT; // Theoretical height of the entire list
  const offsetY = startIndex * ITEM_HEIGHT; // Top spacing to keep the scrollbar position accurate

  // Track the scroll event inside the container
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div className="elevated-container">
      <h2 className="title">List Virtualization 🪟</h2>
      <p className="label1 text-xs mb-6">
        Rendering only visible items out of{" "}
        <span className="label2">{TOTAL_ITEMS} items</span> to save DOM
        performance.
      </p>

      {/* Viewport Wrapper: Has a fixed height and scrollbars */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height: `${VIEWPORT_HEIGHT}px` }}
        className="w-full overflow-y-auto border border-slate-200 dark:border-slate-600 rounded-xl relative"
      >
        {/* Total Scroll Area: This invisible inner div forces the browser scrollbar to look realistic */}
        <div style={{ height: `${totalHeight}px`, width: "100%" }}>
          {/* Transforming Container: Moves the actual rendered list item block perfectly along the scroll direction */}
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              left: 0,
              right: 0,
              top: 0,
              position: "absolute",
            }}
            className="px-2"
          >
            {visibleItems.map((item, index) => {
              const actualIndex = startIndex + index;
              return (
                <div
                  key={actualIndex}
                  style={{ height: `${ITEM_HEIGHT}px` }}
                  className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 text-sm"
                >
                  <span className="label1 font-medium">{item}</span>
                  <span className="text-xs text-slate-400 font-mono">
                    DOM Index: {actualIndex}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="succsess mt-4 w-full">
        DOM Elements Rendered:{" "}
        <span className="font-bold">
          {visibleItems.length} / {TOTAL_ITEMS}
        </span>
      </div>
    </div>
  );
}
