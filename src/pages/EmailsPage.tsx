import { useState, useEffect } from "react";
import {
  Mail,
  PenLine,
  Eye,
  Send,
  Copy,
  Check,
  Sparkles,
  Trash2,
  FileText,
  History,
  Monitor,
  Smartphone,
  Code2,
  BookmarkPlus,
  UserCheck,
  FolderKanban,
  ExternalLink,
  CopyPlus,
} from "lucide-react";
import {
  PageTitleHeader,
  SectionHeader,
} from "../components/headers/SectionHeader";
import { BaseCard } from "../components/cards/BaseCard";
import { LineDivision } from "../components/division/LineDivision";
import { Input } from "../components/inputs/Input";
import {
  type SoloistEmailTemplate,
  type SoloistSentEmail,
  type EmailCategory,
  type EmailVisualTheme,
  getStoredEmailTemplates,
  saveStoredEmailTemplates,
  getStoredEmailHistory,
  saveStoredEmailHistory,
  getStoredClients,
  getStoredProjects,
  getStoredSettings,
  pushActivityNotification,
} from "../services/crmStorage";

const EMAIL_CATEGORIES: EmailCategory[] = [
  "Proposta",
  "Cobrança",
  "Onboarding",
  "Follow-up",
  "Entrega",
  "Personalizado",
];

const CATEGORY_BADGE_STYLE: Record<
  EmailCategory,
  { bg: string; text: string; headerBg: string; headerText: string }
> = {
  Proposta: {
    bg: "bg-pistache-solar/20",
    text: "text-pistache-solar",
    headerBg: "bg-pistache-solar",
    headerText: "text-neutral-900",
  },
  Cobrança: {
    bg: "bg-amber-300/20",
    text: "text-amber-200",
    headerBg: "bg-amber-200",
    headerText: "text-slate-800",
  },
  Onboarding: {
    bg: "bg-emerald-300/20",
    text: "text-emerald-200",
    headerBg: "bg-green-300",
    headerText: "text-slate-800",
  },
  "Follow-up": {
    bg: "bg-sky-300/20",
    text: "text-sky-200",
    headerBg: "bg-blue-300",
    headerText: "text-slate-800",
  },
  Entrega: {
    bg: "bg-purple-300/20",
    text: "text-purple-200",
    headerBg: "bg-purple-200",
    headerText: "text-slate-800",
  },
  Personalizado: {
    bg: "bg-neutral-500/30",
    text: "text-neutral-200",
    headerBg: "bg-neutral-700",
    headerText: "text-pistache-solar",
  },
};

const DYNAMIC_VARIABLES = [
  { token: "{{cliente_nome}}", label: "+ Cliente" },
  { token: "{{cliente_empresa}}", label: "+ Empresa" },
  { token: "{{projeto_nome}}", label: "+ Projeto" },
  { token: "{{projeto_valor}}", label: "+ Valor R$" },
  { token: "{{projeto_status}}", label: "+ Status" },
  { token: "{{validade_dias}}", label: "+ Validade" },
  { token: "{{localidade}}", label: "+ Cidade/UF" },
  { token: "{{estudio_nome}}", label: "+ Estúdio" },
  { token: "{{usuario_nome}}", label: "+ Meu Nome" },
];

type MobileEmailsTab = "todas" | "lista" | "editor" | "preview";

export function EmailsPage() {
  const [templates, setTemplates] = useState<SoloistEmailTemplate[]>(() =>
    getStoredEmailTemplates(),
  );
  const [emailHistory, setEmailHistory] = useState<SoloistSentEmail[]>(() =>
    getStoredEmailHistory(),
  );
  const [clients] = useState(() => getStoredClients());
  const [projects] = useState(() => getStoredProjects());
  const [settings] = useState(() => getStoredSettings());

  // Aba de listagem na esquerda (Templates vs. Histórico de Envios)
  const [listMode, setListMode] = useState<"templates" | "history">(
    "templates",
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("Todas");
  const [mobileTab, setMobileTab] = useState<MobileEmailsTab>("todas");

  // Contexto de CRM selecionado para preencher variáveis
  const [selectedClientId, setSelectedClientId] = useState<string>(
    () => getStoredClients()[0]?.id ?? "",
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    () => getStoredProjects()[0]?.id ?? "",
  );

  // Estado ativo do Editor de E-mail
  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    () => getStoredEmailTemplates()[0]?.id ?? "",
  );
  const [templateName, setTemplateName] = useState<string>(
    () => getStoredEmailTemplates()[0]?.name ?? "Novo E-mail Personalizado",
  );
  const [category, setCategory] = useState<EmailCategory>(
    () => getStoredEmailTemplates()[0]?.category ?? "Proposta",
  );
  const [recipientEmail, setRecipientEmail] = useState<string>(
    () => getStoredClients()[0]?.email ?? "cliente@empresa.com",
  );
  const [subject, setSubject] = useState<string>(
    () =>
      getStoredEmailTemplates()[0]?.subject ??
      "Proposta Comercial: {{projeto_nome}} — {{estudio_nome}}",
  );
  const [greeting, setGreeting] = useState<string>(
    () =>
      getStoredEmailTemplates()[0]?.greeting ??
      "Olá, {{cliente_nome}}! Tudo bem?",
  );
  const [body, setBody] = useState<string>(
    () => getStoredEmailTemplates()[0]?.body ?? "",
  );
  const [ctaLabel, setCtaLabel] = useState<string>(
    () => getStoredEmailTemplates()[0]?.ctaLabel ?? "Aprovar Proposta",
  );
  const [ctaUrl, setCtaUrl] = useState<string>(
    () => getStoredEmailTemplates()[0]?.ctaUrl ?? "https://soloist.app/proposta",
  );
  const [signature, setSignature] = useState<string>(
    () =>
      getStoredEmailTemplates()[0]?.signature ??
      "{{usuario_nome}} • {{estudio_nome}}",
  );
  const [visualTheme, setVisualTheme] = useState<EmailVisualTheme>(
    () => getStoredEmailTemplates()[0]?.visualTheme ?? "soloist-dark",
  );

  // Estado do Visualizador (Desktop vs Mobile / Visual vs HTML)
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [previewMode, setPreviewMode] = useState<"visual" | "html">("visual");
  const [copiedType, setCopiedType] = useState<"text" | "html" | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  useEffect(() => {
    saveStoredEmailTemplates(templates);
  }, [templates]);

  useEffect(() => {
    saveStoredEmailHistory(emailHistory);
  }, [emailHistory]);

  const activeClient = clients.find((c) => c.id === selectedClientId);
  const activeProject = projects.find((p) => p.id === selectedProjectId);

  // Mapa de variáveis dinâmicas em tempo real
  const variablesMap: Record<string, string> = {
    "{{cliente_nome}}": activeClient?.name ?? "Cliente",
    "{{cliente_empresa}}":
      activeClient?.company ?? activeClient?.name ?? "Sua Empresa",
    "{{cliente_email}}": activeClient?.email ?? recipientEmail,
    "{{projeto_nome}}": activeProject?.name ?? "Projeto Criativo",
    "{{projeto_valor}}": activeProject
      ? `R$ ${activeProject.value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "R$ 3.500,00",
    "{{projeto_status}}": activeProject?.status ?? "Em andamento",
    "{{validade_dias}}": String(settings.proposalValidityDays || 10),
    "{{localidade}}": settings.defaultLocality || "São Paulo - SP",
    "{{estudio_nome}}": settings.studioName || "Soloist Studio",
    "{{usuario_nome}}": settings.userName || "Gabriel Gurgel",
    "{{usuario_email}}": settings.userEmail || "gabriel@soloist.app",
  };

  function interpolateText(raw: string): string {
    let result = raw;
    for (const [token, val] of Object.entries(variablesMap)) {
      result = result.split(token).join(val);
    }
    return result;
  }

  const renderedSubject = interpolateText(subject);
  const renderedGreeting = interpolateText(greeting);
  const renderedBody = interpolateText(body);
  const renderedCtaLabel = interpolateText(ctaLabel);
  const renderedSignature = interpolateText(signature);

  function showBanner(msg: string) {
    setStatusFeedback(msg);
    setTimeout(() => setStatusFeedback(null), 3200);
  }

  function handleSelectTemplate(tpl: SoloistEmailTemplate) {
    setActiveTemplateId(tpl.id);
    setTemplateName(tpl.name);
    setCategory(tpl.category);
    setSubject(tpl.subject);
    setGreeting(tpl.greeting);
    setBody(tpl.body);
    setCtaLabel(tpl.ctaLabel);
    setCtaUrl(tpl.ctaUrl);
    setSignature(tpl.signature);
    setVisualTheme(tpl.visualTheme);
    if (mobileTab === "lista") {
      setMobileTab("editor");
    }
  }

  function handleCreateBlankTemplate() {
    const newTpl: SoloistEmailTemplate = {
      id: `tpl-${crypto.randomUUID()}`,
      name: "Novo Template Personalizado",
      category: "Personalizado",
      subject: "Atualização sobre {{projeto_nome}} — {{estudio_nome}}",
      greeting: "Olá, {{cliente_nome}}!",
      body: "Escreva aqui sua mensagem personalizada para **{{cliente_empresa}}** referente ao projeto **{{projeto_nome}}** ({{projeto_valor}}).\n\nUse os botões de variáveis acima para inserir dados automáticos do seu CRM.",
      ctaLabel: "Visualizar Detalhes",
      ctaUrl: "https://soloist.app",
      signature: "{{usuario_nome}} • {{estudio_nome}}",
      visualTheme: "soloist-dark",
      updatedAt: new Date().toLocaleDateString("pt-BR"),
    };
    setTemplates((prev) => [newTpl, ...prev]);
    handleSelectTemplate(newTpl);
    showBanner("Novo template criado e aberto no editor!");
  }

  function handleDuplicateTemplate(tpl: SoloistEmailTemplate) {
    const copy: SoloistEmailTemplate = {
      ...tpl,
      id: `tpl-${crypto.randomUUID()}`,
      name: `${tpl.name} (Cópia)`,
      updatedAt: new Date().toLocaleDateString("pt-BR"),
    };
    setTemplates((prev) => [copy, ...prev]);
    handleSelectTemplate(copy);
    showBanner("Template duplicado com sucesso!");
  }

  function handleDeleteTemplate(id: string) {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }

  function handleSaveCurrentTemplate() {
    const today = new Date().toLocaleDateString("pt-BR");
    const existing = templates.some((t) => t.id === activeTemplateId);

    if (existing) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === activeTemplateId
            ? {
                ...t,
                name: templateName.trim() || "Template Sem Nome",
                category,
                subject,
                greeting,
                body,
                ctaLabel,
                ctaUrl,
                signature,
                visualTheme,
                updatedAt: today,
              }
            : t,
        ),
      );
      showBanner("Alterações salvas no template atual!");
    } else {
      const created: SoloistEmailTemplate = {
        id: `tpl-${crypto.randomUUID()}`,
        name: templateName.trim() || "Novo Template",
        category,
        subject,
        greeting,
        body,
        ctaLabel,
        ctaUrl,
        signature,
        visualTheme,
        updatedAt: today,
      };
      setTemplates((prev) => [created, ...prev]);
      setActiveTemplateId(created.id);
      showBanner("Novo template salvo na biblioteca!");
    }
  }

  function handleInsertToken(token: string) {
    setBody((prev) => `${prev}${prev.endsWith(" ") || !prev ? "" : " "}${token}`);
  }

  function buildPlainTextEmail(): string {
    const lines = [
      renderedGreeting,
      "",
      renderedBody.replace(/\*\*(.*?)\*\*/g, "$1"),
      "",
      renderedCtaLabel ? `${renderedCtaLabel}: ${ctaUrl}` : "",
      "",
      "—",
      renderedSignature,
    ];
    return lines.filter((l, idx) => l !== "" || idx > 0).join("\n");
  }

  function buildHtmlEmail(): string {
    const bgPage =
      visualTheme === "soloist-dark"
        ? "#0c1f17"
        : visualTheme === "clean-light"
          ? "#f4f7f2"
          : "#faf8f5";
    const bgCard =
      visualTheme === "soloist-dark"
        ? "#112b20"
        : visualTheme === "clean-light"
          ? "#ffffff"
          : "#ffffff";
    const textColor = visualTheme === "soloist-dark" ? "#f5f5f4" : "#1b2c1d";
    const accentBg = visualTheme === "soloist-dark" ? "#e4fd97" : "#2d3e2c";
    const accentText = visualTheme === "soloist-dark" ? "#171717" : "#e4fd97";

    const paragraphsHtml = renderedBody
      .split("\n\n")
      .map((para) => {
        const formatted = para.replace(
          /\*\*(.*?)\*\*/g,
          `<strong style="color:${visualTheme === "soloist-dark" ? "#e4fd97" : "#1f5c30"};">$1</strong>`,
        );
        return `<p style="margin:0 0 14px 0;line-height:1.6;">${formatted}</p>`;
      })
      .join("\n");

    return `<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:24px;background-color:${bgPage};font-family:'Inter',Arial,sans-serif;color:${textColor};">
  <div style="max-width:580px;margin:0 auto;background-color:${bgCard};border-radius:20px;padding:28px;border:1px solid rgba(228,253,151,0.2);">
    <div style="margin-bottom:18px;font-size:18px;font-weight:700;color:${visualTheme === "soloist-dark" ? "#e4fd97" : "#2d3e2c"};">
      ${settings.studioName || "Soloist Studio"}
    </div>
    <p style="font-size:16px;font-weight:600;margin:0 0 16px 0;">${renderedGreeting}</p>
    <div style="font-size:14px;">
      ${paragraphsHtml}
    </div>
    ${
      renderedCtaLabel
        ? `<div style="margin:24px 0;">
      <a href="${ctaUrl}" style="display:inline-block;background-color:${accentBg};color:${accentText};font-weight:700;font-size:13px;padding:12px 24px;border-radius:999px;text-decoration:none;">
        ${renderedCtaLabel}
      </a>
    </div>`
        : ""
    }
    <hr style="border:none;border-top:1px solid rgba(150,150,150,0.2);margin:20px 0;" />
    <p style="font-size:12px;opacity:0.8;margin:0;">${renderedSignature}</p>
  </div>
</body>
</html>`;
  }

  function handleCopyContent(type: "text" | "html") {
    const content =
      type === "html" ? buildHtmlEmail() : buildPlainTextEmail();
    navigator.clipboard?.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  }

  function handleSendOrRegisterEmail(mode: "send" | "draft") {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString("pt-BR")} às ${now.toLocaleTimeString(
      "pt-BR",
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    )}`;

    const record: SoloistSentEmail = {
      id: `sent-${crypto.randomUUID()}`,
      templateName: templateName.trim() || "E-mail Personalizado",
      category,
      recipientName: activeClient?.name ?? "Cliente",
      recipientEmail: recipientEmail.trim() || "contato@cliente.com",
      projectName: activeProject?.name,
      subject: renderedSubject,
      renderedBody: renderedBody.replace(/\*\*(.*?)\*\*/g, "$1").slice(0, 160),
      status: mode === "send" ? "Enviado" : "Rascunho",
      sentAt: formattedDate,
    };

    setEmailHistory((prev) => [record, ...prev]);

    if (mode === "send") {
      pushActivityNotification({
        category: "event",
        title: `E-mail enviado para ${record.recipientName}`,
        message: `Assunto: "${renderedSubject}" (${record.recipientEmail}).`,
        actionLabel: "Ver E-mails",
        actionRoute: "/emails",
      });

      const mailtoUrl = `mailto:${encodeURIComponent(
        record.recipientEmail,
      )}?subject=${encodeURIComponent(
        renderedSubject,
      )}&body=${encodeURIComponent(buildPlainTextEmail())}`;

      window.open(mailtoUrl, "_blank", "noopener,noreferrer");
      showBanner(
        `E-mail registrado no histórico e pronto para envio para ${record.recipientEmail}!`,
      );
    } else {
      showBanner("Rascunho salvo no histórico de e-mails!");
    }
  }

  // Formatação de parágrafos com suporte a **negrito** no Visualizador
  function renderFormattedParagraphs(text: string) {
    return text.split("\n\n").map((paragraph, pIdx) => {
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={pIdx} className="leading-relaxed">
          {parts.map((part, idx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong
                  key={idx}
                  className={
                    visualTheme === "soloist-dark"
                      ? "text-pistache-solar font-bold"
                      : "text-emerald-800 font-bold"
                  }
                >
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </p>
      );
    });
  }

  const filterCategories = ["Todas", ...EMAIL_CATEGORIES];
  const filteredTemplates =
    categoryFilter === "Todas"
      ? templates
      : templates.filter((t) => t.category === categoryFilter);

  return (
    <section className="flex flex-col gap-4 max-w-6xl w-full p-3.5 sm:p-6 mx-auto backdrop-blur-md bg-green-950/60 border border-white/10 rounded-2xl">
      <PageTitleHeader
        title="E-mails"
        subtitle="Gerencie seus templates, personalize mensagens com variáveis automáticas de Clientes e Projetos e visualize o e-mail em tempo real."
        icon={<Mail size={22} />}
      />

      {/* SELETOR DE SUB-ABAS PARA TELAS PEQUENAS (< sm) */}
      <div
        className="flex sm:hidden items-center gap-1.5 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Alternar painel na página de E-mails"
      >
        {(
          [
            { id: "todas", label: "Visão Geral" },
            { id: "lista", label: `Templates (${templates.length})` },
            { id: "editor", label: "Editor" },
            { id: "preview", label: "Visualizador" },
          ] as { id: MobileEmailsTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMobileTab(tab.id)}
            className={[
              "px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer",
              mobileTab === tab.id
                ? "bg-pistache-solar text-neutral-900"
                : "bg-neutral-900/70 text-neutral-200 border border-white/10",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full items-start">
        {/* COLUNA 1 (ESQUERDA): GERENCIADOR DE TEMPLATES & HISTÓRICO DE ENVIOS */}
        <div
          className={[
            "lg:col-span-3 flex flex-col gap-4",
            mobileTab !== "todas" && mobileTab !== "lista"
              ? "hidden sm:flex"
              : "flex",
          ].join(" ")}
        >
          <SectionHeader
            title="Meus E-mails"
            icon={<FileText size={18} className="text-pistache-solar shrink-0" />}
            onAdd={handleCreateBlankTemplate}
            onFilter={() => {
              const nextIdx =
                (filterCategories.indexOf(categoryFilter) + 1) %
                filterCategories.length;
              setCategoryFilter(filterCategories[nextIdx]);
            }}
          />

          {/* Alternador entre Templates e Histórico */}
          <div className="grid grid-cols-2 gap-1.5 bg-neutral-900/70 p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setListMode("templates")}
              className={[
                "flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors",
                listMode === "templates"
                  ? "bg-pistache-solar text-neutral-900"
                  : "text-neutral-300 hover:text-white",
              ].join(" ")}
            >
              <FileText size={13} />
              <span>Templates ({templates.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setListMode("history")}
              className={[
                "flex items-center justify-center gap-1.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors",
                listMode === "history"
                  ? "bg-pistache-solar text-neutral-900"
                  : "text-neutral-300 hover:text-white",
              ].join(" ")}
            >
              <History size={13} />
              <span>Histórico ({emailHistory.length})</span>
            </button>
          </div>

          {categoryFilter !== "Todas" && listMode === "templates" && (
            <div className="flex items-center justify-between px-3 py-1 bg-pistache-solar/15 rounded-full text-xs text-pistache-solar">
              <span>Categoria: {categoryFilter}</span>
              <button
                type="button"
                onClick={() => setCategoryFilter("Todas")}
                className="underline cursor-pointer"
              >
                Limpar
              </button>
            </div>
          )}

          {listMode === "templates" ? (
            <ul className="flex flex-col gap-3 solo-card-scroll">
              {filteredTemplates.map((tpl) => {
                const isSelected = tpl.id === activeTemplateId;
                const style = CATEGORY_BADGE_STYLE[tpl.category];

                return (
                  <li key={tpl.id}>
                    <BaseCard
                      title={tpl.name}
                      headerBg={style.headerBg}
                      headerText={style.headerText}
                      minHeight="h-auto"
                      className={
                        isSelected
                          ? "ring-2 ring-pistache-solar shadow-lg"
                          : "opacity-95 hover:opacity-100"
                      }
                      rightAction={
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicateTemplate(tpl)}
                            title="Duplicar template"
                            className="p-1 rounded-full hover:bg-black/15 cursor-pointer"
                          >
                            <CopyPlus size={14} />
                          </button>
                          {templates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTemplate(tpl.id)}
                              title="Excluir template"
                              className="p-1 rounded-full hover:bg-black/15 text-red-900 cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      }
                    >
                      <div className="flex flex-col gap-2 text-xs text-neutral-200">
                        <p className="text-neutral-300 line-clamp-2 font-medium">
                          <strong>Assunto:</strong> {tpl.subject}
                        </p>

                        <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}
                          >
                            {tpl.category}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleSelectTemplate(tpl)}
                            className={[
                              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer",
                              isSelected
                                ? "bg-pistache-solar text-neutral-900"
                                : "bg-white/10 text-amber-50 hover:bg-pistache-solar hover:text-neutral-900",
                            ].join(" ")}
                          >
                            <PenLine size={12} />
                            <span>{isSelected ? "Editando" : "Editar"}</span>
                          </button>
                        </div>
                      </div>
                    </BaseCard>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="flex flex-col gap-3 solo-card-scroll">
              {emailHistory.map((item) => {
                const style = CATEGORY_BADGE_STYLE[item.category];
                return (
                  <li key={item.id}>
                    <BaseCard
                      title={item.recipientName}
                      headerBg={style.headerBg}
                      headerText={style.headerText}
                      minHeight="h-auto"
                      rightAction={
                        <button
                          type="button"
                          onClick={() =>
                            setEmailHistory((prev) =>
                              prev.filter((h) => h.id !== item.id),
                            )
                          }
                          title="Remover do histórico"
                          className="p-1 rounded-full hover:bg-black/15 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      }
                    >
                      <div className="flex flex-col gap-1.5 text-xs text-neutral-200">
                        <p className="truncate text-neutral-300">
                          <strong>Para:</strong> {item.recipientEmail}
                        </p>
                        <p className="line-clamp-2 font-semibold text-amber-50">
                          {item.subject}
                        </p>
                        <p className="text-[11px] text-neutral-400 line-clamp-2">
                          {item.renderedBody}
                        </p>
                        <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[11px]">
                          <span className="text-pistache-solar font-bold">
                            {item.status}
                          </span>
                          <span className="text-neutral-400">{item.sentAt}</span>
                        </div>
                      </div>
                    </BaseCard>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* COLUNA 2 (CENTRO): EDITOR DE E-MAIL PERSONALIZADO */}
        <div
          className={[
            "lg:col-span-4 flex flex-col gap-4",
            mobileTab !== "todas" && mobileTab !== "editor"
              ? "hidden sm:flex"
              : "flex",
          ].join(" ")}
        >
          <SectionHeader
            title="Editor de E-mail"
            icon={<PenLine size={18} className="text-pistache-solar shrink-0" />}
            badge={
              <span className="text-[11px] text-pistache-solar font-bold bg-pistache-solar/15 px-2.5 py-0.5 rounded-full">
                Dinâmico
              </span>
            }
          />

          <BaseCard
            title="Compor & Personalizar"
            headerBg="bg-neutral-700"
            headerText="text-pistache-solar"
            minHeight="h-auto"
            rightAction={
              <button
                type="button"
                onClick={handleSaveCurrentTemplate}
                className="inline-flex items-center gap-1 bg-pistache-solar text-neutral-900 text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer hover:brightness-105"
                title="Salvar alterações neste template"
              >
                <BookmarkPlus size={13} />
                <span>Salvar Template</span>
              </button>
            }
          >
            <div className="flex flex-col gap-3 p-1 max-h-145 overflow-y-auto solo-card-scroll">
              {/* Vínculo Inteligente com Cliente e Projeto do CRM */}
              <div className="bg-neutral-900/70 border border-pistache-solar/25 rounded-2xl p-3 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-pistache-solar">
                  <Sparkles size={13} />
                  <span>Preenchimento Automático do CRM</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="email-crm-client"
                      className="text-[11px] text-neutral-300 flex items-center gap-1 mb-1"
                    >
                      <UserCheck size={11} className="text-pistache-solar" />
                      <span>Cliente Destinatário</span>
                    </label>
                    <div className="flex items-center bg-neutral-500/30 h-9 px-2.5 rounded-full">
                      <select
                        id="email-crm-client"
                        value={selectedClientId}
                        onChange={(e) => {
                          const nextId = e.target.value;
                          setSelectedClientId(nextId);
                          const found = clients.find((c) => c.id === nextId);
                          if (found) {
                            setRecipientEmail(found.email);
                          }
                        }}
                        className="text-pistache-solar outline-none bg-transparent w-full text-xs truncate cursor-pointer"
                      >
                        {clients.map((cl) => (
                          <option
                            key={cl.id}
                            value={cl.id}
                            className="bg-neutral-800"
                          >
                            {cl.name} {cl.company ? `(${cl.company})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email-crm-project"
                      className="text-[11px] text-neutral-300 flex items-center gap-1 mb-1"
                    >
                      <FolderKanban size={11} className="text-pistache-solar" />
                      <span>Projeto Relacionado</span>
                    </label>
                    <div className="flex items-center bg-neutral-500/30 h-9 px-2.5 rounded-full">
                      <select
                        id="email-crm-project"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="text-pistache-solar outline-none bg-transparent w-full text-xs truncate cursor-pointer"
                      >
                        {projects.map((pr) => (
                          <option
                            key={pr.id}
                            value={pr.id}
                            className="bg-neutral-800"
                          >
                            {pr.name} — R$ {pr.value.toLocaleString("pt-BR")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nome do Template e Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  id="email-tpl-name"
                  name="templateName"
                  type="text"
                  label="Nome do Template"
                  placeholder="Nome do template"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />

                <div>
                  <label
                    htmlFor="email-category"
                    className="text-neutral-300 text-xs block mb-1 pl-2"
                  >
                    Categoria
                  </label>
                  <div className="flex items-center bg-neutral-500/30 h-10 px-3 rounded-full w-full">
                    <select
                      id="email-category"
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as EmailCategory)
                      }
                      className="text-pistache-solar outline-none bg-transparent w-full text-xs cursor-pointer"
                    >
                      {EMAIL_CATEGORIES.map((cat) => (
                        <option
                          key={cat}
                          value={cat}
                          className="bg-neutral-800"
                        >
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <Input
                id="email-recipient"
                name="recipientEmail"
                type="email"
                label="Para (E-mail do destinatário)"
                placeholder="email@cliente.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />

              <Input
                id="email-subject"
                name="subject"
                type="text"
                label="Assunto do E-mail"
                placeholder="Assunto do e-mail"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <Input
                id="email-greeting"
                name="greeting"
                type="text"
                label="Saudação Inicial"
                placeholder="Ex: Olá, {{cliente_nome}}!"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
              />

              {/* Barra de Variáveis Dinâmicas para Inserção com 1 Clique */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-medium text-neutral-200">
                    Corpo da Mensagem
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Use **texto** para destacar
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {DYNAMIC_VARIABLES.map((v) => (
                    <button
                      key={v.token}
                      type="button"
                      onClick={() => handleInsertToken(v.token)}
                      title={`Inserir variável ${v.token}`}
                      className="text-[11px] bg-neutral-900/80 hover:bg-pistache-solar hover:text-neutral-900 text-pistache-solar border border-pistache-solar/30 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                <div className="bg-neutral-500/30 p-3 rounded-2xl w-full border border-white/10">
                  <textarea
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Escreva o conteúdo do e-mail..."
                    aria-label="Corpo do e-mail"
                    className="text-pistache-solar outline-none bg-transparent w-full text-xs sm:text-sm leading-relaxed resize-y"
                  />
                </div>
              </div>

              <LineDivision />

              {/* Botão de Chamada para Ação (CTA) e Assinatura */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  id="email-cta-label"
                  name="ctaLabel"
                  type="text"
                  label="Texto do Botão (CTA)"
                  placeholder="Ex: Aprovar Proposta"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                />
                <Input
                  id="email-cta-url"
                  name="ctaUrl"
                  type="text"
                  label="Link do Botão (URL)"
                  placeholder="https://..."
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                />
              </div>

              <Input
                id="email-signature"
                name="signature"
                type="text"
                label="Assinatura do Rodapé"
                placeholder="{{usuario_nome}} • {{estudio_nome}}"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
              />

              {/* Estilo Visual do Template no Visualizador */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-neutral-300 px-1">
                  Estilo Visual do E-mail
                </span>
                <div className="grid grid-cols-3 gap-1.5 bg-neutral-900/60 p-1 rounded-full border border-white/10">
                  {(
                    [
                      { id: "soloist-dark", label: "Soloist Dark" },
                      { id: "clean-light", label: "Clean Light" },
                      { id: "editorial", label: "Editorial" },
                    ] as { id: EmailVisualTheme; label: string }[]
                  ).map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setVisualTheme(th.id)}
                      className={[
                        "py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors",
                        visualTheme === th.id
                          ? "bg-pistache-solar text-neutral-900"
                          : "text-neutral-300 hover:text-white",
                      ].join(" ")}
                    >
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>

              {statusFeedback && (
                <div className="flex items-center gap-2 bg-emerald-900/80 border border-pistache-solar/50 text-pistache-solar text-xs px-3 py-2 rounded-xl">
                  <Check size={14} className="shrink-0" />
                  <span>{statusFeedback}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSendOrRegisterEmail("send")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-pistache-solar text-neutral-900 font-bold text-xs py-2.5 px-4 rounded-full cursor-pointer hover:brightness-105 active:scale-95 transition-all"
                >
                  <Send size={13} />
                  <span>Enviar E-mail Agora</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendOrRegisterEmail("draft")}
                  className="inline-flex items-center justify-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-amber-50 border border-white/10 text-xs font-semibold py-2.5 px-3.5 rounded-full cursor-pointer transition-colors"
                >
                  <span>Salvar Rascunho</span>
                </button>
              </div>
            </div>
          </BaseCard>
        </div>

        {/* COLUNA 3 (DIREITA): VISUALIZADOR DE E-MAIL EM TEMPO REAL */}
        <div
          className={[
            "lg:col-span-5 flex flex-col gap-4",
            mobileTab !== "todas" && mobileTab !== "preview"
              ? "hidden sm:flex"
              : "flex",
          ].join(" ")}
        >
          <SectionHeader
            title="Visualizador"
            icon={<Eye size={18} className="text-pistache-solar shrink-0" />}
            badge={
              <div className="inline-flex items-center gap-1">
                {/* Alternador Desktop / Mobile */}
                <div
                  className="inline-flex items-center bg-neutral-800/90 border border-white/10 rounded-full p-0.5"
                  role="group"
                  aria-label="Alternar largura de visualização"
                >
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    title="Visualização Desktop"
                    aria-label="Visualização Desktop"
                    className={[
                      "w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                      previewDevice === "desktop"
                        ? "bg-pistache-solar text-neutral-900"
                        : "text-neutral-400 hover:text-pistache-solar",
                    ].join(" ")}
                  >
                    <Monitor size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    title="Visualização Mobile"
                    aria-label="Visualização Mobile"
                    className={[
                      "w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                      previewDevice === "mobile"
                        ? "bg-pistache-solar text-neutral-900"
                        : "text-neutral-400 hover:text-pistache-solar",
                    ].join(" ")}
                  >
                    <Smartphone size={13} />
                  </button>
                </div>

                {/* Alternador Visual / Código HTML */}
                <div
                  className="inline-flex items-center bg-neutral-800/90 border border-white/10 rounded-full p-0.5"
                  role="group"
                  aria-label="Alternar entre preview visual e código HTML"
                >
                  <button
                    type="button"
                    onClick={() => setPreviewMode("visual")}
                    title="Modo Visual Renderizado"
                    aria-label="Modo Visual Renderizado"
                    className={[
                      "w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                      previewMode === "visual"
                        ? "bg-pistache-solar text-neutral-900"
                        : "text-neutral-400 hover:text-pistache-solar",
                    ].join(" ")}
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode("html")}
                    title="Código HTML do E-mail"
                    aria-label="Código HTML do E-mail"
                    className={[
                      "w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer",
                      previewMode === "html"
                        ? "bg-pistache-solar text-neutral-900"
                        : "text-neutral-400 hover:text-pistache-solar",
                    ].join(" ")}
                  >
                    <Code2 size={13} />
                  </button>
                </div>
              </div>
            }
          />

          <BaseCard
            title={`Preview em Tempo Real (${
              previewDevice === "mobile" ? "Mobile 360px" : "Desktop"
            })`}
            headerBg="bg-pistache-solar"
            headerText="text-neutral-900"
            minHeight="h-auto"
            rightAction={
              <button
                type="button"
                onClick={() =>
                  handleCopyContent(previewMode === "html" ? "html" : "text")
                }
                className="inline-flex items-center gap-1 bg-neutral-900/15 hover:bg-neutral-900/25 text-neutral-900 text-xs font-bold px-2.5 py-0.5 rounded-full cursor-pointer"
              >
                {copiedType ? <Check size={12} /> : <Copy size={12} />}
                <span>
                  {copiedType === "html"
                    ? "HTML Copiado!"
                    : copiedType === "text"
                      ? "Texto Copiado!"
                      : "Copiar"}
                </span>
              </button>
            }
          >
            <div className="flex flex-col gap-3 p-1">
              {/* Cabeçalho do Cliente de E-mail (Metadados Reais) */}
              <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-400">
                    <strong className="text-neutral-200">De:</strong>{" "}
                    {settings.studioName} &lt;{settings.userEmail}&gt;
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_BADGE_STYLE[category].bg} ${CATEGORY_BADGE_STYLE[category].text}`}
                  >
                    {category}
                  </span>
                </div>
                <p className="text-neutral-300 truncate">
                  <strong className="text-neutral-200">Para:</strong>{" "}
                  {activeClient?.name ?? "Cliente"} &lt;{recipientEmail}&gt;
                </p>
                <p className="text-pistache-solar font-semibold font-sora pt-1 border-t border-white/10">
                  {renderedSubject}
                </p>
              </div>

              {/* Área Renderizada do E-mail ou Código Fonte HTML */}
              {previewMode === "visual" ? (
                <div
                  className={[
                    "mx-auto w-full transition-all duration-300 rounded-2xl p-4 sm:p-6 border shadow-xl",
                    previewDevice === "mobile" ? "max-w-xs" : "max-w-full",
                    visualTheme === "soloist-dark"
                      ? "bg-neutral-950/95 border-pistache-solar/30 text-neutral-100"
                      : visualTheme === "clean-light"
                        ? "bg-white border-neutral-300 text-slate-800"
                        : "bg-amber-50 border-amber-300/60 text-stone-800",
                  ].join(" ")}
                >
                  {/* Topo / Assinatura da Marca no E-mail */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-current/10">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "w-7 h-7 rounded-xl flex items-center justify-center font-sora font-bold text-xs",
                          visualTheme === "soloist-dark"
                            ? "bg-pistache-solar text-neutral-900"
                            : "bg-emerald-950 text-pistache-solar",
                        ].join(" ")}
                      >
                        S
                      </span>
                      <strong
                        className={[
                          "font-sora text-sm tracking-tight",
                          visualTheme === "soloist-dark"
                            ? "text-pistache-solar"
                            : "text-emerald-950",
                        ].join(" ")}
                      >
                        {settings.studioName || "Soloist Studio"}
                      </strong>
                    </div>
                    <span className="text-[11px] opacity-60">
                      {settings.defaultLocality}
                    </span>
                  </div>

                  {/* Saudação */}
                  <h4
                    className={[
                      "text-base font-bold font-sora mb-3",
                      visualTheme === "soloist-dark"
                        ? "text-amber-50"
                        : "text-emerald-950",
                    ].join(" ")}
                  >
                    {renderedGreeting}
                  </h4>

                  {/* Corpo do E-mail com Variáveis Interpoladas */}
                  <div className="space-y-3 text-xs sm:text-sm font-inter">
                    {renderFormattedParagraphs(renderedBody)}
                  </div>

                  {/* Resumo Destacado do Projeto (Card de Escopo Automático) */}
                  {activeProject && (
                    <div
                      className={[
                        "my-4 p-3 rounded-xl border text-xs flex items-center justify-between gap-2",
                        visualTheme === "soloist-dark"
                          ? "bg-emerald-950/70 border-pistache-solar/25 text-neutral-200"
                          : "bg-emerald-950/5 border-emerald-900/15 text-slate-700",
                      ].join(" ")}
                    >
                      <div>
                        <span className="text-[10px] uppercase tracking-wider opacity-70 block">
                          Escopo de Referência
                        </span>
                        <strong className="font-sora text-sm">
                          {activeProject.name}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] opacity-70 block">
                          Investimento
                        </span>
                        <strong
                          className={
                            visualTheme === "soloist-dark"
                              ? "text-pistache-solar font-sora text-sm"
                              : "text-emerald-800 font-sora text-sm"
                          }
                        >
                          R${" "}
                          {activeProject.value.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </strong>
                      </div>
                    </div>
                  )}

                  {/* Botão CTA do E-mail */}
                  {renderedCtaLabel && (
                    <div className="my-5">
                      <a
                        href={ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={[
                          "inline-flex items-center gap-1.5 font-bold text-xs px-5 py-2.5 rounded-full transition-transform hover:scale-[1.02]",
                          visualTheme === "soloist-dark"
                            ? "bg-pistache-solar text-neutral-900 shadow-lg shadow-pistache-solar/20"
                            : "bg-emerald-950 text-pistache-solar",
                        ].join(" ")}
                      >
                        <span>{renderedCtaLabel}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}

                  {/* Assinatura / Rodapé do E-mail */}
                  <div className="pt-4 mt-4 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] opacity-75">
                    <span>{renderedSignature}</span>
                    <span>{settings.userEmail}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-3">
                  <pre className="text-[11px] text-pistache-solar font-mono overflow-x-auto whitespace-pre-wrap max-h-96 solo-card-scroll">
                    {buildHtmlEmail()}
                  </pre>
                </div>
              )}

              {/* Barra Inferior de Ações Rápidas do Visualizador */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyContent("text")}
                    className="inline-flex items-center gap-1 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-white/10 text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                  >
                    <Copy size={12} />
                    <span>Copiar Texto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyContent("html")}
                    className="inline-flex items-center gap-1 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-white/10 text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                  >
                    <Code2 size={12} />
                    <span>Copiar HTML</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleSendOrRegisterEmail("send")}
                  className="inline-flex items-center gap-1.5 bg-pistache-solar/20 hover:bg-pistache-solar text-pistache-solar hover:text-neutral-900 border border-pistache-solar/40 font-bold text-xs px-3.5 py-1.5 rounded-full cursor-pointer transition-colors"
                >
                  <Send size={12} />
                  <span>Abrir no Cliente de E-mail</span>
                </button>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </section>
  );
}
