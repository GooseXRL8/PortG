"use client";
import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { slugify, PROJECT_STATUSES } from "@/lib/utils";
import { Plus, FolderGit2, Trash2, Edit2, X, Github, Globe, Star, EyeOff, Sparkles, Import } from "lucide-react";
import type { Project, ProjectStatus, ProjectVisibility } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [importedRepos, setImportedRepos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showImportList, setShowImportList] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("in_development");
  const [visibility, setVisibility] = useState<ProjectVisibility>("private");
  const [featured, setFeatured] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [fetchedProjects, fetchedRepos] = await Promise.all([
      store.getProjects(),
      store.getImportedRepos()
    ]);
    setProjects(fetchedProjects);
    setImportedRepos(fetchedRepos);
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setTitle("");
    setShortDescription("");
    setLongDescription("");
    setStackInput("");
    setTechStack([]);
    setRepoUrl("");
    setDemoUrl("");
    setStatus("in_development");
    setVisibility("private");
    setFeatured(false);
    setCoverUrl("");
    setShowForm(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setTitle(p.title);
    setShortDescription(p.short_description || "");
    setLongDescription(p.long_description || "");
    setTechStack(p.tech_stack || []);
    setRepoUrl(p.repo_url || "");
    setDemoUrl(p.demo_url || "");
    setStatus(p.status);
    setVisibility(p.visibility);
    setFeatured(p.featured);
    setCoverUrl(p.cover_image_url || "");
    setStackInput("");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      await store.deleteProject(id);
      await loadData();
    }
  };

  const handleImportRepo = async (repo: any) => {
    const slug = slugify(repo.name);
    
    // check slug uniqueness
    const list = await store.getProjects();
    if (list.find(p => p.slug === slug)) {
      alert("Já existe um projeto com este slug/nome.");
      return;
    }

    await store.createProject({
      github_repository_id: String(repo.github_repo_id || repo.id),
      title: repo.name,
      slug,
      short_description: repo.description || "",
      long_description: "",
      tech_stack: repo.language ? [repo.language] : [],
      cover_image_url: "",
      repo_url: repo.html_url,
      demo_url: repo.homepage_url || "",
      status: "published",
      visibility: "public",
      featured: false,
      display_order: 0
    });

    setShowImportList(false);
    await loadData();
  };

  const handleAddStack = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && stackInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(stackInput.trim())) {
        setTechStack([...techStack, stackInput.trim()]);
      }
      setStackInput("");
    }
  };

  const handleRemoveStack = (idx: number) => {
    setTechStack(techStack.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const slug = slugify(title);

    if (editingProject) {
      await store.updateProject(editingProject.id, {
        title,
        slug,
        short_description: shortDescription,
        long_description: longDescription,
        tech_stack: techStack,
        repo_url: repoUrl,
        demo_url: demoUrl,
        status,
        visibility,
        featured,
        cover_image_url: coverUrl
      });
    } else {
      await store.createProject({
        github_repository_id: null,
        title,
        slug,
        short_description: shortDescription,
        long_description: longDescription,
        tech_stack: techStack,
        repo_url: repoUrl,
        demo_url: demoUrl,
        status,
        visibility,
        featured,
        cover_image_url: coverUrl,
        display_order: 0
      });
    }

    setShowForm(false);
    await loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Seus Projetos</h1>
          <p className="text-slate-400 text-xs mt-1">Crie projetos manualmente ou importe diretamente do GitHub.</p>
        </div>
        <div className="flex gap-2">
          {importedRepos.length > 0 && (
            <button
              onClick={() => setShowImportList(true)}
              className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
            >
              <Import className="w-4 h-4 text-violet-400" />
              Importar GitHub
            </button>
          )}
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-950/50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Novo Projeto
          </button>
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full text-center py-16 glass rounded-2xl border border-slate-900/60 p-8">
            <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">Sem projetos no portfólio</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Adicione projetos para os recrutadores verem suas habilidades aplicadas em código real.
            </p>
          </div>
        ) : (
          projects.map((p) => {
            const statusInfo = PROJECT_STATUSES.find((s) => s.value === p.status);
            return (
              <div key={p.id} className="glass rounded-2xl p-5 border border-slate-900/60 flex flex-col justify-between hover:border-violet-500/20 transition-all duration-300 group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-md bg-slate-900 border border-slate-850 text-slate-400">
                      {statusInfo?.label}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg bg-slate-900 text-red-400 hover:text-red-300 border border-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-white mt-4 flex items-center gap-1.5">
                    {p.title}
                    {p.featured && <Star className="w-4 h-4 text-orange-500 fill-orange-500" />}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {p.short_description || "Nenhuma descrição fornecida."}
                  </p>

                  {p.tech_stack && p.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {p.tech_stack.map((stack, index) => (
                        <span key={index} className="text-[9px] font-semibold text-violet-400 py-0.5 px-2 rounded-md bg-violet-950/25">
                          {stack}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3.5 border-t border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {p.repo_url && (
                      <a href={p.repo_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white transition-colors">
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {p.demo_url && (
                      <a href={p.demo_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white transition-colors">
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    {p.visibility === "public" ? (
                      <span className="text-emerald-400">Público</span>
                    ) : (
                      <span className="text-slate-500">Privado</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Import Modal */}
      {showImportList && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-lg relative border border-slate-800 shadow-2xl">
            <button
              onClick={() => setShowImportList(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Github className="w-5 h-5 text-violet-400" />
              Importar Repositórios
            </h2>
            <p className="text-slate-400 text-xs mb-5">
              Escolha um repositório sincronizado para publicar no seu portfólio.
            </p>

            <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1">
              {importedRepos.map((repo) => (
                <div key={repo.github_repo_id} className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-violet-500/20 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{repo.name}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{repo.description}</p>
                  </div>
                  <button
                    onClick={() => handleImportRepo(repo)}
                    className="py-1.5 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold shadow transition-all cursor-pointer whitespace-nowrap"
                  >
                    Importar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CRUD Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-lg relative border border-slate-800 shadow-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4">{editingProject ? "Editar Projeto" : "Novo Projeto"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Título do Projeto</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: E-commerce de Moda Masculina"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Descrição Curta</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Ex: Landing page de vendas responsiva com suporte a carrinho"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Anotações / Descrição Longa</label>
                <textarea
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Escreva detalhes da stack, arquitetura, principais desafios..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tecnologias Utilizadas (Pressione Enter)</label>
                <div className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-2 items-center">
                  {techStack.map((tech, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-[10px] font-bold py-0.5 px-2 bg-violet-600/30 text-violet-400 border border-violet-500/10 rounded-md">
                      {tech}
                      <button type="button" onClick={() => handleRemoveStack(idx)} className="text-violet-400 hover:text-white">✕</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={stackInput}
                    onChange={(e) => setStackInput(e.target.value)}
                    onKeyDown={handleAddStack}
                    placeholder="Adicionar..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none border-none p-0 min-w-[60px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">URL do Código (GitHub)</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">URL da Demonstração (Live)</label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://meuprojeto.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Visibilidade</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as ProjectVisibility)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    <option value="private">Privado</option>
                    <option value="public">Público</option>
                    <option value="unlisted">Não listado</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-400">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 text-violet-600 bg-slate-900 border-slate-800 rounded focus:ring-violet-500"
                    />
                    Destacar?
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-950/50 transition-all"
              >
                {editingProject ? "Salvar Alterações" : "Salvar Projeto"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
