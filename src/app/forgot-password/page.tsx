"use client";
import React, { useState } from "react";
import { store } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Terminal, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";

type Step = "email" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const users = await store.getUsers();
      const user = users.find((u) => u.email === email);
      if (!user) {
        setError("Nenhuma conta encontrada com esse endereço de e-mail.");
        return;
      }

      setStep("reset");
    } catch (err) {
      setError("Erro ao verificar conta.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem. Tente novamente.");
      return;
    }

    setSubmitting(true);

    try {
      await store.resetPassword(email, newPassword);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao redefinir senha.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header/Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="p-2.5 rounded-xl bg-violet-600/20 border border-violet-500/30 group-hover:border-violet-500/50 transition-all duration-300">
              <Terminal className="w-6 h-6 text-violet-400 group-hover:rotate-6 transition-transform" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              PortG<span className="text-violet-400">.</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {success ? "Senha Redefinida!" : step === "email" ? "Recuperar Senha" : "Nova Senha"}
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            {success
              ? "Sua senha foi atualizada com sucesso. Redirecionando..."
              : step === "email"
              ? "Informe o e-mail da sua conta para continuar"
              : "Defina uma nova senha segura para sua conta"}
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

          {/* Success State */}
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-sm text-slate-300 font-semibold text-center">
                Tudo certo! Você já pode fazer login com sua nova senha.
              </p>
              <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
            </div>
          ) : step === "email" ? (
            /* Step 1: Verify Email */
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-950/50 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                Verificar E-mail
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Step 2: Set New Password */
            <form onSubmit={handleResetSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-violet-400 shrink-0" />
                <p className="text-xs text-slate-300">
                  Redefinindo senha para <span className="font-bold text-white">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(null); }}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-semibold transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-950/50 transition-all duration-300 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Salvando..." : "Redefinir Senha"}
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-slate-400">
            Lembrou a senha?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
