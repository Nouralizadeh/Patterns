import { useState } from "react";

// ============================================================================
// 1. Headless Engine (Pure Business Logic)
// ============================================================================
function useFeatureToggle(initialState = false) {
  const [isEnabled, setIsEnabled] = useState<boolean>(initialState);

  const toggle = () => setIsEnabled((prev) => !prev);

  return {
    isEnabled,
    toggleProps: {
      "aria-checked": isEnabled,
      role: "switch",
      onClick: toggle,
    },
  };
}

// ============================================================================
// 2. Real-World UX Render
// ============================================================================
export default function HeadlessPattern() {
  // Driven by a single state manager for SMS notifications
  const smsFeature = useFeatureToggle(false);

  return (
    <div className="elevated-container max-w-md">
      <h2 className="title">SMS Notification Engine 🧠</h2>
      <p className="label1 text-xs mb-6">
        Here is how Headless pattern manages the{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          exact same state
        </span>{" "}
        across two completely different UX layouts.
      </p>

      <div className="w-full space-y-6">
        {/* UX Layout 1: Inside Main Settings Tab (iOS Switch View) */}
        <div className="dashed-border-container flex items-center justify-between bg-white dark:bg-slate-800">
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              SMS Alerts
            </h4>
            <p className="text-[11px] text-slate-400">
              Get instant transactional SMS
            </p>
          </div>

          {/* iOS Toggle Track */}
          <div
            {...smsFeature.toggleProps}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
              smsFeature.isEnabled
                ? "bg-emerald-500"
                : "bg-slate-300 dark:bg-slate-600"
            }`}
          >
            {/* iOS Toggle Knob */}
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${
                smsFeature.isEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* UX Layout 2: Inside Top Emergency Alert Banner (Classic Button View) */}
        {!smsFeature.isEnabled && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-center justify-between animate-fadeIn">
            <div className="text-left">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                Security Risk! ⚠️
              </p>
              <p className="text-[10px] text-amber-700/80 dark:text-amber-500">
                Your SMS alerts are turned off.
              </p>
            </div>
            <button
              {...smsFeature.toggleProps} // Direct conversion to a button event handler
              className="btn-primary m-0 text-[10px] px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white border-none"
            >
              Turn On Now
            </button>
          </div>
        )}

        {/* Live Synchronized Debug Footer */}
        <div
          className={`p-2 rounded-lg text-center font-mono text-[11px] font-bold ${
            smsFeature.isEnabled
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20"
              : "bg-red-50 text-red-700 dark:bg-red-950/20"
          }`}
        >
          Global Database Sync Status:{" "}
          {smsFeature.isEnabled ? "ACTIVE (TRUE)" : "DISABLED (FALSE)"}
        </div>
      </div>
    </div>
  );
}
