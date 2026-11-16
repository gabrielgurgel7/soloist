import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { CheckCircle2, CloudUpload, LogOut, CircleAlert } from "lucide-react";
import { BaseCard } from "../cards/BaseCard";
import { LineDivision } from "../division/LineDivision";
import { InputEmail } from "../inputs/InputEmail";
import { InputPassword } from "../inputs/InputPassword";
import { CloseButton, SendButton } from "../buttons/Buttons";
import {
  getSoloistFirebase,
  syncLocalCrmWithPostgres,
} from "../../lib/firebase";

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
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  if (raw.includes("auth/network-request-failed")) {
    return "Sem conexão com o servidor de autenticação (verifique sua internet ou se o emulador está rodando).";
  }
  return raw;
}

export function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    setErrorMessage(null);
    setStatusMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Preencha seu e-mail e senha para continuar.");
      return;
    }

    try {
      const { auth } = getSoloistFirebase();
      const credential = isRegisterMode
        ? await createUserWithEmailAndPassword(auth, email.trim(), password)
        : await signInWithEmailAndPassword(auth, email.trim(), password);

      setStatusMessage(
        isRegisterMode
          ? "Conta criada e autenticada com sucesso!"
          : "Login realizado com sucesso!",
      );

      if (credential.user.email) {
        await syncLocalCrmWithPostgres(credential.user.email).catch(
          () => undefined,
        );
      }
    } catch (err) {
      setErrorMessage(formatFirebaseAuthError(err));
    }
  }

  async function handleGoogleLogin() {
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const { auth } = getSoloistFirebase();
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      setStatusMessage("Autenticado com Google!");
      if (credential.user.email) {
        await syncLocalCrmWithPostgres(credential.user.email).catch(
          () => undefined,
        );
      }
    } catch (err) {
      setErrorMessage(formatFirebaseAuthError(err));
    }
  }

  async function handleManualPostgresSync() {
    if (!currentUser) return;
    setIsSyncing(true);
    setErrorMessage(null);
    try {
      await syncLocalCrmWithPostgres(currentUser.email ?? "gabriel@soloist.app");
      setStatusMessage("Dados sincronizados com o PostgreSQL (SQL Connect)!");
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
    setStatusMessage("Sessão encerrada.");
  }

  return (
    <BaseCard
      className="max-w-sm w-full"
      title={isRegisterMode ? "Criar Conta" : "Login"}
      headerBg="bg-neutral-700"
      headerText="text-pistache-solar"
      minHeight="h-auto"
      rightAction={<CloseButton onClose={onClose} />}
    >
      {currentUser ? (
        <div className="flex flex-col gap-3 p-2 text-xs text-neutral-200">
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-pistache-solar/40 p-3 rounded-2xl">
            <CheckCircle2 size={18} className="text-pistache-solar shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-pistache-solar truncate">
                Conectado ao Firebase Auth
              </p>
              <span className="text-neutral-300 block truncate">
                {currentUser.email}
              </span>
            </div>
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
                : "Sincronizar CRM com PostgreSQL"}
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
            <span>Sair da conta</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleEmailAuth}>
          <fieldset className="flex flex-col gap-4 p-2">
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
