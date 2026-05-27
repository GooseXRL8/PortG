"use client";
import React, { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { GOAL_PRIORITIES, getWeekBounds } from "@/lib/utils";
import { Plus, CheckSquare, Trash2, Edit2, ChevronRight, X, AlertCircle } from "lucide-react";
import type { WeeklyGoal, GoalPriority, GoalStatus } from "@/lib/types";

export default function GoalsPage() {
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [techs, setTechs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<WeeklyGoal | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<GoalPriority>("medium");
  const [techId, setTechId] = useState<string>("");
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [fetchedGoals, fetchedTechs] = await Promise.all([
      store.getGoals(),
      store.getTechnologies()
    ]);
    setGoals(fetchedGoals);
    setTechs(fetchedTechs);
  };

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setTechId("");
    setIsPublic(false);
    setShowForm(true);
  };

  const handleOpenEdit = (g: WeeklyGoal) => {
    setEditingGoal(g);
    setTitle(g.title);
    setDescription(g.description || "");
    setPriority(g.priority);
    setTechId(g.technology_id || "");
    setIsPublic(g.is_public);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta meta?")) {
      await store.deleteGoal(id);
      await loadData();
    }
  };

  const handleToggleStatus = async (g: WeeklyGoal) => {
    let nextStatus: GoalStatus = "pending";
    if (g.status === "pending") nextStatus = "in_progress";
    else if (g.status === "in_progress") nextStatus = "completed";
    else if (g.status === "completed") nextStatus = "pending";

    await store.updateGoal(g.id, { status: nextStatus });
    await loadData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const bounds = getWeekBounds();

    if (editingGoal) {
      await store.updateGoal(editingGoal.id, {
        title,
        description,
        priority,
        technology_id: techId || null,
        is_public: isPublic
      });
    } else {
      await store.createGoal({
        title,
        description,
        priority,
        status: "pending",
        technology_id: techId || null,
        is_public: isPublic,
        week_start: bounds.start,
        week_end: bounds.end,
        completed_at: null
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
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Metas Semanais</h1>
          <p className="text-slate-400 text-xs mt-1">Crie metas para manter seu aprendizado focado e consistente.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-950/50 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl space-y-6">
        {goals.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl border border-slate-900/60 p-8">
            <CheckSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">Sem metas para esta semana</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Divida seus estudos em pequenas metas de 1 a 2 horas cada. Isso ajuda a construir hábitos de consistência de longo prazo.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {goals.map((g) => {
              const priorityInfo = GOAL_PRIORITIES.find((p) => p.value === g.priority);
              const relatedTech = techs.find((t) => t.id === g.technology_id);
              return (
                <div
                  key={g.id}
                  className="glass rounded-2xl p-5 border border-slate-900/60 flex items-center justify-between gap-4 hover:border-violet-500/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleStatus(g)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        g.status === "completed"
                          ? "bg-emerald-500 border-emerald-500 text-slate-950"
                          : g.status === "in_progress"
                          ? "bg-violet-600/20 border-violet-500 text-violet-400"
                          : "border-slate-800 text-transparent hover:border-slate-700"
                      }`}
                    >
                      {g.status === "completed" && <span className="text-xs font-black">✓</span>}
                      {g.status === "in_progress" && <span className="text-[10px] font-bold">●</span>}
                    </button>

                    <div className="min-w-0">
                      <h3
                        className={`text-sm font-bold truncate transition-all ${
                          g.status === "completed" ? "line-through text-slate-500" : "text-white"
                        }`}
                      >
                        {g.title}
                      </h3>
                      {g.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{g.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-md"
                          style={{
                            backgroundColor: `${priorityInfo?.color}15`,
                            color: priorityInfo?.color,
                            border: `1px solid ${priorityInfo?.color}25`
                          }}
                        >
                          Prioridade: {priorityInfo?.label}
                        </span>
                        {relatedTech && (
                          <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                            {relatedTech.name}
                          </span>
                        )}
                        {g.is_public && (
                          <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-md bg-emerald-950/20 border border-emerald-500/20 text-emerald-400">
                            Pública
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(g)}
                      className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-850 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="p-2 rounded-xl bg-slate-900 text-red-400 hover:text-red-300 border border-slate-850 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide-over Goal Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-lg relative border border-slate-800 shadow-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white mb-4">{editingGoal ? "Editar Meta" : "Nova Meta Semanal"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Título da Meta</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Concluir módulo de hooks no curso de React"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Descrição / Passos</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Assistir aulas de useCallback e useMemo. Criar um projeto simples."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as GoalPriority)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none"
                  >
                    {GOAL_PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Stack Relacionada</label>
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

              <div className="flex items-center justify-between py-2 border-t border-slate-900">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Exibir na timeline pública?</span>
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
                {editingGoal ? "Salvar Meta" : "Criar Meta"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
