"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Code, Flame, FolderGit2, CheckSquare, Github,
  ArrowRight, Globe, Zap, ArrowUpRight
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-violet-500 selection:text-white">
      {/* Background Grids & Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
      </div>

      {/* Header / Navbar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-950/30">
            <Zap className="w-5 h-5 text-white fill-white/10" />
          </div>
          <span className="text-lg font-black tracking-tight text-white font-mono">
            Port<span className="text-violet-400">G</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/app"
              className="py-2 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-950/40 transition-all"
            >
              Ir para o Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs font-bold transition-all"
              >
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 flex flex-col items-center text-center justify-center">
        
        {/* Top announcement badge */}
        <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-6 animate-fade-in">
          <Zap className="w-3.5 h-3.5" />
          <span>Sua evolução tech mapeada no browser</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl font-sans">
          Centralize seus <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">Estudos Tech</span> e crie um Portfólio irresistível
        </h1>

        <p className="text-slate-400 mt-6 text-base sm:text-lg max-w-2xl leading-relaxed">
          Monitore metas semanais, gerencie tecnologias em tempo real, sincronize commits do GitHub sem complicação e gere uma página pública incrível para recrutadores.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={user ? "/app" : "/register"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-violet-950/50 hover:shadow-violet-950/70 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Começar Grátis agora
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/u/demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm transition-all"
          >
            Ver Exemplo de Portfólio
            <ArrowUpRight className="w-4 h-4 text-slate-500" />
          </Link>
        </div>

        {/* Core Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-20 md:mt-28">
          
          <div className="glass rounded-2xl p-6 border border-slate-900/60 text-left space-y-3.5 hover:border-violet-500/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Metas Semanais Ágeis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Divida seu aprendizado em metas focadas de curta duração e acompanhe seu rendimento ao longo da semana.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border border-slate-900/60 text-left space-y-3.5 hover:border-violet-500/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Hub de Tecnologias</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mantenha o controle do seu nível em cada stack, definindo metas de proficiência de forma visual e simples.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border border-slate-900/60 text-left space-y-3.5 hover:border-violet-500/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Github className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Sync Completo GitHub</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Importe seus repositórios e exiba seus commits reais de forma automática no seu portfólio público.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-slate-900/60 text-center text-xs text-slate-500 max-w-7xl w-full mx-auto px-4">
        <p>© 2026 PortG. 100% Client-Side e Privado.</p>
      </footer>
    </div>
  );
}
