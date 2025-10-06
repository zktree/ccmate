import { useTranslation } from "react-i18next";

export function SettingsPage() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4" data-tauri-drag-region>{t("settings.title")}</h1>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t("settings.language")}</label>
          <select
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </div>
        <div>
          <p className="text-muted-foreground">
            {t("settings.theme")} settings will be added here.
          </p>
        </div>
      </div>
    </div>
  );
}