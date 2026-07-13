import { useState } from "react"
import InfoDetails from "./settings/personal/InfoDetails"
import useAuth from "@auth/hooks/useAuth"
import ThemeSettings from "./settings/theme/ThemeSettings"
import SettingsProfileHeader from "./settings/profile/SettingsProfileHeader"
import SettingsSection from "./settings/layout/SettingsSection"
import SettingsLogoutButton from "./settings/layout/SettingsLogoutButton"
import { useSettingsLogout } from "@profile/hooks/useSettingsLogout"

const Settings = () => {
  const { user } = useAuth()
  const [openSection, setOpenSection] = useState<string | null>("")
  const { handleLogout, isLoggingOut } = useSettingsLogout()

  const toggleSection = (section: string) => {
    setOpenSection((prevSection) => (prevSection === section ? null : section))
  }

  return (
    <aside
      className="font-poppins h-screen w-1/4 border-r border-l border-r-slate-200 border-l-slate-200 bg-gray-50 select-none"
      aria-label="Settings"
    >
      <section>
        <h2 className="mb-4 p-3 text-xl font-semibold text-black/80">Settings</h2>
        <SettingsProfileHeader user={user} />

        <div className="max-h-[calc(100vh-200px)] w-full space-y-4 overflow-y-auto bg-white p-3 shadow-sm">
          <SettingsSection id="personal" title="Personal Info" isOpen={openSection === "personal"} contentClassName="pl-2" onToggle={toggleSection}>
            <InfoDetails />
          </SettingsSection>

          <SettingsSection id="themes" title="Themes" isOpen={openSection === "themes"} contentClassName="mt-2 pl-2" onToggle={toggleSection}>
            <ThemeSettings />
          </SettingsSection>

          <SettingsSection id="privacy" title="Privacy" isOpen={openSection === "privacy"} onToggle={toggleSection}>
            Manage your privacy settings.
          </SettingsSection>

          <SettingsSection id="security" title="Security" isOpen={openSection === "security"} onToggle={toggleSection}>
            Configure your account security.
          </SettingsSection>

          <SettingsSection id="help" title="Help" isOpen={openSection === "help"} onToggle={toggleSection}>
            Find FAQs and support resources.
          </SettingsSection>

          <SettingsLogoutButton isLoggingOut={isLoggingOut} onLogout={handleLogout} />
        </div>
      </section>
    </aside>
  )
}

export default Settings
