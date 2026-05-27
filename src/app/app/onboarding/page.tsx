"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { store } from "@/lib/store";
import { 
  Sparkles, Terminal, ChevronRight, ChevronLeft, 
  Github, User, Globe, Code, ArrowRight 
} from "lucide-react";

export default function OnboardingPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [currentFocus, setCurrentFocus] = useState("");
  const [expLevel, setExpLevel] = useState<"beginner" | "basic" | "intermediate" | "advanced" | "professional">("beginner");
  const [gitUser, setGitUser] = useState("");
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.onboarding_completed) {
      router.push("/app");
    } else {
      setDisplayName(user.display_name || "");
    }
  }, [user, router]);

  const handleNextStep = async () => {
    setError(null);
    if (step === 1) {
      if (!displayName.trim()) {
        setError("Nome de exibição é obrigatório.");
        return;
      }
      if (!username.trim()) {
        setError("Username público do portfólio é obrigatório.");
        return;
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(username)) {
        setError("Username deve conter apenas letras, números, hífen e underscore.");
        return;
      }
      // check uniqueness
      try {
        const users = await store.getUsers();
        const existing = users.find(u => u.public_username && u.public_username.toLowerCase() === username.toLowerCase() && u.id !== user?.id);
        if (existing) {
          setError("Este username público já está em uso.");
          return;
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro ao validar username.");
        return;
      }
    }
    if (step === 2) {
      if (!headline.trim()) {
        setError("Headline profissional é obrigatória.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleFinish = async () => {
    setError(null);
    try {
      await store.updateProfile({
        display_name: displayName,
        public_username: username.toLowerCase().trim(),
        headline,
        bio,
        current_focus: currentFocus,
        experience_level: expLevel,
        github_username: gitUser.trim(),
        onboarding_completed: true,
      });
      await refresh();
      router.push("/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao finalizar configuração.");
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-initial">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border transition-all duration-300 ${
                  step === s
                    ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-950"
                    : step > s
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-400"
                    : "bg-slate-900 border-slate-800 text-slate-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 flex-1 mx-4 rounded transition-all duration-500 ${
                    step > s ? "bg-emerald-500" : "bg-slate-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-medium">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Identidade do seu Portfólio</h2>
                <p className="text-slate-400 text-xs mb-4">Escolha como as pessoas vão te encontrar na plataforma</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Nome Público
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Username do Portfólio
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Globe className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="joaosilva"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm font-mono"
                  />
                </div>
                {username && (
                  <p className="text-xs text-slate-500 mt-2">
                    Seu link será: <span className="text-violet-400 font-mono">portg.com/u/{username.toLowerCase()}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Seu Perfil Profissional</h2>
                <p className="text-slate-400 text-xs mb-4">Conte um pouco sobre sua carreira, objetivos e foco principal</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Headline Principal
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Ex: Desenvolvedor Front-end React em formação"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Minha Bio (Sobre Mim)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Escreva brevemente sua história, o que te motiva e no que você foca..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Foco Atual de Estudos
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Code className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={currentFocus}
                    onChange={(e) => setCurrentFocus(e.target.value)}
                    placeholder="Ex: Next.js, TailwindCSS e TypeScript"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Nível & Integração GitHub</h2>
                <p className="text-slate-400 text-xs mb-4">Escolha seu nível atual de experiência e conecte sua conta do GitHub</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Nível de Experiência Atual
                </label>
                <select
                  value={expLevel}
                  onChange={(e) => setExpLevel(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm"
                >
                  <option value="beginner">Iniciante</option>
                  <option value="basic">Básico</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                  <option value="professional">Profissional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Seu Username do GitHub (Público)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Github className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={gitUser}
                    onChange={(e) => setGitUser(e.target.value)}
                    placeholder="Ex: lucassilva"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-white focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200 text-sm font-mono"
                  />
                </div>
                <p className="text-slate-500 text-[10px] mt-2">
                  Buscaremos repositórios públicos, commits e avatar automaticamente.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800/80">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-1 text-slate-400 hover:text-white font-semibold text-sm transition-colors px-4 py-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-300"
              >
                Próximo Passo
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-1.5 py-2.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-950/50 transition-all duration-300 active:scale-95"
              >
                Finalizar Configuração
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
