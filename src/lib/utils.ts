import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) return formatDate(dateStr);
  if (diffDays > 0) return `${diffDays}d atrás`;
  if (diffHours > 0) return `${diffHours}h atrás`;
  if (diffMins > 0) return `${diffMins}min atrás`;
  return "agora";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getWeekBounds(): { start: string; end: string } {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    start: monday.toISOString().split("T")[0],
    end: sunday.toISOString().split("T")[0],
  };
}

export const TECH_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Mobile",
  "AI",
  "Design",
  "Soft Skills",
  "Tools",
] as const;

export const TECH_LEVELS = [
  { value: "beginner", label: "Iniciante" },
  { value: "basic", label: "Básico" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
  { value: "professional", label: "Profissional" },
] as const;

export const TECH_STATUSES = [
  { value: "planned", label: "Planejado", color: "#94A3B8" },
  { value: "studying", label: "Estudando", color: "#7C3AED" },
  { value: "paused", label: "Pausado", color: "#F59E0B" },
  { value: "completed", label: "Concluído", color: "#22C55E" },
  { value: "reviewing", label: "Revisando", color: "#3B82F6" },
] as const;

export const GOAL_PRIORITIES = [
  { value: "low", label: "Baixa", color: "#94A3B8" },
  { value: "medium", label: "Média", color: "#3B82F6" },
  { value: "high", label: "Alta", color: "#F59E0B" },
  { value: "critical", label: "Crítica", color: "#EF4444" },
] as const;

export const INSIGHT_TYPES = [
  { value: "concept", label: "Conceito aprendido" },
  { value: "bug_fix", label: "Erro resolvido" },
  { value: "snippet", label: "Snippet útil" },
  { value: "summary", label: "Resumo de aula" },
  { value: "idea", label: "Ideia de projeto" },
  { value: "tip", label: "Dica de carreira" },
] as const;

export const PROJECT_STATUSES = [
  { value: "idea", label: "Ideia" },
  { value: "in_development", label: "Em desenvolvimento" },
  { value: "mvp", label: "MVP" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Arquivado" },
] as const;

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  Java: "#ED8B00",
  "C#": "#239120",
  "C++": "#00599C",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Ruby: "#CC342D",
  PHP: "#777BB4",
  Swift: "#F05138",
  Kotlin: "#7F52FF",
  Dart: "#0175C2",
  HTML: "#E34F26",
  CSS: "#1572B6",
  Shell: "#89E051",
  Vue: "#4FC08D",
  Svelte: "#FF3E00",
};
