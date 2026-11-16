import { useState, useEffect, type ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import { Lock, ShieldCheck, LogIn } from "lucide-react";
import { AppHeader } from "./components/headers/AppHeader";

// Páginas
import { ServicesPage } from "./pages/ServicesPage";
import { ClientsPage } from "./pages/ClientsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { EmailsPage } from "./pages/EmailsPage";
import { ConfigPage } from "./pages/ConfigPage";
import { AppFooter } from "./components/footer/AppFooter";
import { BaseCard } from "./components/cards/BaseCard";
import {
  getStoredSettings,
  isUserAuthenticated,
} from "./services/crmStorage";
import { initSoloistAuthListener } from "./lib/firebase";

function ProtectedFeatureGate({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    isUserAuthenticated(),
  );

  useEffect(() => {
    function syncAuth() {
      setIsAuthenticated(isUserAuthenticated());
    }
    window.addEventListener("soloist-auth-changed", syncAuth);
    return () => window.removeEventListener("soloist-auth-changed", syncAuth);
  }, []);

  if (!isAuthenticated) {
    return (
      <section className="flex flex-col items-center justify-center max-w-6xl w-full p-6 sm:p-12 mx-auto backdrop-blur-md bg-green-950/60 border border-white/10 rounded-2xl min-h-105">
        <BaseCard
          className="max-w-md w-full"
          title="Acesso Restrito"
          headerBg="bg-neutral-700"
          headerText="text-pistache-solar"
          minHeight="h-auto"
          rightAction={<Lock size={18} className="text-pistache-solar" />}
        >
          <div className="flex flex-col items-center text-center gap-4 p-3">
            <div className="w-14 h-14 rounded-full bg-pistache-solar/15 border border-pistache-solar/30 flex items-center justify-center text-pistache-solar">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold font-sora text-amber-50">
                Faça login para acessar suas ferramentas
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-inter leading-relaxed">
                Por segurança, os painéis de <strong>Serviços</strong>,{" "}
                <strong>Clientes</strong>, <strong>Projetos</strong> e{" "}
                <strong>E-mails</strong> são exclusivos e isolados para cada
                conta autenticada.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event("soloist-open-login"))
              }
              className="inline-flex items-center justify-center gap-2 bg-pistache-solar text-neutral-900 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full cursor-pointer hover:brightness-105 active:scale-95 transition-all"
            >
              <LogIn size={16} />
              <span>Entrar ou Criar Conta</span>
            </button>
          </div>
        </BaseCard>
      </section>
    );
  }

  return <>{children}</>;
}

function App() {
  useEffect(() => {
    getStoredSettings();
    const unsubscribe = initSoloistAuthListener();
    return () => unsubscribe();
  }, []);

  return (
    <main className="soloist-app-main flex flex-col gap-4 sm:gap-6 px-2.5 sm:px-6 bg-neutral-900 min-h-screen transition-colors duration-300">
      <AppHeader />
      <Routes>
        <Route path="/configs" element={<ConfigPage />} />
        <Route
          path="/services"
          element={
            <ProtectedFeatureGate>
              <ServicesPage />
            </ProtectedFeatureGate>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedFeatureGate>
              <ClientsPage />
            </ProtectedFeatureGate>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedFeatureGate>
              <ProjectsPage />
            </ProtectedFeatureGate>
          }
        />
        <Route
          path="/emails"
          element={
            <ProtectedFeatureGate>
              <EmailsPage />
            </ProtectedFeatureGate>
          }
        />
        <Route path="/" element={<ConfigPage />} />
      </Routes>
      <AppFooter />
    </main>
  );
}

export default App;
