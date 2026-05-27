"use client";
import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { TECH_CATEGORIES, TECH_LEVELS, TECH_STATUSES } from "@/lib/utils";
import { Plus, Edit2, Trash2, Filter, Code, Check, X, AlertCircle } from "lucide-react";
import type { Technology, TechCategory, TechLevel, TechStatus } from "@/lib/types";

export default function TechnologiesPage() {
  const [techs, setTechs] = useState<Technology[]>([]);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TechCategory>("Frontend");
  const [level, setLevel] = useState<TechLevel>("beginner");
  const [targetLevel, setTargetLevel] = useState<TechLevel | "">("");
  const [status, setStatus] = useState<TechStatus>("studying");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // Filter states
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  useEffect(() => {
    loadTechs();
  }, []);

  const loadTechs = async () => {
    const list = await store.getTechnologies();
    setTechs(list);
  };

  const handleOpenCreate = () => {
    setEditingTech(null);
    setName("");
    setCategory("Frontend");
    setLevel("beginner");
    setTargetLevel("");
    setStatus("studying");
    setNotes("");
    setIsPublic(true);
    setShowForm(true);
  };

  const handleOpenEdit = (t: Technology) => {
    setEditingTech(t);
    setName(t.name);
    setCategory(t.category);
    setLevel(t.level);
    setTargetLevel(t.target_level || "");
    setStatus(t.status);
    setNotes(t.notes || "");
    setIsPublic(t.is_public);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta tecnologia?")) {
      await store.deleteTechnology(id);
      await loadTechs();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingTech) {
      await store.updateTechnology(editingTech.id, {
        name, category, level, target_level: targetLevel, status, notes, is_public: isPublic
      });
    } else {
      await store.createTechnology({
        name, category, level, target_level: targetLevel, status, notes, is_public: isPublic,
        started_at: new Date().toISOString().split("T")[0]
      });
    }
    setShowForm(false);
    await loadTechs();
  };

  const filteredTechs = techs.filter((t) => {
    const matchCat = filterCategory === "All" || t.category === filterCategory;
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    return matchCat && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Suas Tecnologias</h1>
          <p className="text-slate-400 text-xs mt-1">Registre e acompanhe as stacks que você está estudando.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-950/50 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Adicionar Stack
        </button>
      </div>

      {/* Filter and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="glass rounded-2xl p-5 h-fit space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm pb-3 border-b border-slate-900">
            <Filter className="w-4 h-4 text-violet-400" />
            <span>Filtros</span>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Categoria</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none"
            >
              <option value="All">Todas as Categorias</option>
              {TECH_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Status de Estudos</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none"
            >
              <option value="All">Todos os Status</option>
              {TECH_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Technologies List */}
        <div className="lg:col-span-3">
          {filteredTechs.length === 0 ? (
            <div className="text-center py-16 glass rounded-2xl border border-slate-900/60 p-8">
              <Code className="w-10 h-10 text-slate-600 mx-auto mb-3 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-300">Nenhuma tecnologia encontrada</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Registre o que está estudando agora para acompanhar sua evolução e exibir no portfólio público.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTechs.map((t) => {
                const statusInfo = TECH_STATUSES.find((s) => s.value === t.status);
                const levelInfo = TECH_LEVELS.find((l) => l.value === t.level);
                return (
                  <div key={t.id} className="glass rounded-2xl p-5 border border-slate-900/60 flex flex-col justify-between hover:border-violet-500/30 transition-all duration-300 group">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-950/40 py-1 px-2.5 rounded-md">
                          {t.category}
                        </span>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1.5 rounded-lg bg-slate-900 text-red-400 hover:text-red-300 border border-slate-800 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mt-3">{t.name}</h3>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[10px] font-semibold text-violet-400 py-0.5 px-2 rounded-md bg-violet-950/20">
                          Nível: {levelInfo?.label}
                        </span>
                        {t.target_level && (
                          <span className="text-[10px] font-semibold text-blue-400 py-0.5 px-2 rounded-md bg-blue-950/20">
                            Meta: {TECH_LEVELS.find((l) => l.value === t.target_level)?.label}
                          </span>
                        )}
                      </div>

                      {t.notes && (
                        <p className="text-xs text-slate-400 line-clamp-2 mt-3 italic">
                          &quot;{t.notes}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-900 mt-4 pt-3 text-[10px] font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1 text-slate-500">
                        {t.is_public ? (
                          <span className="text-emerald-400">Público</span>
                        ) : (
                          <span>Privado</span>
                        )}
                      </span>
                      <span
                        className="py-0.5 px-2 rounded-md"
                        style={{
                          backgroundColor: `${statusInfo?.color}15`,
                          color: statusInfo?.color,
                          border: `1px solid ${statusInfo?.color}25`
                        }}
                      >
                        {statusInfo?.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal / Slide-over Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-lg relative border border-slate-800 shadow-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4">
              {editingTech ? "Editar Tecnologia" : "Adicionar Tecnologia"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nome da Stack</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: React, Node.js, Kubernetes"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TechCategory)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    {TECH_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status Atual</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TechStatus)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    {TECH_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nível Atual</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as TechLevel)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    {TECH_LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Meta de Nível</label>
                  <select
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value as TechLevel | "")}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    <option value="">Nenhuma</option>
                    {TECH_LEVELS.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Anotações / Notas Rápidas</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Focando em React Server Components e custom hooks avançados."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-slate-900">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Exibir no portfólio público?
                </span>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 text-violet-600 bg-slate-900 border-slate-800 rounded focus:ring-violet-500 focus:ring-2"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-950/50 transition-all"
              >
                {editingTech ? "Salvar Alterações" : "Adicionar Stack"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
