"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { store } from "@/lib/store";
import { fetchGitHubProfile, fetchGitHubRepos, fetchAllRecentCommits } from "@/lib/github";
import {
  Terminal, LayoutDashboard, Code, CheckSquare, Lightbulb,
  FolderGit2, Settings, ExternalLink, LogOut, RefreshCw, User, Check
} from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, refresh } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSyncGitHub = async () => {
    if (!user || !user.github_username || syncing) return;
    setSyncing(true);
    setSyncSuccess(false);
    try {
      const profile = await fetchGitHubProfile(user.github_username);
      const repos = await fetchGitHubRepos(user.github_username);
      const commits = await fetchAllRecentCommits(user.github_username, repos, 5);

      // save imported repos
      const mappedRepos = repos.map(r => ({
        id: crypto.randomUUID(),
        user_id: user.id,
        github_repo_id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        html_url: r.html_url,
        homepage_url: r.homepage,
        language: r.language,
        topics: r.topics || [],
        stars: r.stargazers_count,
        forks: r.forks_count,
        pushed_at: r.pushed_at,
        imported_at: new Date().toISOString()
      }));
      
      await store.upsertImportedRepos(mappedRepos);
      await store.upsertCommits(commits);

      // Add a timeline event
      await store.addTimelineEvent("commit_imported", "Perfil e Repositórios Sincronizados", `GitHub: @${user.github_username}`);

      // Auto update profile avatar if empty
      if (!user.avatar_url && profile.avatar_url) {
        await store.updateProfile({ avatar_url: profile.avatar_url });
        await refresh();
      }

      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert("Erro ao sincronizar dados com o GitHub. Verifique o username.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0f19]">
        <div className="flex flex-col items-center gap-3">
          <Terminal className="w-10 h-10 text-violet-500 animate-pulse" />
          <span className="text-slate-400 font-mono text-sm">Carregando painel privado...</span>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "Dashboard", href: "/app", icon: LayoutDashboard },
    { label: "Tecnologias", href: "/app/technologies", icon: Code },
    { label: "Metas Semanais", href: "/app/goals", icon: CheckSquare },
    { label: "Insights", href: "/app/insights", icon: Lightbulb },
    { label: "Projetos", href: "/app/projects", icon: FolderGit2 },
    { label: "Configurações", href: "/app/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-slate-900 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-10">
        <div>
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-900/80">
            <Link href="/app" className="flex items-center gap-2 group">
              <Terminal className="w-5 h-5 text-violet-400" />
              <span className="font-extrabold text-lg text-white">
                PortG<span className="text-violet-400">.</span>
              </span>
            </Link>
          </div>

          {/* User Preview */}
          <div className="p-4 border-b border-slate-900/80">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 border border-slate-900/60">
              <div className="w-10 h-10 rounded-lg bg-violet-600/20 border border-violet-500/20 overflow-hidden flex items-center justify-center">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-violet-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.display_name}</p>
                <p className="text-[10px] text-violet-400 font-semibold uppercase tracking-wide">
                  {user.experience_level === "beginner" ? "Iniciante" : user.experience_level === "basic" ? "Básico" : user.experience_level === "intermediate" ? "Intermediário" : user.experience_level === "advanced" ? "Avançado" : "Profissional"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-950/50"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900/80 space-y-2">
          {user.public_username && (
            <Link
              href={`/u/${user.public_username}`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
            >
              Ver Portfólio Público
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-900/80 px-6 flex items-center justify-between sticky top-0 bg-[#0b0f19]/80 backdrop-blur-md z-10">
          <div>
            <h1 className="text-sm font-semibold text-white md:block hidden">Painel de Estudos</h1>
            {/* Mobile Brand */}
            <Link href="/app" className="flex items-center gap-2 md:hidden">
              <Terminal className="w-4 h-4 text-violet-400" />
              <span className="font-extrabold text-sm text-white">PortG.</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user.github_username && (
              <button
                onClick={handleSyncGitHub}
                disabled={syncing}
                className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  syncSuccess
                    ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-400"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                }`}
              >
                {syncSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Sincronizado!
                  </>
                ) : (
                  <>
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-violet-400" : ""}`} />
                    {syncing ? "Sincronizando..." : "Sincronizar GitHub"}
                  </>
                )}
              </button>
            )}

            {/* Mobile User Profile Link */}
            <div className="w-8 h-8 rounded-lg bg-slate-850 overflow-hidden border border-slate-800 md:hidden flex items-center justify-center">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
