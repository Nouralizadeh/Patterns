import { useReducer, useState } from "react";

// --- Types ---
type ToggleEnable = boolean;
type ToggleAction = "TOGGLE" | "RESET";

// پیش‌فرضِ Reducer ما
const internalReducer = (
  state: ToggleEnable,
  action: ToggleAction,
): ToggleEnable => {
  switch (action) {
    case "TOGGLE":
      return !state;
    case "RESET":
      return false;
    default:
      throw new Error(`Unhandled action type`);
  }
};

// --- Custom Hook (The Engine) ---
type UseToggleProps = {
  reducer?: (state: ToggleEnable, action: ToggleAction) => ToggleEnable;
};

function useToggle({ reducer = internalReducer }: UseToggleProps = {}) {
  // استفاده از یک Reducer که می‌تواند از بیرون Override شود
  const [state, dispatch] = useReducer(reducer, false);

  const toggle = () => dispatch("TOGGLE");
  const reset = () => dispatch("RESET");

  return { on: state, toggle, reset };
}

// --- Implementation ---
export default function StateReducer() {
  const [clicksCount, setClicksCount] = useState(0);
  const maxClickCount = 8;

  // برنامه‌نویس تصمیم می‌گیرد منطق را تغییر دهد:
  // "بیش از 8 بار کلیک شد، دیگر Toggle نکن"
  const toggleReducer = (state: ToggleEnable, action: ToggleAction) => {
    if (action === "TOGGLE" && clicksCount >= maxClickCount) {
      return state; // برگرداندن حالت قبلی بدون تغییر
    }
    return internalReducer(state, action);
  };

  const { on, toggle, reset } = useToggle({ reducer: toggleReducer });

  return (
    <div className="main-container  flex-col">
      <h2 className="title">State Reducer Pattern</h2>
      <div className="bordered-container w-150">
        <p className="label1">
          Clicks: <span className="label2">{clicksCount}</span>
        </p>

        <button
          onClick={() => {
            toggle();
            if (clicksCount < maxClickCount) setClicksCount((c) => c + 1);
          }}
          className={`${on ? "btn-accept" : "btn-primary-dark"}`}
        >
          {on ? "ON" : "OFF"}
        </button>

        {clicksCount >= maxClickCount && (
          <p className="error">
            🚫 Maximum clicks reached (Logic controlled by custom reducer)
          </p>
        )}

        <button
          onClick={() => {
            reset();
            setClicksCount(0);
          }}
          className="reset"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
