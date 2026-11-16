import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  CheckCircle2,
  CloudUpload,
  LogOut,
  CircleAlert,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import { BaseCard } from "../cards/BaseCard";
import { LineDivision } from "../division/LineDivision";
import { InputEmail } from "../inputs/InputEmail";
import { InputPassword } from "../inputs/InputPassword";
import { CloseButton, SendButton } from "../buttons/Buttons";
import {
  getSoloistFirebase,
  pullUserAccountFromPostgres,
  pushSettingsToPostgres,
  syncLocalCrmWithPostgres,
} from "../../lib/firebase";
import {
  setActiveSessionUser,
  getStoredSettings,
  saveStoredSettings,
} from "../../services/crmStorage";

interface LoginFormProps {
  onClose?: () => void;
}

function formatFirebaseAuthError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes("auth/configuration-not-found")) {
    return "Ative o provedor 'E-mail/senha' (e Google) em Authentication -> Sign-in method lá no Firebase Console.";
  }
  if (
    raw.includes("auth/invalid-credential") ||
    raw.includes("auth/user-not-found") ||
    raw.includes("auth/wrong-password")
  ) {
    return "E-mail ou senha incorretos (ou clique em 'Registre-se' abaixo se ainda não criou sua conta).";
  }
  if (raw.includes("auth/email-already-in-use")) {
    return "Este e-mail já possui conta cadastrada. Clique em 'Já tenho conta (Entrar)'.";
  }
  if (raw.includes("auth/weak-password")) {
    return "A senha precisa ter pelo menos 8 caracteres para maior segurança.";
  }
  if (raw.includes("auth/too-many-requests")) {
    return "Muitas tentativas seguidas. Aguarde alguns instantes antes de tentar novamente.";
  }
  if (raw.includes("auth/network-request-failed")) {
    return "Sem conexão com o servidor de autenticação.";
  }
  return raw;
}

export function LoginForm({ onClose }: LoginFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    try {
      const { auth } = getSoloistFirebase();
      return onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
      });
    } catch {
      return undefined;
    }
  }, []);

  async function handleEmailAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setErrorMessage(null);
    setStatusMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Preencha seu e-mail e senha para continuar.");
      return;
    }

    if (isRegisterMode) {
      if (!fullName.trim()) {
        setErrorMessage("Informe seu nome para personalizar sua conta.");
        return;
      }
      if (password.length < 8) {
        setErrorMessage(
          "Por segurança, crie uma senha com pelo menos 8 caracteres.",
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const { auth } = getSoloistFirebase();

      if (isRegisterMode) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        const cleanName = fullName.trim();
        await updateProfile(credential.user, { displayName: cleanName });

        setActiveSessionUser({
          uid: credential.user.uid,
          email: credential.user.email || email.trim(),
          displayName: cleanName,
        });

        const currentSettings = getStoredSettings();
        const updatedSettings = {
          ...currentSettings,
          userName: cleanName,
          userEmail: credential.user.email || email.trim(),
          studioName: currentSettings.studioName || `Estúdio ${cleanName.split(" ")[0]}`,
        };
        saveStoredSettings(updatedSettings);
        await pushSettingsToPostgres(updatedSettings).catch(() => undefined);
        await pullUserAccountFromPostgres(credential.user).catch(
          () => undefined,
        );

        setStatusMessage("Conta criada e sincronizada com sucesso!");
      } else {
        const credential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );
        const derivedName =
          credential.user.displayName?.trim() ||
          credential.user.email?.split("@")[0] ||
          "Usuário";

        setActiveSessionUser({
          uid: credential.user.uid,
          email: credential.user.email || email.trim(),
          displayName: derivedName,
        });

        await pullUserAccountFromPostgres(credential.user).catch(
          () => undefined,
        );
        setStatusMessage("Login realizado e dados da sua conta carregados!");
      }
    } catch (err) {
      setErrorMessage(formatFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    if (isSubmitting) return;
    setErrorMessage(null);
    setStatusMessage(null);
    setIsSubmitting(true);
    try {
      const { auth } = getSoloistFirebase();
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      const derivedName =
        credential.user.displayName?.trim() ||
        credential.user.email?.split("@")[0] ||
        "Usuário";

      setActiveSessionUser({
        uid: credential.user.uid,
        email: credential.user.email || "",
        displayName: derivedName,
      });

      await pullUserAccountFromPostgres(credential.user).catch(() => undefined);
      setStatusMessage("Autenticado com Google e dados da conta carregados!");
    } catch (err) {
      setErrorMessage(formatFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleManualPostgresSync() {
    if (!currentUser) return;
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      await syncLocalCrmWithPostgres(currentUser.email ?? "");
      setStatusMessage("Dados da sua conta sincronizados com o PostgreSQL!");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao sincronizar com o PostgreSQL.";
      setErrorMessage(msg);
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleSignOut() {
    const { auth } = getSoloistFirebase();
    await signOut(auth);
    setActiveSessionUser(null);
    setEmail("");
    setPassword("");
    setFullName("");
    setStatusMessage("Sessão encerrada com segurança.");
  }

  const displayedName =
    getStoredSettings().userName ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "Usuário";

  return (
    <BaseCard
      className="max-w-sm w-full"
      title={
        currentUser ? "Minha Conta" : isRegisterMode ? "Criar Conta" : "Login"
      }
      headerBg="bg-neutral-700"
      headerText="text-pistache-solar"
      minHeight="h-auto"
      rightAction={<CloseButton onClose={onClose} />}
    >
      {currentUser ? (
        <div className="flex flex-col gap-3 p-2 text-xs text-neutral-200">
          <div className="flex items-center gap-2.5 bg-emerald-950/80 border border-pistache-solar/40 p-3 rounded-2xl">
            <CheckCircle2 size={18} className="text-pistache-solar shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-pistache-solar truncate text-sm font-sora">
                {displayedName}
              </p>
              <span className="text-neutral-300 block truncate">
                {currentUser.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-neutral-300 bg-neutral-900/60 border border-white/10 px-3 py-2 rounded-xl">
            <ShieldCheck size={14} className="text-pistache-solar shrink-0" />
            <span>
              Sessão isolada por UID • Criptografia JWT + PostgreSQL Row-Level
              Security ativa
            </span>
          </div>

          <button
            type="button"
            disabled={isSyncing}
            onClick={handleManualPostgresSync}
            className="flex items-center justify-center gap-2 bg-pistache-solar text-neutral-900 font-bold h-9 w-full rounded-full px-4 hover:brightness-105 transition-all cursor-pointer disabled:opacity-50"
          >
            <CloudUpload size={15} />
            <span>
              {isSyncing
                ? "Sincronizando PostgreSQL..."
                : "Sincronizar Dados com a Nuvem"}
            </span>
          </button>

          {statusMessage && (
            <p className="text-pistache-solar text-center font-medium">
              {statusMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-red-300 text-center">{errorMessage}</p>
          )}

          <LineDivision />

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center justify-center gap-1.5 text-neutral-200 border border-neutral-500 h-8 w-full rounded-full px-4 hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleEmailAuth}>
          <fieldset
            disabled={isSubmitting}
            className="flex flex-col gap-3.5 p-2"
          >
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center text-neutral-50 bg-neutral-500 h-8 w-full rounded-full px-4 hover:bg-neutral-400 transition-colors cursor-pointer text-xs font-medium"
              >
                Google
              </button>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center text-neutral-50 bg-neutral-500 h-8 w-full rounded-full px-4 hover:bg-neutral-400 transition-colors cursor-pointer text-xs font-medium"
              >
                Apple
              </button>
            </div>
            <LineDivision />

            {isRegisterMode && (
              <div className="flex items-center gap-2 bg-neutral-500/30 h-10 pr-3 rounded-full w-full">
                <div className="flex items-center justify-center bg-neutral-300 text-neutral-900 h-10 w-10 rounded-full shrink-0">
                  <UserRound size={18} />
                </div>
                <label htmlFor="register-full-name" className="sr-only">
                  Seu nome
                </label>
                <input
                  id="register-full-name"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome (ex: Gabriel)"
                  className="text-pistache-solar outline-none bg-transparent w-full text-sm"
                />
              </div>
            )}

            <InputEmail value={email} onChange={setEmail} />
            <InputPassword value={password} onChange={setPassword} />

            {errorMessage && (
              <div className="flex items-center gap-1.5 text-xs text-red-300 bg-red-950/60 border border-red-500/30 rounded-xl p-2">
                <CircleAlert size={13} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {statusMessage && (
              <div className="flex items-center gap-1.5 text-xs text-pistache-solar bg-emerald-950/70 border border-pistache-solar/40 rounded-xl p-2">
                <CheckCircle2 size={13} className="shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <small className="text-neutral-400">
                Ao continuar, você concorda com nossos{" "}
                <Link
                  to="/terms"
                  className="text-pistache-solar hover:underline"
                >
                  Termos de Uso
                </Link>{" "}
                e{" "}
                <Link
                  to="/privacy"
                  className="text-pistache-solar hover:underline"
                >
                  Política de Privacidade
                </Link>
                .
              </small>

              <SendButton />
            </div>
            <LineDivision />
            <div className="inline-flex gap-2 items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode((prev) => !prev);
                  setErrorMessage(null);
                  setStatusMessage(null);
                }}
                className="flex items-center justify-center text-neutral-50 text-sm border border-neutral-500 h-8 w-full rounded-full px-4 hover:bg-neutral-400 transition-colors cursor-pointer"
              >
                {isRegisterMode ? "Já tenho conta (Entrar)" : "Registre-se"}
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </BaseCard>
  );
}
