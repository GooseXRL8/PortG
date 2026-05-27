"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { store } from "@/lib/store";
import { Save, User, Settings, Eye, Palette, Check } from "lucide-react";

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  
  // Profile state
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [currentFocus, setCurrentFocus] = useState("");
  const [expLevel, setExpLevel] = useState<any>("beginner");
  const [githubUser, setGithubUser] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [emailPublic, setEmailPublic] = useState("");

  // Settings state
  const [showEmail, setShowEmail] = useState(false);
  const [showGithub, setShowGithub] = useState(true);
  const [showLinkedin, setShowLinkedin] = useState(true);
  const [showCommits, setShowCommits] = useState(true);
  const [showGoals, setShowGoals] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || "");
      setHeadline(user.headline || "");
      setBio(user.bio || "");
      setCurrentFocus(user.current_focus || "");
      setExpLevel(user.experience_level || "beginner");
      setGithubUser(user.github_username || "");
      setLinkedinUrl(user.linkedin_url || "");
      setWebsiteUrl(user.website_url || "");
      setEmailPublic(user.email_public || "");

      const loadSettings = async () => {
        const ps = await store.getPortfolioSettings(user.id);
        if (ps) {
          setShowEmail(ps.show_email);
          setShowGithub(ps.show_github);
          setShowLinkedin(ps.show_linkedin);
          setShowCommits(ps.show_commits);
          setShowGoals(ps.show_goals);
          setShowInsights(ps.show_insights);
          setShowTimeline(ps.show_learning_timeline);
        }
      };
      loadSettings();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      // update profile details
      await store.updateProfile({
        display_name: displayName,
        headline,
        bio,
        current_focus: currentFocus,
        experience_level: expLevel,
        github_username: githubUser,
        linkedin_url: linkedinUrl,
        website_url: websiteUrl,
        email_public: emailPublic
      });

      // update portfolio display configurations
      await store.updatePortfolioSettings({
        show_email: showEmail,
        show_github: showGithub,
        show_linkedin: showLinkedin,
        show_commits: showCommits,
        show_goals: showGoals,
        show_insights: showInsights,
        show_learning_timeline: showTimeline
      });

      await refresh();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar dados.");
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Configurações</h1>
        <p className="text-slate-400 text-xs mt-1">Gerencie os detalhes do seu perfil e o que aparece no seu portfólio público.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" /> Configurações salvas com sucesso!
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel - User Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-violet-400" />
                Dados do Perfil
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nome de Exibição</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nível Atual</label>
                  <select
                    value={expLevel}
                    onChange={(e) => setExpLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    <option value="beginner">Iniciante</option>
                    <option value="basic">Básico</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                    <option value="professional">Profissional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Headline Profissional</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bio / Sobre Mim</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Foco Atual</label>
                  <input
                    type="text"
                    value={currentFocus}
                    onChange={(e) => setCurrentFocus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username do GitHub</label>
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Site Pessoal</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://meusite.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">E-mail Público</label>
                  <input
                    type="email"
                    value={emailPublic}
                    onChange={(e) => setEmailPublic(e.target.value)}
                    placeholder="contato@meuemail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Portfolio Configurations */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-violet-400" />
                Seções do Portfólio
              </h2>

              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer py-1.5 text-xs text-slate-300 font-semibold">
                  <span>Exibir e-mail de contato?</span>
                  <input
                    type="checkbox"
                    checked={showEmail}
                    onChange={(e) => setShowEmail(e.target.checked)}
                    className="w-4 h-4 text-violet-600 bg-slate-900 border-slate-850 rounded focus:ring-violet-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1.5 text-xs text-slate-300 font-semibold">
                  <span>Exibir link do GitHub?</span>
                  <input
                    type="checkbox"
                    checked={showGithub}
                    onChange={(e) => setShowGithub(e.target.checked)}
                    className="w-4 h-4 text-violet-600 bg-slate-900 border-slate-850 rounded focus:ring-violet-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1.5 text-xs text-slate-300 font-semibold">
                  <span>Exibir link do LinkedIn?</span>
                  <input
                    type="checkbox"
                    checked={showLinkedin}
                    onChange={(e) => setShowLinkedin(e.target.checked)}
                    className="w-4 h-4 text-violet-600 bg-slate-900 border-slate-850 rounded focus:ring-violet-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1.5 text-xs text-slate-300 font-semibold">
                  <span>Exibir commits do GitHub?</span>
                  <input
                    type="checkbox"
                    checked={showCommits}
                    onChange={(e) => setShowCommits(e.target.checked)}
                    className="w-4 h-4 text-violet-600 bg-slate-900 border-slate-850 rounded focus:ring-violet-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1.5 text-xs text-slate-300 font-semibold">
                  <span>Exibir metas de estudos?</span>
                  <input
                    type="checkbox"
                    checked={showGoals}
                    onChange={(e) => setShowGoals(e.target.checked)}
                    className="w-4 h-4 text-violet-600 bg-slate-900 border-slate-850 rounded focus:ring-violet-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1.5 text-xs text-slate-300 font-semibold">
                  <span>Exibir anotações/insights?</span>
                  <input
                    type="checkbox"
                    checked={showInsights}
                    onChange={(e) => setShowInsights(e.target.checked)}
                    className="w-4 h-4 text-violet-600 bg-slate-900 border-slate-850 rounded focus:ring-violet-500"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer py-1.5 text-xs text-slate-300 font-semibold">
                  <span>Exibir timeline de evolução?</span>
                  <input
                    type="checkbox"
                    checked={showTimeline}
                    onChange={(e) => setShowTimeline(e.target.checked)}
                    className="w-4 h-4 text-violet-600 bg-slate-900 border-slate-850 rounded focus:ring-violet-500"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-950/50 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
