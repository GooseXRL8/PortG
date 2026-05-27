"use client";
import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { getWeekBounds, formatDate, TECH_STATUSES } from "@/lib/utils";
import {
  Code, CheckSquare, FolderGit2, Star, Flame, Trophy,
  TrendingUp, Calendar, ArrowUpRight, Github, Lightbulb
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    completedGoals: 0,
    totalGoals: 0,
    activeTechs: 0,
    publicProjects: 0,
    totalCommits: 0,
    streak: 0
  });

  const [recentCommits, setRecentCommits] = useState<any[]>([]);
  const [weeklyGoals, setWeeklyGoals] = useState<any[]>([]);
  const [techSummary, setTechSummary] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const userId = await store.getCurrentUserId();
      if (!userId) return;

      const [techs, goals, projects, commits, events] = await Promise.all([
        store.getTechnologies(userId),
        store.getGoals(userId),
        store.getProjects(userId),
        store.getCommits(userId),
        store.getTimeline(userId)
      ]);

      // Week boundaries
      const { start, end } = getWeekBounds();
      const thisWeekGoals = goals.filter(
        (g) => g.week_start >= start && g.week_start <= end
      );
      const completedThisWeek = thisWeekGoals.filter((g) => g.status === "completed").length;

      // Simple Streak Mock calculation:
      // If user has any activity (timeline events) in past consecutive days
      let streakCount = 0;
      const uniqueDays = new Set(
        events.map((e) => e.created_at.split("T")[0])
      );
      const todayStr = new Date().toISOString().split("T")[0];
      let checkDate = new Date();
      
      while (true) {
        const checkStr = checkDate.toISOString().split("T")[0];
        if (uniqueDays.has(checkStr)) {
          streakCount++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          // If we checked today and didn't find, let's check yesterday to not break immediately
          if (checkStr === todayStr) {
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
          break;
        }
      }

      setMetrics({
        completedGoals: completedThisWeek,
        totalGoals: thisWeekGoals.length,
        activeTechs: techs.filter((t) => t.status === "studying").length,
        publicProjects: projects.filter((p) => p.visibility === "public").length,
        totalCommits: commits.length,
        streak: streakCount
      });

      setRecentCommits(commits.slice(0, 5));
      setWeeklyGoals(thisWeekGoals);

      // Group technologies by category
      const categories: Record<string, number> = {};
      techs.forEach((t) => {
        categories[t.category] = (categories[t.category] || 0) + 1;
      });
      setTechSummary(Object.entries(categories).map(([name, val]) => ({ name, val })));
    };

    loadDashboardData();
  }, []);

  const completionRate = metrics.totalGoals > 0 
    ? Math.round((metrics.completedGoals / metrics.totalGoals) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Sua Evolução Tech
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Acompanhe suas metas de estudos, commits recentes e portfólio público.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric Card 1 */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 text-violet-500/10 group-hover:text-violet-500/20 transition-colors">
            <Flame className="w-16 h-16" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sequência de Estudos</p>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-white">{metrics.streak}</span>
            <span className="text-sm text-violet-400 font-semibold">dias seguidos</span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>Mantenha a constância diária!</span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
            <CheckSquare className="w-16 h-16" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Metas Semanais</p>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-white">
              {metrics.completedGoals}/{metrics.totalGoals}
            </span>
            <span className="text-sm text-emerald-400 font-semibold">({completionRate}%)</span>
          </div>
          {/* Progress bar */}
          <div className="mt-4 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500" 
              style={{ width: `${completionRate}%` }} 
            />
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
            <Code className="w-16 h-16" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tecnologias Ativas</p>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-white">{metrics.activeTechs}</span>
            <span className="text-sm text-slate-400">em estudo</span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            <span>Focadas no seu objetivo principal</span>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
            <FolderGit2 className="w-16 h-16" />
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projetos Públicos</p>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-white">{metrics.publicProjects}</span>
            <span className="text-sm text-slate-400">no portfólio</span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <Github className="w-3.5 h-3.5 text-slate-400" />
            <span>Importados do GitHub</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side (Goals & Techs) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goals Card */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold text-white">Metas desta Semana</h2>
              </div>
              <Link
                href="/app/goals"
                className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
              >
                Gerenciar metas
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {weeklyGoals.length === 0 ? (
              <div className="text-center py-10 rounded-xl bg-slate-950/20 border border-slate-900/60 p-6">
                <CheckSquare className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-300">Nenhuma meta criada para esta semana</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Crie metas pequenas e realistas para manter o foco e evoluir seus conhecimentos.
                </p>
                <Link
                  href="/app/goals"
                  className="inline-flex items-center gap-1.5 mt-4 py-2 px-4 rounded-xl bg-violet-600/20 border border-violet-500/20 text-violet-300 hover:bg-violet-600/30 text-xs font-semibold transition-all"
                >
                  Criar minha primeira meta
                </Link>
              </div>
            ) : (
              <div className="space-y-3.5">
                {weeklyGoals.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-950/40 border border-slate-900/80"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          g.status === "completed"
                            ? "bg-emerald-500"
                            : g.status === "in_progress"
                            ? "bg-violet-500"
                            : "bg-slate-700"
                        }`}
                      />
                      <div>
                        <p className={`text-sm font-semibold text-white ${g.status === "completed" ? "line-through text-slate-500" : ""}`}>
                          {g.title}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                          Prioridade: {g.priority}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-md ${
                        g.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                          : g.status === "in_progress"
                          ? "bg-violet-500/10 text-violet-400 border border-violet-500/15"
                          : "bg-slate-900 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {g.status === "completed" ? "Concluída" : g.status === "in_progress" ? "Em andamento" : "Pendente"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visual Category Chart & Analytics */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-bold text-white">Resumo do Aprendizado</h2>
            </div>
            
            {techSummary.length === 0 ? (
              <div className="text-center py-10 rounded-xl bg-slate-950/20 border border-slate-900/60 p-6">
                <Code className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-300">Nenhuma tecnologia adicionada</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Adicione tecnologias no seu hub para podermos mapear suas habilidades.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">Distribuição de conhecimentos por categorias principais:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {techSummary.map((cat, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/30 border border-slate-900/60">
                      <div className="flex justify-between items-center text-xs font-semibold mb-2">
                        <span className="text-slate-300">{cat.name}</span>
                        <span className="text-violet-400">{cat.val} {cat.val > 1 ? "tecnologias" : "tecnologia"}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-600" 
                          style={{ width: `${Math.min(cat.val * 20, 100)}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side (Commits & Sync status) */}
        <div className="space-y-6">
          {/* Commits / GitHub Sinks */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Github className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-bold text-white">Commits Recentes</h2>
            </div>

            {recentCommits.length === 0 ? (
              <div className="text-center py-10">
                <Github className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-300">Sem commits sincronizados</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Sincronize seu perfil com o botão &quot;Sincronizar GitHub&quot; no topo.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCommits.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-400">
                        {i + 1}
                      </div>
                      {i < recentCommits.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-900 my-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate hover:text-violet-400 transition-colors">
                        <a href={c.html_url} target="_blank" rel="noopener noreferrer">
                          {c.message}
                        </a>
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono truncate">
                        {c.repository_name} • {formatDate(c.committed_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="glass rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-violet-950/20 to-slate-950/40">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white">Dica de Sucesso</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mantenha o seu portfólio público atualizado! Escreva um pequeno insight sempre que aprender um conceito novo ou resolver um bug complexo. Recrutadores valorizam a capacidade de comunicação técnica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
