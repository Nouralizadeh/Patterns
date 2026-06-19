import { useState, memo, useCallback, useMemo } from "react";

// ============================================================================
// 1. Expensive Child Component (Optimized with memo)
// ============================================================================
interface ListProps {
  items: string[];
  onItemClick: (item: string) => void;
}

// memo ensures this component ONLY re-renders if items or onItemClick references change
const ExpensiveList = memo(function ExpensiveList({
  items,
  onItemClick,
}: ListProps) {
  console.log("✏️ [Rendering] ExpensiveList...");

  return (
    <div className="dashed-border-container w-full mt-4">
      <p className="label1 mb-3 text-xs font-semibold">
        Optimized List (Renders only when items/functions change)
      </p>
      <ul className="space-y-2 w-full text-left">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded-lg"
          >
            <span className="label2 text-sm">{item}</span>
            <button
              onClick={() => onItemClick(item)}
              className="btn-primary text-xs px-2 py-1 m-0"
            >
              Select
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

// ============================================================================
// 2. Main Container (Parent Component)
// ============================================================================
export default function MemoizationPattern() {
  const [text, setText] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // useMemo: Caches the array reference so it doesn't recreate on every keystroke
  const heavyData = useMemo(() => {
    return [
      "Advanced React Patterns",
      "Performance Optimization",
      "Clean UI Architecture",
    ];
  }, []);

  // useCallback: Caches the function reference to prevent ExpensiveList from breaking its memo
  const handleItemSelect = useCallback((item: string) => {
    setSelectedItem(item);
  }, []);

  return (
    <div className="elevated-container">
      <h2 className="title">Memoization Pattern ⚡</h2>
      <p className="label1 text-xs mb-6">
        Type in the input below. Notice that the list component below does NOT
        re-render on keystrokes!
      </p>

      <div className="w-full space-y-4">
        {/* Changing this text triggers Parent re-render, but Child is protected */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type to test parent state changes..."
          className="input-standard"
        />

        {selectedItem && (
          <div className="succsess mt-2">
            Selected:{" "}
            <span className="font-bold text-emerald-900">{selectedItem}</span>
          </div>
        )}

        {/* Passing memoized data and memoized callback */}
        <ExpensiveList items={heavyData} onItemClick={handleItemSelect} />
      </div>
    </div>
  );
}
