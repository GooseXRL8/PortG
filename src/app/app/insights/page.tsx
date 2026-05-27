"use client";
import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { INSIGHT_TYPES } from "@/lib/utils";
import { Plus, Lightbulb, Trash2, Edit2, X, Globe, EyeOff, Search } from "lucide-react";
import type { StudyInsight, InsightType, InsightVisibility } from "@/lib/types";

export default function InsightsPage() {
  const [insights, setInsights] = useState<StudyInsight[]>([]);
  const [techs, setTechs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInsight, setEditingInsight] = useState<StudyInsight | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<InsightType>("concept");
  const [visibility, setVisibility] = useState<InsightVisibility>("private");
  const [techId, setTechId] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [fetchedInsights, fetchedTechs] = await Promise.all([
      store.getInsights(),
      store.getTechnologies()
    ]);
    setInsights(fetchedInsights);
    setTechs(fetchedTechs);
  };

  const handleOpenCreate = () => {
    setEditingInsight(null);
    setTitle("");
    setContent("");
    setType("concept");
    setVisibility("private");
    setTechId("");
    setTagInput("");
    setTags([]);
    setShowForm(true);
  };

  const handleOpenEdit = (i: StudyInsight) => {
    setEditingInsight(i);
    setTitle(i.title);
    setContent(i.content);
    setType(i.insight_type);
    setVisibility(i.visibility);
    setTechId(i.technology_id || "");
    setTags(i.tags || []);
    setTagInput("");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja mesmo excluir este insight?")) {
      await store.deleteInsight(id);
      await loadData();
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingInsight) {
      await store.updateInsight(editingInsight.id, {
        title, content, insight_type: type, visibility, technology_id: techId || null, tags
      });
    } else {
      await store.createInsight({
        title, content, insight_type: type, visibility, technology_id: techId || null, tags
      });
    }

    setShowForm(false);
    await loadData();
  };

  const filteredInsights = insights.filter((i) => {
    return i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           i.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Anotações e Insights</h1>
          <p className="text-slate-400 text-xs mt-1">Registre seus aprendizados, soluções de bugs e conceitos estudados.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-950/50 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Novo Insight
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquise por títulos, palavras-chave..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none"
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredInsights.length === 0 ? (
          <div className="col-span-full text-center py-16 glass rounded-2xl border border-slate-900/60 p-8">
            <Lightbulb className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">Nenhum insight cadastrado</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Escreva resumos ou soluções de erros para consolidar seu aprendizado.
            </p>
          </div>
        ) : (
          filteredInsights.map((i) => {
            const typeInfo = INSIGHT_TYPES.find((t) => t.value === i.insight_type);
            const relatedTech = techs.find((t) => t.id === i.technology_id);
            return (
              <div key={i.id} className="glass rounded-2xl p-5 border border-slate-900/60 flex flex-col justify-between hover:border-violet-500/20 transition-all duration-300 group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-md bg-violet-950/20 text-violet-400">
                      {typeInfo?.label}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(i)}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(i.id)}
                        className="p-1.5 rounded-lg bg-slate-900 text-red-400 hover:text-red-300 border border-slate-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mt-3">{i.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-4 leading-relaxed font-mono whitespace-pre-line">
                    {i.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                      {i.visibility === "public" ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Público
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Privado
                        </span>
                      )}
                    </span>
                    {relatedTech && (
                      <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded bg-slate-900 text-slate-400 border border-slate-850">
                        {relatedTech.name}
                      </span>
                    )}
                  </div>

                  {i.tags && i.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {i.tags.map((t, idx) => (
                        <span key={idx} className="text-[8px] font-bold text-slate-500 uppercase">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Editor Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-xl relative border border-slate-800 shadow-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4">{editingInsight ? "Editar Insight" : "Novo Insight"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Título do Insight</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Como funciona o Hook useMemo em profundidade"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tipo</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as InsightType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    {INSIGHT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Visibilidade</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as InsightVisibility)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    <option value="private">Privado</option>
                    <option value="public">Público (Portfólio)</option>
                    <option value="unlisted">Não listado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Stack</label>
                  <select
                    value={techId}
                    onChange={(e) => setTechId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    <option value="">Nenhuma</option>
                    {techs.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tags (Pressione Enter para adicionar)</label>
                <div className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-2 items-center">
                  {tags.map((t, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-[10px] font-bold py-0.5 px-2 bg-violet-600/30 text-violet-400 border border-violet-500/10 rounded-md">
                      #{t}
                      <button type="button" onClick={() => handleRemoveTag(idx)} className="text-violet-400 hover:text-white">✕</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Adicionar..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none border-none p-0 min-w-[60px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Conteúdo do Insight</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Descreva seu insight com trechos de códigos ou conceitos detalhados..."
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-950/50 transition-all"
              >
                {editingInsight ? "Salvar Insight" : "Publicar Insight"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
