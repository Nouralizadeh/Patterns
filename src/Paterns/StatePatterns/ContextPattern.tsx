import { createContext, useContext, useState, ReactNode } from "react";

function ThemeSettings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sub-card flex flex-col items-center">
      <p className="label1 mb-4">
        Current Mode: <span className="label2 uppercase">{theme}</span>
      </p>
      <button
        onClick={toggleTheme}
        className={theme === "light" ? "btn-primary" : "btn-primary-dark"}
      >
        Switch to {theme === "light" ? "Dark" : "Light"}
      </button>
    </div>
  );
}

function DisplayPanel() {
  const { theme } = useTheme();

  return (
    <div
      className={`mt-6 p-4 rounded-lg border-2 border-dashed ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`}
    >
      <p className={theme === "dark" ? "text-slate-300" : "text-slate-600"}>
        This panel reacts to the global theme state!
      </p>
    </div>
  );
}

// Main Component
export function ContextPattern() {
  return (
    <ThemeProvider>
      <div className="elevated-container">
        <h2 className="title">Global State (Context)</h2>

        <ThemeSettings />
        <DisplayPanel />

        <button className="reset w-full text-center mt-6">
          Theme Documentation
        </button>
      </div>
    </ThemeProvider>
  );
}

//------------------------------------------------------------
//-------------------------theme provider---------------------
//------------------------------------------------------------

// --- Types ---
type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// --- Provider Component ---
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={`min-h-screen transition-colors duration-300 overflow-hidden ${
          theme === "dark"
            ? "dark bg-slate-900 text-white"
            : "bg-slate-50 text-slate-900"
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// --- Custom Hook for easy access ---
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
