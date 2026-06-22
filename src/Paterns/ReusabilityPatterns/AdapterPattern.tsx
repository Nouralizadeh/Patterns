import { useState } from "react";

// ============================================================================
// 1. Existing Legacy UI Component (Expects a specific, strict prop structure)
// ============================================================================
interface UserCardProps {
  fullName: string;
  avatarUrl: string;
  roleTitle: string;
}

function UserCard({ fullName, avatarUrl, roleTitle }: UserCardProps) {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 text-left">
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl}
          alt={fullName}
          className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 dark:border-slate-600"
        />
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {fullName}
          </h4>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {roleTitle}
          </p>
        </div>
      </div>

      {/* Interactive Action Row for Better UX Feedback */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <span className="text-[10px] text-emerald-600 font-mono font-bold">
          {isSaved
            ? "✓ Profile Successfully Registered"
            : "Structure: Adapted Data"}
        </span>
        <button
          onClick={handleSave}
          className="btn-primary m-0 text-[10px] px-3 py-1 bg-indigo-600 hover:bg-indigo-700"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 2. The Incompatible Third-Party API Response Shape
// ============================================================================
interface ExternalApiResponse {
  first_name: string;
  last_name: string;
  profile_picture_path: string;
  job_details: {
    department: string;
    level: string;
  };
}

const mockRawServerData: ExternalApiResponse = {
  first_name: "Shadi",
  last_name: "Nouralizadeh",
  profile_picture_path:
    "http://shadi-alizadeh.ir/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fshadi%20(1).49d8594b.jpg&w=640&q=75",
  job_details: {
    department: "Engineering",
    level: "Senior Front-End Architect",
  },
};

// ============================================================================
// 3. The Adapter Layer (Translating API fields into Component props)
// ============================================================================
function UserCardAdapter({ rawData }: { rawData: ExternalApiResponse }) {
  // Translate and map the backend keys safely here
  const adaptedProps: UserCardProps = {
    fullName: `${rawData.first_name} ${rawData.last_name}`,
    avatarUrl: rawData.profile_picture_path,
    roleTitle: `${rawData.job_details.level} (${rawData.job_details.department})`,
  };

  // Render the original clean UI component with fully compatible data
  return <UserCard {...adaptedProps} />;
}

// ============================================================================
// 4. Main Export Orchestrator Component
// ============================================================================
export default function AdapterPattern() {
  const [useAdapter, setUseAdapter] = useState<boolean>(false);

  return (
    <div className="elevated-container max-w-md">
      <h2 className="title">Adapter Design Pattern 🔌</h2>
      <p className="label1 text-xs mb-6">
        Translates raw server schema format into clean, type-safe frontend UI
        specifications.
      </p>

      <div className="w-full space-y-4">
        <div className="flex justify-center">
          <button
            onClick={() => setUseAdapter((prev) => !prev)}
            className={`text-xs px-3 py-1.5 m-0 transition-all ${
              useAdapter ? "btn-denied" : "btn-primary"
            }`}
          >
            {useAdapter ? "Disconnect Adapter Layer" : "Connect Adapter Layer"}
          </button>
        </div>

        <div className="dashed-border-container min-h-[140px] flex flex-col justify-center bg-slate-50/50 dark:bg-slate-900/10">
          {useAdapter ? (
            /* Intercepts and maps data properly before it can hit the broken component view */
            <UserCardAdapter rawData={mockRawServerData} />
          ) : (
            <div className="p-4 text-center">
              <p className="text-xs text-red-500 font-mono font-semibold">
                ⚠️ Schema Conflict Error!
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                The component requires "fullName", but the API provided
                "first_name". Connect adapter to transform.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
