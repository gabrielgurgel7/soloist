import { useEffect } from "react";
import { AppHeader } from "./components/headers/AppHeader";
import { Routes, Route } from "react-router-dom";

// Páginas
import { ServicesPage } from "./pages/ServicesPage";
import { ClientsPage } from "./pages/ClientsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { EmailsPage } from "./pages/EmailsPage";
import { ConfigPage } from "./pages/ConfigPage";
import { AppFooter } from "./components/footer/AppFooter";
import { getStoredSettings } from "./services/crmStorage";

function App() {
  useEffect(() => {
    getStoredSettings();
  }, []);

  return (
    <main className="soloist-app-main flex flex-col gap-4 sm:gap-6 px-2.5 sm:px-6 bg-neutral-900 min-h-screen transition-colors duration-300">
      <AppHeader />
      <Routes>
        <Route path="/configs" element={<ConfigPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/emails" element={<EmailsPage />} />
        <Route path="/" element={<ConfigPage />} />
      </Routes>
      <AppFooter />
    </main>
  );
}

export default App;
