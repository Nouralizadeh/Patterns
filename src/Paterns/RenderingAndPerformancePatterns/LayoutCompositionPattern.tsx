import { useState, ReactNode } from "react";

// ============================================================================
// 1. The Layout Component (Flexible Slot-Based Container)
// ============================================================================
interface DashboardLayoutProps {
  sidebarSlot: ReactNode;
  headerSlot: ReactNode;
  children: ReactNode; // Main content slot
}

function DashboardLayout({
  sidebarSlot,
  headerSlot,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="w-full min-h-[400px] border border-slate-200 dark:border-slate-600 rounded-2xl overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header Slot Row */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3 flex justify-between items-center">
        {headerSlot}
      </header>

      <div className="flex flex-1 flex-col sm:flex-row">
        {/* Sidebar Slot Column */}
        <aside className="w-full sm:w-48 bg-white dark:bg-slate-800 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 p-3">
          {sidebarSlot}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 bg-slate-100 dark:bg-slate-900/40">
          {children}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// 2. Main Page Controller / Parent Component
// ============================================================================
export default function LayoutCompositionPattern() {
  const users = [
    { name: "Shadi Alizadeh", role: "Senior Front-End Architect" },
    { name: "Mohammad Jahanbakhsh", role: "Renewable Energy Expert" },
  ];
  // State lives here in the parent page, where it's actually needed!
  const [user, setUser] = useState<{ name: string; role: string }>({
    name: "Shadi Alizadeh",
    role: "Senior Front-End Architect",
  });

  const [activeTab, setActiveTab] = useState<string>("Overview");

  // We compose the pieces right here. Notice zero Prop Drilling!
  return (
    <div className="elevated-container max-w-2xl">
      <h2 className="title">Layout Composition 🧱</h2>
      <p className="label1 text-xs mb-6">
        Using specialized slots to completely bypass deep prop drilling.
      </p>

      <DashboardLayout
        /* Slot 1: Injecting Sidebar directly with parent state control */
        sidebarSlot={
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
              Navigation
            </p>
            {["Overview", "Settings", "Logs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-2 py-1 rounded text-xs font-medium transition-all ${
                  activeTab === tab
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        }
        /* Slot 2: Injecting Header directly with user profile data */
        headerSlot={
          <>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              🎛️ Panel Console
            </span>
            <div className="flex items-center gap-2">
              <span className="label2 text-xs">{user.name}</span>
            </div>
          </>
        }
      >
        {/* Slot 3 (children): Main view body based on active navigation tab */}
        <div className="dashed-border-container bg-white dark:bg-slate-800 min-h-[180px]">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            {activeTab} View
          </h4>
          <p className="label1 text-xs leading-relaxed">
            Content injected for{" "}
            <span className="font-semibold">{user.name}</span> ({user.role}).
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button
              onClick={() =>
                setUser(user.name == "Shadi Alizadeh" ? users[1] : users[0])
              }
              className="btn-primary text-[11px] px-2 py-1 m-0"
            >
              Switch User State
            </button>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
