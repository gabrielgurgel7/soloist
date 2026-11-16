import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  ShoppingCart,
  Kanban,
  Users,
  BarChart3,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDown,
  Clock,
  ShieldCheck,
  Zap,
  ClipboardList,
  Lock,
} from "lucide-react";
import { SendButton } from "../components/buttons/Buttons";
import { BaseCard } from "../components/cards/BaseCard";
import { SectionHeader } from "../components/headers/SectionHeader";
import { LineDivision } from "../components/division/LineDivision";
import {
  getStoredServices,
  getStoredCombos,
  getStoredClients,
  getStoredProjects,
  getStoredSettings,
  saveStoredSettings,
  isUserAuthenticated,
  getActiveSessionUser,
} from "../services/crmStorage";
import { pushSettingsToPostgres } from "../lib/firebase";

export function ConfigPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    isUserAuthenticated(),
  );
  const [appSettings, setAppSettings] = useState(() => getStoredSettings());
  const [services, setServices] = useState(() => getStoredServices());
  const [combos, setCombos] = useState(() => getStoredCombos());
  const [clients, setClients] = useState(() => getStoredClients());
  const [projects, setProjects] = useState(() => getStoredProjects());

  // Simulador rápido de Valores de Referência (Custo/Hora Base)
  const [monthlyCosts, setMonthlyCosts] = useState<number>(
    () => getStoredSettings().monthlyFixedCosts,
  );
  const [desiredSalary, setDesiredSalary] = useState<number>(
    () => getStoredSettings().desiredMonthlySalary,
  );
  const [productiveHours, setProductiveHours] = useState<number>(
    () => getStoredSettings().productiveHoursPerMonth,
  );
  const [savedReference, setSavedReference] = useState(false);

  useEffect(() => {
    function syncAll() {
      const authNow = isUserAuthenticated();
      const latestSettings = getStoredSettings();
      setIsAuthenticated(authNow);
      setAppSettings(latestSettings);
      setServices(getStoredServices());
      setCombos(getStoredCombos());
      setClients(getStoredClients());
      setProjects(getStoredProjects());
      setMonthlyCosts(latestSettings.monthlyFixedCosts);
      setDesiredSalary(latestSettings.desiredMonthlySalary);
      setProductiveHours(latestSettings.productiveHoursPerMonth);
    }

    window.addEventListener("soloist-auth-changed", syncAll);
    window.addEventListener("soloist-crm-updated", syncAll);
    window.addEventListener("soloist-settings-updated", syncAll);
    return () => {
      window.removeEventListener("soloist-auth-changed", syncAll);
      window.removeEventListener("soloist-crm-updated", syncAll);
      window.removeEventListener("soloist-settings-updated", syncAll);
    };
  }, []);

  const calculatedHourlyRate =
    isAuthenticated && productiveHours > 0
      ? (monthlyCosts + desiredSalary) / productiveHours
      : 0;

  function openLoginIfUnauthenticated(): boolean {
    if (!isAuthenticated) {
      window.dispatchEvent(new Event("soloist-open-login"));
      return true;
    }
    return false;
  }

  function handleProtectedNavigate(path: string) {
    if (openLoginIfUnauthenticated()) return;
    navigate(path);
  }

  async function handleSaveReference(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (openLoginIfUnauthenticated()) return;

    const updated = {
      ...getStoredSettings(),
      monthlyFixedCosts: monthlyCosts,
      desiredMonthlySalary: desiredSalary,
      productiveHoursPerMonth: productiveHours,
    };
    saveStoredSettings(updated);
    setAppSettings(updated);
    await pushSettingsToPostgres(updated).catch(() => undefined);
    setSavedReference(true);
    setTimeout(() => setSavedReference(false), 3000);
  }

  const sessionUser = getActiveSessionUser();
  const rawName =
    appSettings.userName.trim() ||
    sessionUser?.displayName?.trim() ||
    sessionUser?.email?.split("@")[0] ||
    "";
  const firstName = isAuthenticated && rawName ? rawName.split(" ")[0] : "";

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-6xl w-full mx-auto">
      {/* 1. HERO SECTION (MANTENDO A IMAGEM E A CHAMADA PARA AÇÃO ESCOLHIDAS) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 items-center w-full lg:min-h-105 mx-auto backdrop-blur-md bg-green-950/60 border border-white/10 justify-between rounded-2xl overflow-hidden">
        <div className="lg:col-span-7 flex flex-col justify-center gap-3.5 sm:gap-4 h-full p-4 sm:p-8">
          <div className="inline-flex items-center gap-2 self-start bg-pistache-solar/15 border border-pistache-solar/30 text-pistache-solar text-xs font-semibold px-3 py-1 rounded-full">
            <Sparkles size={14} />
            <span>CRM & Precificação Inteligente para Criativos</span>
          </div>

          <h2 className="text-3xl sm:text-5xl text-pistache-solar font-semibold font-sora leading-tight">
            {isAuthenticated && firstName
              ? `Bem vindo, ${firstName}!`
              : "Bem vindo!"}
          </h2>

          <p className="text-neutral-50 text-sm sm:text-lg max-w-xl font-inter">
            Comece configurando seus valores de referência e deixe o Soloist
            calcular o resto. Organize clientes, combine pacotes de serviços e
            acompanhe cada projeto em um único lugar.
          </p>

          {/* Pills de diferenciais rápidos na Hero (com Lucide Icons) */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 text-xs bg-neutral-900/70 border border-white/10 text-amber-50 px-3 py-1 rounded-full">
              <Zap size={12} className="text-pistache-solar" />
              <span>Cálculo de Orçamento Real</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-neutral-900/70 border border-white/10 text-amber-50 px-3 py-1 rounded-full">
              <ShoppingCart size={12} className="text-pistache-solar" />
              <span>Combos Drag & Drop</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-neutral-900/70 border border-white/10 text-amber-50 px-3 py-1 rounded-full">
              <ClipboardList size={12} className="text-pistache-solar" />
              <span>Kanban Integrado</span>
            </span>
          </div>

          {/* Chamada para Ação Original */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div
              onClick={() => handleProtectedNavigate("/services")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleProtectedNavigate("/services");
              }}
              className="flex items-center justify-around backdrop-blur-md bg-green-950/60 hover:bg-green-900/70 border border-white/10 hover:border-pistache-solar/50 w-4xs pl-5 pr-1 py-1 rounded-full cursor-pointer transition-all"
            >
              <p className="text-amber-50 font-semibold">Começar</p>
              <SendButton />
            </div>

            <a
              href="#valores-referencia"
              className="inline-flex items-center gap-1 text-xs text-pistache-solar hover:underline font-medium"
            >
              <span>Configurar hora técnica</span>
              <ArrowDown size={13} />
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 h-56 sm:h-72 lg:h-full w-full relative">
          <img
            className="h-full w-full object-cover"
            src="/moca_espreguicando_soloist.png"
            alt="Ilustração de uma moça espreguiçando em frente ao seu notebook"
          />
        </div>
      </section>

      {/* 2. CARACTERÍSTICAS DO PRODUTO (DIFERENCIAIS DO SOLOIST) */}
      <section className="flex flex-col gap-5 w-full p-4 sm:p-6 backdrop-blur-md bg-green-950/60 border border-white/10 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-2xl font-bold text-pistache-solar font-sora">
              Tudo o que você precisa para gerenciar seu estúdio
            </h3>
            <p className="text-sm text-neutral-300 font-inter">
              Do cálculo da sua hora produtiva até a entrega final do projeto no
              Kanban.
            </p>
          </div>
          <span className="text-xs text-amber-50 bg-neutral-900/80 border border-white/10 px-3 py-1.5 rounded-full self-start sm:self-auto">
            {isAuthenticated
              ? "Conta sincronizada com PostgreSQL"
              : "Faça login para desbloquear"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <BaseCard
            title="Precificação Exata"
            headerBg="bg-pistache-solar"
            headerText="text-neutral-900"
            minHeight="min-h-56"
            rightAction={<Calculator size={18} className="text-neutral-900" />}
          >
            <div className="flex flex-col justify-between flex-1 gap-3 p-1 text-sm text-neutral-200 font-inter">
              <p>
                Chega de chutar valores. Calcule orçamentos somando horas
                estimadas, margem de lucro, custos variáveis e multiplicadores
                de <strong>urgência</strong>, <strong>complexidade</strong> e{" "}
                <strong>porte do cliente</strong>.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-pistache-solar font-semibold">
                  {services.length} serviços no catálogo
                </span>
                <button
                  type="button"
                  onClick={() => handleProtectedNavigate("/services")}
                  className="inline-flex items-center gap-1 text-amber-50 hover:text-pistache-solar cursor-pointer"
                >
                  {isAuthenticated ? (
                    <>
                      Abrir <ArrowUpRight size={13} />
                    </>
                  ) : (
                    <>
                      <Lock size={12} /> Login
                    </>
                  )}
                </button>
              </div>
            </div>
          </BaseCard>

          {/* Feature 2 */}
          <BaseCard
            title="Combos Drag & Drop"
            headerBg="bg-amber-200"
            headerText="text-slate-800"
            minHeight="min-h-56"
            rightAction={<ShoppingCart size={18} className="text-slate-800" />}
          >
            <div className="flex flex-col justify-between flex-1 gap-3 p-1 text-sm text-neutral-200 font-inter">
              <p>
                Seu cliente pediu mais de um serviço? Arraste itens para o{" "}
                <strong>Carrinho de Orçamento</strong>, aplique descontos de
                pacote e salve no <strong>Histórico de Combos</strong> para
                reaproveitar em 1 clique.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-pistache-solar font-semibold">
                  {combos.length} combos reutilizáveis
                </span>
                <button
                  type="button"
                  onClick={() => handleProtectedNavigate("/services")}
                  className="inline-flex items-center gap-1 text-amber-50 hover:text-pistache-solar cursor-pointer"
                >
                  {isAuthenticated ? (
                    <>
                      Montar <ArrowUpRight size={13} />
                    </>
                  ) : (
                    <>
                      <Lock size={12} /> Login
                    </>
                  )}
                </button>
              </div>
            </div>
          </BaseCard>

          {/* Feature 3 */}
          <BaseCard
            title="Kanban de Projetos"
            headerBg="bg-green-300"
            headerText="text-slate-800"
            minHeight="min-h-56"
            rightAction={<Kanban size={18} className="text-slate-800" />}
          >
            <div className="flex flex-col justify-between flex-1 gap-3 p-1 text-sm text-neutral-200 font-inter">
              <p>
                Mova projetos entre <strong>Em andamento</strong>,{" "}
                <strong>Concluído</strong>, <strong>Pausado</strong> e{" "}
                <strong>Cancelado</strong> com Drag and Drop. Veja o valor total
                (R$) somado em tempo real em cada coluna.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-pistache-solar font-semibold">
                  {projects.length} projetos registrados
                </span>
                <button
                  type="button"
                  onClick={() => handleProtectedNavigate("/projects")}
                  className="inline-flex items-center gap-1 text-amber-50 hover:text-pistache-solar cursor-pointer"
                >
                  {isAuthenticated ? (
                    <>
                      Ver quadro <ArrowUpRight size={13} />
                    </>
                  ) : (
                    <>
                      <Lock size={12} /> Login
                    </>
                  )}
                </button>
              </div>
            </div>
          </BaseCard>

          {/* Feature 4 */}
          <BaseCard
            title="Gestão de Clientes"
            headerBg="bg-blue-300"
            headerText="text-slate-800"
            minHeight="min-h-56"
            rightAction={<Users size={18} className="text-slate-800" />}
          >
            <div className="flex flex-col justify-between flex-1 gap-3 p-1 text-sm text-neutral-200 font-inter">
              <p>
                Classifique clientes por status (<em>Ativos</em>,{" "}
                <em>Prospectos</em>, <em>Inativos</em>) e faixa de{" "}
                <strong>Ticket</strong>. Ao fechar um orçamento em Serviços, o
                cliente e o projeto são criados automaticamente.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-pistache-solar font-semibold">
                  {clients.length} clientes na carteira
                </span>
                <button
                  type="button"
                  onClick={() => handleProtectedNavigate("/clients")}
                  className="inline-flex items-center gap-1 text-amber-50 hover:text-pistache-solar cursor-pointer"
                >
                  {isAuthenticated ? (
                    <>
                      Gerenciar <ArrowUpRight size={13} />
                    </>
                  ) : (
                    <>
                      <Lock size={12} /> Login
                    </>
                  )}
                </button>
              </div>
            </div>
          </BaseCard>
        </div>
      </section>

      {/* 3. VALORES DE REFERÊNCIA + COMO O SOLOIST FUNCIONA */}
      <section
        id="valores-referencia"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full p-4 sm:p-6 backdrop-blur-md bg-green-950/60 border border-white/10 rounded-2xl items-start"
      >
        {/* Calculadora de Valores de Referência (Promessa da Hero) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <SectionHeader
            title="Valores de Referência"
            icon={
              <SlidersHorizontal
                size={18}
                className="text-pistache-solar shrink-0"
              />
            }
          />

          <BaseCard
            title="Calculadora de Hora Técnica Base"
            headerBg="bg-neutral-700"
            headerText="text-pistache-solar"
            minHeight="h-auto"
          >
            <form
              onSubmit={handleSaveReference}
              className="flex flex-col gap-3 p-2"
            >
              <p className="text-xs text-neutral-300 font-inter">
                {isAuthenticated
                  ? "Defina seus custos mensais e horas produtivas para descobrir seu custo/hora ideal nos orçamentos."
                  : "Faça login na sua conta para configurar e salvar sua hora técnica base no banco de dados."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label
                    htmlFor="monthlyCosts"
                    className="text-neutral-50 text-xs block mb-1"
                  >
                    Custos fixos/mês
                  </label>
                  <div className="flex items-center gap-1.5 bg-neutral-500/30 h-10 px-3 rounded-full">
                    <span className="text-pistache-solar text-xs">R$</span>
                    <input
                      id="monthlyCosts"
                      type="number"
                      min="0"
                      disabled={!isAuthenticated}
                      value={isAuthenticated ? monthlyCosts : 0}
                      onChange={(e) =>
                        setMonthlyCosts(Number(e.target.value) || 0)
                      }
                      className="text-pistache-solar outline-none bg-transparent w-full text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="desiredSalary"
                    className="text-neutral-50 text-xs block mb-1"
                  >
                    Meta salarial/mês
                  </label>
                  <div className="flex items-center gap-1.5 bg-neutral-500/30 h-10 px-3 rounded-full">
                    <span className="text-pistache-solar text-xs">R$</span>
                    <input
                      id="desiredSalary"
                      type="number"
                      min="0"
                      disabled={!isAuthenticated}
                      value={isAuthenticated ? desiredSalary : 0}
                      onChange={(e) =>
                        setDesiredSalary(Number(e.target.value) || 0)
                      }
                      className="text-pistache-solar outline-none bg-transparent w-full text-sm disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="productiveHours"
                  className="text-neutral-50 text-xs block mb-1"
                >
                  Horas produtivas por mês (ex: 7h/dia × 20 dias = 140h)
                </label>
                <div className="flex items-center gap-2 bg-neutral-500/30 h-10 px-4 rounded-full">
                  <Clock size={14} className="text-pistache-solar" />
                  <input
                    id="productiveHours"
                    type="number"
                    min="1"
                    max="300"
                    disabled={!isAuthenticated}
                    value={isAuthenticated ? productiveHours : 0}
                    onChange={(e) =>
                      setProductiveHours(Number(e.target.value) || 1)
                    }
                    className="text-pistache-solar outline-none bg-transparent w-full text-sm disabled:opacity-50"
                  />
                  <span className="text-pistache-solar text-xs">horas/mês</span>
                </div>
              </div>

              <LineDivision />

              <div className="flex flex-wrap items-center justify-between gap-2 bg-neutral-900/70 border border-pistache-solar/30 rounded-2xl p-3">
                <div>
                  <span className="text-xs text-neutral-400 block">
                    Sua Hora Técnica Sugerida
                  </span>
                  <strong className="text-xl text-pistache-solar font-sora">
                    R${" "}
                    {calculatedHourlyRate.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /h
                  </strong>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-pistache-solar text-neutral-900 font-bold text-xs px-4 py-2 rounded-full cursor-pointer hover:brightness-105 active:scale-95 transition-all"
                >
                  {isAuthenticated ? (
                    <span>Salvar Referência</span>
                  ) : (
                    <>
                      <Lock size={12} />
                      <span>Fazer Login para Salvar</span>
                    </>
                  )}
                </button>
              </div>

              {savedReference && (
                <div className="flex items-center gap-1.5 text-xs text-pistache-solar bg-emerald-900/70 border border-pistache-solar/40 rounded-xl px-3 py-2">
                  <CheckCircle2 size={14} />
                  <span>
                    Hora técnica salva na sua conta e sincronizada com o banco!
                  </span>
                </div>
              )}
            </form>
          </BaseCard>
        </div>

        {/* Fluxo Integrado & Diferenciais Estratégicos */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <SectionHeader
            title="Por que usar o Soloist?"
            icon={
              <BarChart3 size={18} className="text-pistache-solar shrink-0" />
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseCard
              title="1. Fim do Prejuízo Oculto"
              headerBg="bg-emerald-300"
              headerText="text-slate-800"
              minHeight="h-auto"
              rightAction={<ShieldCheck size={18} className="text-slate-800" />}
            >
              <p className="text-xs text-neutral-200 font-inter leading-relaxed p-1">
                Projetos urgentes ou com muitas revisões consomem sua margem sem
                você perceber. O motor de cálculo do Soloist ajusta
                automaticamente o preço conforme o risco, urgência e número de
                revisões incluídas.
              </p>
            </BaseCard>

            <BaseCard
              title="2. Inteligência de Demanda"
              headerBg="bg-emerald-300"
              headerText="text-slate-800"
              minHeight="h-auto"
              rightAction={<BarChart3 size={18} className="text-slate-800" />}
            >
              <p className="text-xs text-neutral-200 font-inter leading-relaxed p-1">
                O <strong>Termômetro do Catálogo</strong> e o ranking de
                serviços mais procurados mostram em tempo real quais entregas
                trazem mais pedidos e receita para o seu negócio.
              </p>
            </BaseCard>

            <BaseCard
              title="3. Pacotes Reaproveitáveis"
              headerBg="bg-emerald-300"
              headerText="text-slate-800"
              minHeight="h-auto"
              rightAction={
                <ShoppingCart size={18} className="text-slate-800" />
              }
            >
              <p className="text-xs text-neutral-200 font-inter leading-relaxed p-1">
                Crie combinações personalizadas para um cliente e guarde tudo no{" "}
                <strong>Histórico de Combos</strong>. Quando surgir outro
                cliente com a mesma demanda, recarregue o pacote inteiro com 1
                clique.
              </p>
            </BaseCard>

            <BaseCard
              title="4. Sincronização Automática"
              headerBg="bg-emerald-300"
              headerText="text-slate-800"
              minHeight="h-auto"
              rightAction={<Sparkles size={18} className="text-slate-800" />}
            >
              <p className="text-xs text-neutral-200 font-inter leading-relaxed p-1">
                Sem retrabalho: ao aprovar um orçamento na tela de{" "}
                <strong>Serviços</strong>, os dados do cliente vão direto para{" "}
                <strong>Clientes</strong> e o card do trabalho já nasce no
                Kanban de <strong>Projetos</strong>.
              </p>
            </BaseCard>
          </div>
        </div>
      </section>
    </div>
  );
}
