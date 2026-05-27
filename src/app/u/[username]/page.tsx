"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { store } from "@/lib/store";
import { formatDate, TECH_STATUSES, TECH_LEVELS, PROJECT_STATUSES } from "@/lib/utils";
import {
  Github, Linkedin, Globe, MapPin, Code, FolderGit2,
  CheckSquare, Calendar, Flame, ArrowLeft, Lightbulb, Star
} from "lucide-react";
import Link from "next/link";

type TabOption = "projects" | "skills" | "goals" | "insights" | "timeline";

// Mock Predefined Premium Demo Data
const DEMO_USER = {
  id: "demo-user-id",
  display_name: "Gabriel Martins",
  headline: "Full Stack Engineer | React, Node.js & Go Specialist",
  public_username: "demo",
  experience_level: "advanced",
  bio: "Apaixonado por criar interfaces ricas e performáticas combinadas com APIs robustas e escaláveis. Atualmente focado no ecossistema TypeScript, Next.js App Router, bancos relacionais e containers.",
  avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
  current_focus: "Next.js 15, Rust/Go, Arquiteturas de Microserviços.",
  email_public: "gabriel.martins@exemplo.com",
  linkedin_url: "https://linkedin.com",
  website_url: "https://exemplo.com"
};

const DEMO_SETTINGS = {
  show_email: true,
  show_github: true,
  show_linkedin: true,
  show_commits: true,
  show_goals: true,
  show_insights: true,
  show_learning_timeline: true
};

const DEMO_PROJECTS = [
  {
    id: "p1",
    title: "PortG SaaS Platform",
    short_description: "Hub de estudos e evolução tech modular com portfólio dinâmico gerado de forma instantânea.",
    status: "published",
    featured: true,
    visibility: "public",
    tech_stack: ["Next.js 15", "TypeScript", "Tailwind CSS"],
    repo_url: "https://github.com",
    demo_url: "https://portg.com"
  },
  {
    id: "p2",
    title: "FastGo Router API",
    short_description: "API Gateway ultrarrápido escrito em Go focado em otimização de caching e roteamento dinâmico.",
    status: "mvp",
    featured: true,
    visibility: "public",
    tech_stack: ["Go", "Redis", "Docker"],
    repo_url: "https://github.com",
    demo_url: ""
  },
  {
    id: "p3",
    title: "MaluFashion E-commerce",
    short_description: "Front-end de e-commerce premium com transições fluidas, filtros inteligentes e checkout integrado.",
    status: "published",
    featured: false,
    visibility: "public",
    tech_stack: ["React", "Stripe", "Framer Motion"],
    repo_url: "https://github.com",
    demo_url: "https://malufashion.com"
  }
];

const DEMO_TECHS = [
  { id: "t1", name: "React / Next.js", category: "Frontend", level: "advanced", target_level: "professional", status: "studying", is_public: true, notes: "Focado em Server Actions, PPR e caching nativo." },
  { id: "t2", name: "Golang", category: "Backend", level: "intermediate", target_level: "advanced", status: "studying", is_public: true, notes: "Construindo microserviços e lidando com concorrência (goroutines)." },
  { id: "t3", name: "Docker / K8s", category: "DevOps", level: "basic", target_level: "intermediate", status: "studying", is_public: true, notes: "Orquestração básica e criação de ambientes locais consistentes." }
];

const DEMO_GOALS = [
  { id: "g1", title: "Dominar goroutines e patterns de concorrência em Go", description: "Escrever 3 microsserviços simples trocando dados via channels.", status: "completed", is_public: true },
  { id: "g2", title: "Concluir a transição de CSS-in-JS para Tailwind CSS v4", description: "Melhorar performance e remover runtime overhead.", status: "completed", is_public: true },
  { id: "g3", title: "Configurar deploys automáticos via GitHub Actions", description: "Incluir testes automatizados e builds na PR.", status: "in_progress", is_public: true }
];

const DEMO_INSIGHTS = [
  {
    id: "i1",
    insight_type: "concept",
    title: "Diferença conceitual entre useMemo e useCallback",
    content: "O useMemo guarda o valor retornado por uma função computacional cara.\nO useCallback guarda a própria instância da função de callback para evitar que componentes filhos sofram re-renderizações desnecessárias por igualdade referencial.",
    visibility: "public",
    tags: ["react", "performance"]
  },
  {
    id: "i2",
    insight_type: "bug_fix",
    title: "Resolvendo Race Conditions em Golang com Mutex",
    content: "Identifiquei escrita concorrente em uma variável de mapa compartilhado. Corrigi utilizando o sync.RWMutex do Go:\n\nmu.Lock()\nmaps[key] = val\nmu.Unlock()",
    visibility: "public",
    tags: ["go", "concurrency"]
  }
];

const DEMO_TIMELINE = [
  { id: "e1", created_at: "2026-05-24T18:00:00Z", title: "Lançamento da v1.0.0 do PortG", description: "Toda a stack client-side finalizada com sucesso.", visibility: "public" },
  { id: "e2", created_at: "2026-05-20T10:00:00Z", title: "Sincronização de 14 commits no repositório FastGo", description: "Nova camada de caching de rotas integrada.", visibility: "public" },
  { id: "e3", created_at: "2026-05-15T15:30:00Z", title: "Meta concluída: Estudar Mutex e Canais concorrentes em Go", description: "Concluído com prática e insights documentados.", visibility: "public" }
];

export default function PublicPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [techs, setTechs] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabOption>("projects");

  useEffect(() => {
    const loadPortfolioData = async () => {
      if (!username) return;

      if (username === "demo") {
        setUser(DEMO_USER);
        setSettings(DEMO_SETTINGS);
        setProjects(DEMO_PROJECTS);
        setTechs(DEMO_TECHS);
        setGoals(DEMO_GOALS);
        setInsights(DEMO_INSIGHTS);
        setTimeline(DEMO_TIMELINE);
        return;
      }

      const u = await store.getUserByUsername(username);
      if (!u) {
        setUser(false); // trigger 404/not found state
        return;
      }

      setUser(u);
      const userId = u.id;

      // Load all items concurrently
      const [ps, allProjects, allTechs, allGoals, allInsights, allTimeline] = await Promise.all([
        store.getPortfolioSettings(userId),
        store.getProjects(userId),
        store.getTechnologies(userId),
        store.getGoals(userId),
        store.getInsights(userId),
        store.getTimeline(userId)
      ]);

      setSettings(ps);
      setProjects(allProjects.filter((p) => p.visibility === "public"));
      setTechs(allTechs.filter((t) => t.is_public));
      setGoals(allGoals.filter((g) => g.is_public));
      setInsights(allInsights.filter((i) => i.visibility === "public"));
      setTimeline(allTimeline.filter((e) => e.visibility === "public"));
    };

    loadPortfolioData();
  }, [username]);

  if (user === false) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-300">Portfólio Não Encontrado</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          O usuário @{username} não existe ou ainda não configurou seu portfólio público.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para o Início
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-violet-500 selection:text-white pb-10">
      {/* Banner & Floating Avatar */}
      <div className="relative w-full h-[200px] md:h-[260px] bg-gradient-to-r from-violet-950 to-slate-900 border-b border-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Floating return control */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-900/60 backdrop-blur-md border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> PortG
          </Link>
        </div>
      </div>

      {/* Main profile section */}
      <div className="max-w-6xl w-full mx-auto px-4 md:px-8 -mt-20 md:-mt-24 relative z-10">
        <div className="glass rounded-3xl p-6 md:p-8 border border-slate-900 shadow-2xl space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-900">
            {/* Left Info: Avatar + Details */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 text-center md:text-left">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-slate-900 border-2 border-violet-500/80 overflow-hidden shadow-xl shadow-violet-950/20 flex items-center justify-center text-4xl font-extrabold text-white uppercase select-none">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                ) : (
                  user.display_name[0]
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {user.display_name}
                </h1>
                <p className="text-slate-400 text-sm font-semibold">{user.headline || "Desenvolvedor de Software"}</p>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-xs text-slate-500 pt-1 font-mono">
                  <span>@{user.public_username}</span>
                  <span>•</span>
                  <span>Nível: {user.experience_level}</span>
                </div>
              </div>
            </div>

            {/* Socials / External links */}
            <div className="flex justify-center items-center gap-2">
              {settings?.show_github && user.github_username && (
                <a
                  href={`https://github.com/${user.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings?.show_linkedin && user.linkedin_url && (
                <a
                  href={user.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {user.website_url && (
                <a
                  href={user.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Bio Description / Focus */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Sobre Mim</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                {user.bio || "Este desenvolvedor ainda não escreveu uma bio."}
              </p>
            </div>

            <div className="glass bg-slate-950/40 border border-slate-900/60 p-5 rounded-2xl space-y-3.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Foco de Carreira</h3>
              {user.current_focus ? (
                <p className="text-xs text-slate-300 font-semibold">{user.current_focus}</p>
              ) : (
                <p className="text-xs text-slate-500">Nenhum foco de carreira definido.</p>
              )}
              
              {settings?.show_email && user.email_public && (
                <div className="pt-2.5 border-t border-slate-900/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Contato Direto</span>
                  <a href={`mailto:${user.email_public}`} className="text-xs font-semibold text-violet-400 hover:underline">
                    {user.email_public}
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Tab Controls */}
        <div className="mt-8 flex border-b border-slate-900 overflow-x-auto scrollbar-none font-semibold text-xs">
          <button
            onClick={() => setActiveTab("projects")}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "projects" ? "border-violet-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            Projetos ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "skills" ? "border-violet-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            Habilidades ({techs.length})
          </button>
          {settings?.show_goals && (
            <button
              onClick={() => setActiveTab("goals")}
              className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "goals" ? "border-violet-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Metas Ativas ({goals.length})
            </button>
          )}
          {settings?.show_insights && (
            <button
              onClick={() => setActiveTab("insights")}
              className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "insights" ? "border-violet-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Insights ({insights.length})
            </button>
          )}
          {settings?.show_learning_timeline && (
            <button
              onClick={() => setActiveTab("timeline")}
              className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "timeline" ? "border-violet-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Timeline de Estudos
            </button>
          )}
        </div>

        {/* Dynamic Content Display area */}
        <div className="mt-8">
          
          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 text-xs italic">
                  Nenhum projeto cadastrado como público.
                </div>
              ) : (
                projects.map((p) => (
                  <div key={p.id} className="glass rounded-2xl p-5 border border-slate-900 flex flex-col justify-between hover:border-violet-500/20 transition-all duration-300 group">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold uppercase tracking-wider py-0.5 px-2 bg-slate-900 border border-slate-850 text-slate-400 rounded-md">
                          {p.status}
                        </span>
                        {p.featured && <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />}
                      </div>
                      <h3 className="text-base font-bold text-white mt-4">{p.title}</h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {p.short_description}
                      </p>
                      {p.tech_stack && p.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {p.tech_stack.map((t: string, idx: number) => (
                            <span key={idx} className="text-[8px] font-bold text-violet-400 py-0.5 px-2 bg-violet-950/20 rounded-md">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-6 pt-3.5 border-t border-slate-900">
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
                  </div>
                ))
              )}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {techs.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 text-xs italic">
                  Nenhuma stack de tecnologia listada publicamente.
                </div>
              ) : (
                techs.map((t) => {
                  const statusInfo = TECH_STATUSES.find((s) => s.value === t.status);
                  const levelInfo = TECH_LEVELS.find((l) => l.value === t.level);
                  return (
                    <div key={t.id} className="glass rounded-2xl p-5 border border-slate-900/60 flex flex-col justify-between hover:border-violet-500/10 transition-all duration-300">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-950/40 py-1 px-2.5 rounded-md">
                          {t.category}
                        </span>
                        <h3 className="text-base font-bold text-white mt-3">{t.name}</h3>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-[9px] font-semibold text-violet-400 py-0.5 px-2 rounded bg-violet-950/20">
                            Nível: {levelInfo?.label}
                          </span>
                          {t.target_level && (
                            <span className="text-[9px] font-semibold text-blue-400 py-0.5 px-2 rounded bg-blue-950/20">
                              Meta: {TECH_LEVELS.find((l) => l.value === t.target_level)?.label}
                            </span>
                          )}
                        </div>

                        {t.notes && (
                          <p className="text-xs text-slate-400 line-clamp-2 mt-3.5 italic">
                            &quot;{t.notes}&quot;
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end border-t border-slate-900/60 mt-4 pt-3 text-[9px] font-bold uppercase tracking-wider">
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
                })
              )}
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div className="max-w-2xl mx-auto space-y-3.5">
              {goals.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs italic">
                  Sem metas ativas públicas no momento.
                </div>
              ) : (
                goals.map((g) => (
                  <div key={g.id} className="glass rounded-xl p-4 border border-slate-900/60 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className={`text-sm font-bold text-white ${g.status === "completed" ? "line-through text-slate-500" : ""}`}>
                        {g.title}
                      </p>
                      {g.description && <p className="text-xs text-slate-400 mt-1">{g.description}</p>}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-md ${
                      g.status === "completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" : "bg-slate-900 text-slate-400 border border-slate-800"
                    }`}>
                      {g.status === "completed" ? "Concluída" : "Pendente"}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === "insights" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {insights.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 text-xs italic">
                  Sem insights cadastrados como públicos.
                </div>
              ) : (
                insights.map((i) => (
                  <div key={i.id} className="glass rounded-2xl p-5 border border-slate-900/60 hover:border-violet-500/10 transition-all duration-300">
                    <span className="text-[9px] font-bold uppercase tracking-wider py-0.5 px-2 bg-violet-950/20 text-violet-400 rounded-md">
                      {i.insight_type}
                    </span>
                    <h3 className="text-base font-bold text-white mt-3">{i.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-4 leading-relaxed font-mono whitespace-pre-line">
                      {i.content}
                    </p>
                    {i.tags && i.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-900">
                        {i.tags.map((t: string, idx: number) => (
                          <span key={idx} className="text-[8px] font-bold text-slate-500 uppercase">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="max-w-2xl mx-auto relative pl-6 border-l border-slate-900 space-y-8 py-4">
              {timeline.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs italic">
                  Nenhum evento registrado na timeline pública.
                </div>
              ) : (
                timeline.map((event) => (
                  <div key={event.id} className="relative">
                    <span className="absolute -left-[32px] top-1 w-3 h-3 rounded-full bg-violet-500 border-2 border-slate-950" />
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono">{formatDate(event.created_at)}</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{event.title}</h4>
                      {event.description && <p className="text-xs text-slate-400 mt-1">{event.description}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
