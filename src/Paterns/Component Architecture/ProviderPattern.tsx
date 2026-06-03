import { createContext, useContext, useState, ReactNode } from "react";

/* -------------------------------------------------------
   Context
-------------------------------------------------------- */

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

/* -------------------------------------------------------
   Provider
-------------------------------------------------------- */

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* -------------------------------------------------------
   Custom Hook (for easier usage)
-------------------------------------------------------- */

function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

/* -------------------------------------------------------
   UI Components
-------------------------------------------------------- */

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${theme === "light" ? "btn-primary" : "btn-primary-dark"}`}
    >
      Toggle Theme (Current: {theme})
    </button>
  );
}

function ThemeCard() {
  const { theme } = useTheme();

  return (
    <div
      className={`p-6 rounded shadow w-100 text-center transition
      ${theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"}`}
    >
      Current Theme: {theme}
      <ThemeButton />
    </div>
  );
}

/* -------------------------------------------------------
   Demo App
-------------------------------------------------------- */

export default function ProviderPattern() {
  return (
    <ThemeProvider>
      <div className="main-container">
        <ThemeCard />
      </div>
    </ThemeProvider>
  );
}
