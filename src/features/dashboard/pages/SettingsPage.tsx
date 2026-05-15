import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bell, Globe2, Moon, Save } from "lucide-react";

const P = "#e8441a";
const STORAGE_KEY = "user_preferences";

const SettingsPage = () => {
  const [preferences, setPreferences] = useState({
    language: "en",
    currency: "USD",
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setPreferences(JSON.parse(saved));
  }, []);

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    toast.success("Preferences saved");
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-6">
        <p className="text-sm font-semibold" style={{ color: P }}>Preferences</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </div>

      <div className="rounded-lg border border-black/5 bg-white dark:bg-slate-900 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Globe2 className="w-4 h-4" /> Language
            <select
              value={preferences.language}
              onChange={(event) => setPreferences((current) => ({ ...current, language: event.target.value }))}
              className="mt-2 md:mt-0 md:ml-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="rw">Kinyarwanda</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Currency
            <select
              value={preferences.currency}
              onChange={(event) => setPreferences((current) => ({ ...current, currency: event.target.value }))}
              className="mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm"
            >
              <option value="USD">USD</option>
              <option value="RWF">RWF</option>
              <option value="EUR">EUR</option>
            </select>
          </label>
        </div>

        <div className="p-5 space-y-4">
          {[
            ["emailNotifications", "Email notifications", Bell],
            ["smsNotifications", "SMS notifications", Bell],
            ["darkMode", "Prefer dark mode", Moon],
          ].map(([key, label, Icon]) => (
            <label key={key as string} className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-2"><Icon className="w-4 h-4" />{label as string}</span>
              <input
                type="checkbox"
                checked={Boolean(preferences[key as keyof typeof preferences])}
                onChange={(event) => setPreferences((current) => ({ ...current, [key as string]: event.target.checked }))}
                className="h-5 w-5"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <button onClick={save} className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: P }}>
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
