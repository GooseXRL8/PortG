"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Terminal, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { user, login, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.onboarding_completed) {
        router.push("/app");
      } else {
        router.push("/app/onboarding");
      }
    }
  }, [user, router]);

  useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
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
          <h2 className="text-2xl font-bold text-white tracking-tight">Bem-vindo de volta!</h2>
          <p className="text-slate-400 mt-2 text-sm">Organize seus estudos e acelere sua carreira tech</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-950/50 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              {submitting ? "Entrando..." : "Entrar no Painel"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-xs text-slate-500 hover:text-violet-400 font-medium transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Ainda não tem uma conta?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Criar conta gratuita
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
