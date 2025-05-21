import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const handleChange = (value: "light" | "dark") => {
    setTheme(value);
    document.documentElement.classList.toggle("dark", value === "dark");
    localStorage.setItem("theme", value);
  };

  return (
    <div className="flex items-center m-2">
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name="theme"
          value="light"
          checked={theme === "light"}
          onChange={() => handleChange("light")}
          className="peer sr-only"
        />
        <span className="px-4 py-2 rounded-l bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-500 peer-checked:text-white transition-colors">
          ☀️
        </span>
      </label>
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name="theme"
          value="dark"
          checked={theme === "dark"}
          onChange={() => handleChange("dark")}
          className="peer sr-only"
        />
        <span className="px-4 py-2 rounded-r bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-500 peer-checked:text-white transition-colors">
          🌙
        </span>
      </label>
    </div>
  );
}
