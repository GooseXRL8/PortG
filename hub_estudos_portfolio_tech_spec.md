# Hub de Organização de Estudos / Portfólio Tech

**Nome provisório:** DevTrack Portfolio  
**Tipo:** SaaS pessoal / web app de estudos + portfólio público  
**Objetivo:** ajudar estudantes de tecnologia a organizar aprendizado, registrar evolução, conectar GitHub e publicar um portfólio vivo para recrutadores.

---

## 1. Resumo do Produto

O projeto é uma plataforma onde o usuário centraliza:

- tecnologias que está estudando;
- metas semanais;
- anotações e insights;
- projetos do GitHub;
- commits recentes;
- progresso por trilha de aprendizado;
- portfólio público atualizado automaticamente.

A ideia forte: **o usuário aprende tecnologia enquanto constrói uma ferramenta para provar que está aprendendo tecnologia**.

---

## 2. Proposta de Valor

### Dor principal

Quem estuda programação costuma ter conteúdo espalhado:

- repositórios soltos no GitHub;
- anotações em Notion, Google Docs ou caderno;
- cursos sem rastreamento claro;
- projetos sem apresentação profissional;
- dificuldade para mostrar evolução para recrutadores.

### Solução

Criar um hub único que transforma estudo em portfólio:

> "Organize seus estudos, registre sua evolução e publique um portfólio tech vivo conectado ao GitHub."

### Diferenciais

| Diferencial | Valor |
|---|---|
| GitHub automático | Portfólio atualiza com projetos e commits |
| Metas semanais | Ajuda na consistência |
| Timeline de evolução | Mostra progresso real |
| Portfólio público | Vitrine para recrutadores |
| Insights de estudo | Registra aprendizados importantes |
| Score de consistência | Gamificação simples |
| Modo público/privado | Usuário escolhe o que exibir |

---

## 3. Público-Alvo

### Primário

- estudantes de programação;
- devs iniciantes;
- pessoas migrando de carreira;
- alunos de cursos online;
- candidatos a estágio/júnior.

### Secundário

- mentores;
- professores;
- recrutadores técnicos;
- bootcamps;
- comunidades de estudo.

---

## 4. Personas

### Persona 1 — Dev iniciante

**Nome:** Lucas  
**Situação:** estuda front-end há 4 meses.  
**Dor:** tem projetos no GitHub, mas não sabe mostrar evolução.  
**O que busca:** organizar trilhas, metas e publicar portfólio simples.

### Persona 2 — Pessoa em transição de carreira

**Nome:** Ana  
**Situação:** veio de área administrativa e estuda fullstack.  
**Dor:** precisa provar consistência sem experiência formal.  
**O que busca:** timeline de aprendizado, projetos explicados e metas visíveis.

### Persona 3 — Recrutador

**Nome:** Marina  
**Situação:** avalia candidatos júnior.  
**Dor:** currículos dizem "React, Node, Git", mas não mostram prática.  
**O que busca:** commits, projetos, tecnologias e evolução clara.

---

## 5. Nome, Marca e Tom Visual

### Nomes possíveis

1. **DevTrack Portfolio**
2. **SkillBoard**
3. **CodeJourney**
4. **StudyStack**
5. **TechPath**
6. **GitGrowth**
7. **DevTimeline**
8. **Portflow**

### Recomendação

**DevTrack Portfolio**

Motivo:

- claro;
- profissional;
- fácil de entender;
- combina estudo + evolução + vitrine.

### Tom visual

- moderno;
- limpo;
- escuro opcional;
- foco em cards;
- visual próximo de dashboard SaaS;
- aparência profissional para recrutadores.

---

## 6. Stack Recomendada

### Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide Icons**
- **Recharts** para gráficos

### Backend

- **Next.js Route Handlers**
- **Server Actions** para mutações internas
- **GitHub REST API** para repositórios e commits
- **GitHub OAuth ou GitHub App** para conexão com a conta do usuário

### Banco de Dados

- **Supabase Postgres**
- **Supabase Auth**
- **Row Level Security**
- **Supabase Storage** para avatar/banner customizado, se necessário

### ORM / Query Layer

Opções:

1. **Supabase client direto**  
   Mais simples para MVP.

2. **Drizzle ORM**  
   Bom equilíbrio entre SQL, tipagem e controle.

3. **Prisma**  
   Mais conhecido, ótimo para produtividade.

### Recomendação para MVP

Use:

- Next.js
- TypeScript
- Supabase Auth
- Supabase Postgres
- Supabase client direto
- Tailwind + shadcn/ui
- GitHub OAuth

Motivo: menos complexidade, entrega rápida.

---

## 7. Arquitetura Geral

```txt
Usuário
  ↓
Next.js App Router
  ↓
Camada de UI
  ↓
Server Actions / Route Handlers
  ↓
Supabase Auth + Postgres
  ↓
GitHub API
  ↓
Portfólio Público
```

### Fluxo principal

```txt
1. Usuário cria conta
2. Conecta GitHub
3. Sistema importa repositórios
4. Usuário marca projetos que quer exibir
5. Usuário adiciona tecnologias estudadas
6. Usuário cria metas semanais
7. Usuário registra insights
8. Dashboard calcula progresso
9. Página pública exibe portfólio vivo
```

---

## 8. Funcionalidades por Módulo

## 8.1 Autenticação

### Funções

- cadastro com e-mail;
- login com e-mail;
- login social com GitHub;
- logout;
- recuperação de senha;
- proteção de rotas privadas.

### Rotas

```txt
/login
/register
/forgot-password
/app
```

### Regras

- usuário não autenticado não acessa dashboard;
- página pública do portfólio não exige login;
- dados privados ficam protegidos por `user_id`.

---

## 8.2 Onboarding

### Objetivo

Coletar dados essenciais do usuário sem criar fricção.

### Etapas

1. Nome público
2. Username do portfólio
3. Área de foco
4. Nível atual
5. Tecnologias principais
6. Conectar GitHub
7. Escolher template do portfólio

### Campos

```txt
display_name
public_username
headline
bio
current_focus
experience_level
github_username
portfolio_visibility
```

### Exemplo

```txt
Nome público: João Titua
Headline: Desenvolvedor Fullstack em formação
Foco atual: React, Node.js e automações
Nível: Iniciante avançado
URL pública: /u/joaotitua
```

---

## 8.3 Dashboard Principal

### Objetivo

Mostrar visão rápida da evolução.

### Cards principais

| Card | Conteúdo |
|---|---|
| Progresso semanal | metas concluídas / metas totais |
| Tecnologias ativas | tecnologias em estudo |
| Commits recentes | últimos commits importados |
| Projetos publicados | projetos visíveis no portfólio |
| Sequência de estudos | dias seguidos com atividade |
| Próxima meta | tarefa mais próxima |

### Componentes

```txt
DashboardHeader
WeeklyProgressCard
LearningStreakCard
ActiveTechnologiesCard
RecentCommitsList
GoalsPreview
PortfolioPreviewCard
```

### Métricas

```txt
weekly_goal_completion_rate
study_streak_days
total_projects
public_projects
total_insights
github_commits_last_7_days
```

---

## 8.4 Módulo de Tecnologias

### Objetivo

Permitir que o usuário registre o que está estudando.

### Campos de tecnologia

```txt
id
user_id
name
category
level
status
started_at
target_level
notes
created_at
updated_at
```

### Categorias

```txt
Frontend
Backend
Database
DevOps
Mobile
AI
Design
Soft Skills
Tools
```

### Níveis

```txt
Iniciante
Básico
Intermediário
Avançado
Profissional
```

### Status

```txt
Planejado
Estudando
Pausado
Concluído
Revisando
```

### Funções

- criar tecnologia;
- editar tecnologia;
- remover tecnologia;
- mudar status;
- registrar nível atual;
- definir meta de nível;
- filtrar por categoria;
- filtrar por status;
- exibir no portfólio público.

---

## 8.5 Módulo de Metas Semanais

### Objetivo

Criar consistência.

### Campos

```txt
id
user_id
title
description
week_start
week_end
status
priority
related_technology_id
completed_at
created_at
updated_at
```

### Status

```txt
Pendente
Em andamento
Concluída
Cancelada
```

### Prioridade

```txt
Baixa
Média
Alta
Crítica
```

### Exemplos de metas

```txt
Criar 3 componentes React reutilizáveis
Estudar autenticação com Supabase
Publicar projeto no GitHub
Escrever README de um projeto antigo
Fazer deploy de uma landing page
```

### Funções

- criar meta;
- concluir meta;
- cancelar meta;
- mover para próxima semana;
- associar meta a tecnologia;
- calcular taxa de conclusão;
- gerar resumo semanal.

---

## 8.6 Módulo de Anotações e Insights

### Objetivo

Registrar aprendizados de forma simples.

### Campos

```txt
id
user_id
title
content
tags
related_technology_id
visibility
created_at
updated_at
```

### Visibilidade

```txt
Privado
Público
Somente link
```

### Tipos de insight

```txt
Conceito aprendido
Erro resolvido
Snippet útil
Resumo de aula
Ideia de projeto
Dica de carreira
```

### Funções

- criar insight;
- editar insight;
- excluir insight;
- adicionar tags;
- associar a tecnologia;
- tornar público;
- exibir no portfólio.

### Exemplo

```md
# Aprendi sobre Server Actions

Server Actions rodam no servidor e ajudam a lidar com mutações sem criar endpoints manuais para tudo.

Uso ideal:
- formulários;
- criação de registros;
- atualização de perfil;
- ações internas autenticadas.
```

---

## 8.7 Integração com GitHub

### Objetivo

Importar dados reais do GitHub para tornar o portfólio vivo.

### Dados importados

- perfil GitHub;
- avatar;
- bio;
- repositórios públicos;
- linguagem principal do repositório;
- estrelas;
- forks;
- descrição;
- URL;
- commits recentes;
- data do último push;
- README, opcional;
- topics/tags do repositório.

### Abordagens possíveis

#### Opção A — GitHub username público

Mais simples.

O usuário informa username.  
Sistema busca dados públicos.

**Prós:**

- fácil;
- sem OAuth;
- rápido para MVP.

**Contras:**

- sem acesso a dados privados;
- menor personalização;
- depende só de dados públicos.

#### Opção B — GitHub OAuth

Usuário conecta a conta GitHub.

**Prós:**

- melhor experiência;
- pode salvar token;
- permite sincronização mais robusta;
- pode acessar dados autorizados pelo usuário.

**Contras:**

- exige configuração OAuth;
- cuidado com tokens;
- precisa escopos mínimos.

#### Opção C — GitHub App

Mais profissional para produto em escala.

**Prós:**

- permissões mais granulares;
- melhor para integrações longas;
- pode agir como app instalado;
- mais seguro para organizações.

**Contras:**

- configuração mais complexa;
- maior curva inicial.

### Recomendação

Para MVP:

```txt
Fase 1: buscar dados públicos por username
Fase 2: adicionar GitHub OAuth
Fase 3: migrar para GitHub App se virar SaaS real
```

### Endpoints sugeridos

```txt
GET /users/{username}
GET /users/{username}/repos
GET /repos/{owner}/{repo}/commits
GET /repos/{owner}/{repo}/languages
GET /repos/{owner}/{repo}/readme
```

### Rotas internas

```txt
/api/github/profile
/api/github/repos
/api/github/commits
/api/github/sync
```

### Serviço GitHub

```ts
type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  topics?: string[];
};

type GitHubCommit = {
  sha: string;
  message: string;
  html_url: string;
  committed_at: string;
  repository_name: string;
};
```

### Funções necessárias

```txt
fetchGitHubProfile(username)
fetchGitHubRepos(username)
fetchRepoCommits(owner, repo)
syncGitHubAccount(userId)
upsertImportedRepos(userId, repos)
upsertRecentCommits(userId, commits)
```

### Política de sincronização

```txt
Manual no MVP:
- botão "Sincronizar GitHub"

Automática depois:
- cron a cada 6 ou 12 horas
- webhook do GitHub, se usar GitHub App
```

---

## 8.8 Módulo de Projetos

### Objetivo

Transformar repositórios em cards de portfólio.

### Campos

```txt
id
user_id
github_repo_id
title
slug
description
long_description
tech_stack
cover_image_url
repo_url
demo_url
status
visibility
featured
imported_from_github
created_at
updated_at
```

### Status

```txt
Ideia
Em desenvolvimento
MVP
Publicado
Arquivado
```

### Funções

- importar repositório;
- editar descrição para portfólio;
- adicionar link de demo;
- marcar como destaque;
- ocultar do público;
- adicionar imagem de capa;
- ordenar projetos;
- gerar descrição com IA, opcional.

### Card público

```txt
Título
Descrição curta
Stack
Status
GitHub link
Demo link
Último commit
Estrelas
```

---

## 8.9 Portfólio Público

### Objetivo

Exibir a evolução do usuário para terceiros.

### URL

```txt
/u/[username]
```

### Seções

1. Hero pessoal
2. Sobre
3. Tecnologias
4. Projetos em destaque
5. Timeline de estudos
6. Commits recentes
7. Insights públicos
8. Metas concluídas
9. Contato

### Exemplo de estrutura

```txt
/u/joaotitua
  ├── Hero: João Titua
  ├── Headline: Desenvolvedor Fullstack em formação
  ├── Stack principal: React, Node.js, Supabase
  ├── Projetos
  ├── Evolução semanal
  ├── GitHub activity
  └── CTA: Entrar em contato
```

### Configurações públicas

```txt
show_email
show_github
show_linkedin
show_commits
show_goals
show_insights
show_learning_timeline
theme
accent_color
```

---

## 8.10 Timeline de Estudos

### Objetivo

Mostrar evolução em ordem cronológica.

### Eventos possíveis

```txt
Tecnologia adicionada
Meta concluída
Insight publicado
Projeto criado
Projeto publicado
Commit importado
Nível atualizado
```

### Campos

```txt
id
user_id
event_type
title
description
metadata
visibility
created_at
```

### Funções

- criar evento automático;
- criar evento manual;
- filtrar por tipo;
- exibir timeline pública;
- ocultar evento.

---

## 8.11 Analytics Pessoal

### Objetivo

Dar feedback visual para o usuário.

### Métricas

```txt
Metas concluídas por semana
Tecnologias estudadas por categoria
Commits por semana
Projetos publicados por mês
Insights escritos por mês
Dias ativos
```

### Gráficos

- gráfico de barras: commits por semana;
- gráfico de linha: evolução de metas;
- gráfico de pizza/donut: tecnologias por categoria;
- heatmap: dias de estudo;
- cards numéricos.

---

## 8.12 Exportação

### Funcionalidades futuras

- exportar portfólio em PDF;
- exportar currículo técnico;
- exportar resumo semanal;
- gerar README de perfil GitHub;
- gerar bio para LinkedIn.

---

## 9. Páginas do Sistema

### Públicas

```txt
/
  Landing page

/u/[username]
  Portfólio público

/explore
  Explorar perfis públicos, opcional

/pricing
  Planos, futuro

/about
  Sobre o projeto
```

### Privadas

```txt
/app
  Dashboard

/app/onboarding
  Configuração inicial

/app/technologies
  Tecnologias

/app/goals
  Metas semanais

/app/insights
  Anotações

/app/projects
  Projetos

/app/github
  Integração GitHub

/app/analytics
  Métricas

/app/settings
  Configurações

/app/settings/public-profile
  Configuração do portfólio público
```

---

## 10. Estrutura de Pastas

```txt
devtrack-portfolio/
  ├── app/
  │   ├── (public)/
  │   │   ├── page.tsx
  │   │   ├── u/
  │   │   │   └── [username]/
  │   │   │       └── page.tsx
  │   │   └── about/
  │   │       └── page.tsx
  │   │
  │   ├── (auth)/
  │   │   ├── login/
  │   │   │   └── page.tsx
  │   │   ├── register/
  │   │   │   └── page.tsx
  │   │   └── forgot-password/
  │   │       └── page.tsx
  │   │
  │   ├── app/
  │   │   ├── layout.tsx
  │   │   ├── page.tsx
  │   │   ├── onboarding/
  │   │   ├── technologies/
  │   │   ├── goals/
  │   │   ├── insights/
  │   │   ├── projects/
  │   │   ├── github/
  │   │   ├── analytics/
  │   │   └── settings/
  │   │
  │   ├── api/
  │   │   ├── github/
  │   │   │   ├── profile/
  │   │   │   │   └── route.ts
  │   │   │   ├── repos/
  │   │   │   │   └── route.ts
  │   │   │   ├── commits/
  │   │   │   │   └── route.ts
  │   │   │   └── sync/
  │   │   │       └── route.ts
  │   │   └── cron/
  │   │       └── github-sync/
  │   │           └── route.ts
  │   │
  │   ├── layout.tsx
  │   └── globals.css
  │
  ├── components/
  │   ├── ui/
  │   ├── layout/
  │   │   ├── app-sidebar.tsx
  │   │   ├── app-header.tsx
  │   │   └── public-navbar.tsx
  │   ├── dashboard/
  │   ├── technologies/
  │   ├── goals/
  │   ├── insights/
  │   ├── projects/
  │   ├── github/
  │   └── portfolio/
  │
  ├── lib/
  │   ├── supabase/
  │   │   ├── client.ts
  │   │   ├── server.ts
  │   │   └── middleware.ts
  │   ├── github/
  │   │   ├── client.ts
  │   │   ├── service.ts
  │   │   └── types.ts
  │   ├── validators/
  │   ├── utils.ts
  │   └── constants.ts
  │
  ├── actions/
  │   ├── technologies.ts
  │   ├── goals.ts
  │   ├── insights.ts
  │   ├── projects.ts
  │   └── profile.ts
  │
  ├── types/
  │   ├── database.ts
  │   ├── github.ts
  │   └── app.ts
  │
  ├── supabase/
  │   ├── migrations/
  │   └── seed.sql
  │
  ├── public/
  │   └── images/
  │
  ├── .env.example
  ├── package.json
  ├── tailwind.config.ts
  ├── next.config.ts
  └── README.md
```

---

## 11. Modelo de Dados

## 11.1 Tabela `profiles`

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  public_username text unique not null,
  display_name text not null,
  headline text,
  bio text,
  avatar_url text,
  banner_url text,
  github_username text,
  linkedin_url text,
  website_url text,
  email_public text,
  current_focus text,
  experience_level text check (
    experience_level in ('beginner', 'basic', 'intermediate', 'advanced', 'professional')
  ),
  portfolio_visibility text default 'public' check (
    portfolio_visibility in ('public', 'private', 'unlisted')
  ),
  theme text default 'default',
  accent_color text default '#7C3AED',
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## 11.2 Tabela `technologies`

```sql
create table technologies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  level text not null default 'beginner',
  target_level text,
  status text not null default 'studying',
  notes text,
  is_public boolean default true,
  started_at date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## 11.3 Tabela `weekly_goals`

```sql
create table weekly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  technology_id uuid references technologies(id) on delete set null,
  title text not null,
  description text,
  week_start date not null,
  week_end date not null,
  status text default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'cancelled')
  ),
  priority text default 'medium' check (
    priority in ('low', 'medium', 'high', 'critical')
  ),
  is_public boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## 11.4 Tabela `study_insights`

```sql
create table study_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  technology_id uuid references technologies(id) on delete set null,
  title text not null,
  content text not null,
  tags text[] default '{}',
  insight_type text default 'concept',
  visibility text default 'private' check (
    visibility in ('private', 'public', 'unlisted')
  ),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## 11.5 Tabela `github_connections`

```sql
create table github_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  github_user_id bigint,
  github_username text not null,
  access_token_encrypted text,
  refresh_token_encrypted text,
  scope text,
  connected_at timestamptz default now(),
  last_synced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);
```

> Para MVP público por username, `access_token_encrypted` pode ficar nulo.

## 11.6 Tabela `github_repositories`

```sql
create table github_repositories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  github_repo_id bigint not null,
  name text not null,
  full_name text not null,
  description text,
  html_url text not null,
  homepage_url text,
  language text,
  topics text[] default '{}',
  stars int default 0,
  forks int default 0,
  pushed_at timestamptz,
  imported_at timestamptz default now(),
  raw_data jsonb,
  unique(user_id, github_repo_id)
);
```

## 11.7 Tabela `projects`

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  github_repository_id uuid references github_repositories(id) on delete set null,
  title text not null,
  slug text not null,
  short_description text,
  long_description text,
  tech_stack text[] default '{}',
  cover_image_url text,
  repo_url text,
  demo_url text,
  status text default 'in_development' check (
    status in ('idea', 'in_development', 'mvp', 'published', 'archived')
  ),
  visibility text default 'private' check (
    visibility in ('private', 'public', 'unlisted')
  ),
  featured boolean default false,
  display_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, slug)
);
```

## 11.8 Tabela `github_commits`

```sql
create table github_commits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  repository_id uuid references github_repositories(id) on delete cascade,
  sha text not null,
  message text,
  html_url text,
  committed_at timestamptz,
  author_name text,
  raw_data jsonb,
  created_at timestamptz default now(),
  unique(user_id, sha)
);
```

## 11.9 Tabela `timeline_events`

```sql
create table timeline_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  title text not null,
  description text,
  metadata jsonb default '{}',
  visibility text default 'private' check (
    visibility in ('private', 'public', 'unlisted')
  ),
  created_at timestamptz default now()
);
```

## 11.10 Tabela `portfolio_settings`

```sql
create table portfolio_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  show_email boolean default false,
  show_github boolean default true,
  show_linkedin boolean default true,
  show_commits boolean default true,
  show_goals boolean default false,
  show_insights boolean default true,
  show_learning_timeline boolean default true,
  selected_template text default 'minimal',
  custom_css text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);
```

---

## 12. Segurança

### Regras principais

- Nunca expor token do GitHub no client.
- Tokens devem ser criptografados antes de salvar.
- Toda consulta privada deve filtrar por `user_id`.
- Usar RLS no Supabase.
- Validar input com Zod.
- Rate limit nas rotas de sync.
- Sanitizar conteúdo Markdown público.
- Não confiar em dados vindos do client.
- Server Actions devem checar autenticação e autorização.

### RLS básico

```sql
alter table profiles enable row level security;
alter table technologies enable row level security;
alter table weekly_goals enable row level security;
alter table study_insights enable row level security;
alter table projects enable row level security;
alter table github_repositories enable row level security;
alter table github_commits enable row level security;
alter table timeline_events enable row level security;
alter table portfolio_settings enable row level security;
```

### Política exemplo para dados próprios

```sql
create policy "Users can read own technologies"
on technologies for select
using (auth.uid() = user_id);

create policy "Users can insert own technologies"
on technologies for insert
with check (auth.uid() = user_id);

create policy "Users can update own technologies"
on technologies for update
using (auth.uid() = user_id);

create policy "Users can delete own technologies"
on technologies for delete
using (auth.uid() = user_id);
```

### Política exemplo para dados públicos

```sql
create policy "Anyone can read public projects"
on projects for select
using (visibility = 'public');
```

---

## 13. UX e Design

## 13.1 Estilo visual

### Paleta recomendada

```txt
Background dark: #0F172A
Surface: #111827
Surface soft: #1E293B
Primary: #7C3AED
Primary hover: #6D28D9
Text main: #F8FAFC
Text muted: #94A3B8
Border: #334155
Success: #22C55E
Warning: #F59E0B
Error: #EF4444
```

### Versão light

```txt
Background: #F8FAFC
Surface: #FFFFFF
Surface soft: #F1F5F9
Primary: #7C3AED
Text main: #0F172A
Text muted: #64748B
Border: #E2E8F0
```

### Tipografia

```txt
Fonte principal: Inter
Fonte código: JetBrains Mono
```

### Estilo de componentes

- cards com borda leve;
- cantos arredondados `rounded-2xl`;
- sombras suaves;
- ícones lineares;
- alto contraste;
- layout em grid;
- sidebar fixa no app;
- hero forte no portfólio público.

---

## 13.2 Layout Dashboard

```txt
┌──────────────────────────────────────────────────────┐
│ Header: Olá, João                     Sync GitHub    │
├───────────────┬──────────────────────────────────────┤
│ Sidebar       │ Cards de métricas                    │
│               │                                      │
│ Dashboard     │ ┌────────┐ ┌────────┐ ┌────────┐     │
│ Tecnologias   │ │Metas   │ │Commits │ │Projetos│     │
│ Metas         │ └────────┘ └────────┘ └────────┘     │
│ Insights      │                                      │
│ Projetos      │ Lista de metas + commits recentes    │
│ GitHub        │                                      │
│ Analytics     │ Gráficos                             │
│ Settings      │                                      │
└───────────────┴──────────────────────────────────────┘
```

---

## 13.3 Layout Portfólio Público

```txt
┌──────────────────────────────────────────────────────┐
│ Hero: Nome, headline, avatar, links                  │
├──────────────────────────────────────────────────────┤
│ Sobre                                                │
├──────────────────────────────────────────────────────┤
│ Stack principal                                      │
├──────────────────────────────────────────────────────┤
│ Projetos em destaque                                 │
├──────────────────────────────────────────────────────┤
│ Timeline de estudos                                  │
├──────────────────────────────────────────────────────┤
│ Commits recentes                                     │
├──────────────────────────────────────────────────────┤
│ Insights públicos                                    │
├──────────────────────────────────────────────────────┤
│ CTA contato                                          │
└──────────────────────────────────────────────────────┘
```

---

## 14. Componentes Principais

### Layout

```txt
AppShell
AppSidebar
AppHeader
PageContainer
SectionHeader
EmptyState
LoadingState
ErrorState
```

### Dashboard

```txt
MetricCard
WeeklyProgress
LearningStreak
RecentActivity
RecentCommits
GoalSummary
PortfolioHealthCard
```

### Tecnologia

```txt
TechnologyCard
TechnologyForm
TechnologyFilter
TechnologyLevelBadge
TechnologyStatusBadge
```

### Metas

```txt
GoalCard
GoalForm
GoalCalendarWeek
GoalPriorityBadge
GoalCompletionToggle
```

### Insights

```txt
InsightEditor
InsightCard
InsightTagInput
MarkdownPreview
VisibilitySelect
```

### Projetos

```txt
ProjectCard
ProjectForm
GitHubRepoImportCard
FeaturedProjectToggle
ProjectVisibilityBadge
```

### GitHub

```txt
GitHubConnectButton
GitHubProfileCard
GitHubRepoList
GitHubSyncButton
GitHubCommitList
SyncStatus
```

### Portfólio público

```txt
PortfolioHero
PortfolioAbout
PortfolioTechStack
PortfolioFeaturedProjects
PortfolioTimeline
PortfolioGitHubActivity
PortfolioInsights
PortfolioContactCTA
```

---

## 15. Server Actions

### `actions/technologies.ts`

```txt
createTechnology(data)
updateTechnology(id, data)
deleteTechnology(id)
changeTechnologyStatus(id, status)
toggleTechnologyPublic(id)
```

### `actions/goals.ts`

```txt
createWeeklyGoal(data)
updateWeeklyGoal(id, data)
completeWeeklyGoal(id)
cancelWeeklyGoal(id)
moveGoalToNextWeek(id)
```

### `actions/insights.ts`

```txt
createInsight(data)
updateInsight(id, data)
deleteInsight(id)
publishInsight(id)
makeInsightPrivate(id)
```

### `actions/projects.ts`

```txt
createProject(data)
updateProject(id, data)
deleteProject(id)
toggleProjectFeatured(id)
toggleProjectVisibility(id)
importProjectFromGitHub(repoId)
```

### `actions/profile.ts`

```txt
updateProfile(data)
updatePortfolioSettings(data)
completeOnboarding(data)
changePublicUsername(username)
```

---

## 16. API Routes

### GitHub

```txt
GET  /api/github/profile?username=
GET  /api/github/repos?username=
GET  /api/github/commits?owner=&repo=
POST /api/github/sync
```

### Cron

```txt
GET /api/cron/github-sync
```

### Webhook futuro

```txt
POST /api/webhooks/github
```

---

## 17. Validações com Zod

### Tecnologia

```ts
import { z } from "zod";

export const technologySchema = z.object({
  name: z.string().min(1).max(60),
  category: z.string().min(1),
  level: z.enum(["beginner", "basic", "intermediate", "advanced", "professional"]),
  target_level: z.string().optional(),
  status: z.enum(["planned", "studying", "paused", "completed", "reviewing"]),
  notes: z.string().max(1000).optional(),
  is_public: z.boolean().default(true),
});
```

### Meta

```ts
export const weeklyGoalSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(1000).optional(),
  week_start: z.string(),
  week_end: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  technology_id: z.string().uuid().optional(),
});
```

### Projeto

```ts
export const projectSchema = z.object({
  title: z.string().min(3).max(120),
  slug: z.string().min(3).max(80),
  short_description: z.string().max(240).optional(),
  long_description: z.string().max(5000).optional(),
  tech_stack: z.array(z.string()).default([]),
  repo_url: z.string().url().optional(),
  demo_url: z.string().url().optional(),
  visibility: z.enum(["private", "public", "unlisted"]),
  featured: z.boolean().default(false),
});
```

---

## 18. Fluxos Críticos

## 18.1 Criar conta e publicar portfólio

```txt
1. Usuário acessa landing page
2. Clica em "Criar meu hub"
3. Faz cadastro/login
4. Passa pelo onboarding
5. Informa username do GitHub
6. Sistema importa repositórios públicos
7. Usuário escolhe projetos para exibir
8. Usuário adiciona tecnologias em estudo
9. Sistema gera página pública
10. Usuário compartilha link
```

## 18.2 Sincronizar GitHub

```txt
1. Usuário clica "Sincronizar GitHub"
2. Backend valida sessão
3. Backend busca username ou token salvo
4. Backend chama GitHub API
5. Sistema atualiza repositórios
6. Sistema atualiza commits recentes
7. Sistema cria eventos na timeline
8. Dashboard mostra status atualizado
```

## 18.3 Criar meta semanal

```txt
1. Usuário abre /app/goals
2. Clica "Nova meta"
3. Preenche título, descrição, prioridade e tecnologia relacionada
4. Backend valida dados
5. Insere no banco
6. Cria evento na timeline
7. Atualiza dashboard
```

## 18.4 Tornar projeto público

```txt
1. Usuário abre /app/projects
2. Escolhe projeto
3. Edita título, descrição, stack e demo
4. Ativa visibilidade pública
5. Sistema exibe no portfólio
6. Página /u/[username] atualiza
```

---

## 19. Regras de Negócio

### Perfil

- `public_username` deve ser único.
- Username deve conter apenas letras, números, hífen e underscore.
- Portfólio privado não aparece publicamente.
- Usuário pode mudar username, mas deve avisar que o link antigo quebra.

### Tecnologias

- Tecnologia pode ser privada ou pública.
- Não permitir duplicata exata por usuário.
- Tecnologia concluída pode continuar aparecendo no portfólio.

### Metas

- Meta concluída recebe `completed_at`.
- Meta cancelada não conta como concluída.
- Metas públicas podem aparecer na timeline.
- Meta só pode pertencer ao dono.

### Projetos

- Projeto público precisa ter título e descrição.
- Projeto em destaque aparece primeiro.
- Máximo recomendado de 3 a 6 projetos em destaque.
- Projeto importado do GitHub pode ser editado sem alterar repo original.

### GitHub

- Sync manual deve ter cooldown para evitar abuso.
- Repositórios arquivados podem ser ocultados por padrão.
- Repositórios forkados podem ser ocultados por padrão.
- Commits devem ser deduplicados por SHA.

---

## 20. MVP

## 20.1 O que entra no MVP

### Essencial

- cadastro/login;
- onboarding simples;
- dashboard;
- CRUD de tecnologias;
- CRUD de metas semanais;
- CRUD de insights;
- busca pública por username GitHub;
- importação de repositórios públicos;
- criação manual de projetos;
- portfólio público;
- configurações de visibilidade.

### Não entra no MVP

- plano pago;
- IA geradora de descrições;
- webhook GitHub;
- app mobile;
- exportação PDF;
- marketplace de templates;
- comunidade interna;
- comentários;
- ranking público.

---

## 21. Roadmap

### Fase 1 — MVP funcional

**Objetivo:** validar ideia.

Entregas:

- auth;
- dashboard;
- tecnologias;
- metas;
- insights;
- importação GitHub por username;
- portfólio público.

### Fase 2 — GitHub OAuth

**Objetivo:** melhorar integração.

Entregas:

- conectar GitHub;
- salvar token seguro;
- sync mais confiável;
- commits recentes;
- escolha de repositórios.

### Fase 3 — Analytics e IA

**Objetivo:** dar inteligência ao produto.

Entregas:

- gráficos;
- score de consistência;
- resumo semanal;
- sugestão de metas;
- geração de descrição de projeto com IA.

### Fase 4 — Monetização

**Objetivo:** transformar em SaaS.

Entregas:

- templates premium;
- domínio customizado;
- exportação PDF;
- analytics avançado;
- portfólio sem marca;
- plano para bootcamps.

---

## 22. Backlog Priorizado

| Prioridade | Item | Tipo |
|---|---|---|
| Alta | Auth Supabase | Backend |
| Alta | Onboarding | Produto |
| Alta | CRUD tecnologias | Core |
| Alta | CRUD metas | Core |
| Alta | CRUD projetos | Core |
| Alta | Portfólio público | Core |
| Alta | Importar repos GitHub | Integração |
| Média | Commits recentes | Integração |
| Média | Dashboard analytics | UI |
| Média | Timeline | Core |
| Média | Configurações públicas | Produto |
| Baixa | Export PDF | Feature |
| Baixa | IA para README | Feature |
| Baixa | Templates premium | Monetização |

---

## 23. Critérios de Aceite

### Auth

- Usuário consegue criar conta.
- Usuário consegue fazer login.
- Usuário não acessa `/app` sem sessão.
- Usuário consegue sair.

### Onboarding

- Usuário informa dados básicos.
- Username público é validado.
- Perfil é criado no banco.
- Após completar, usuário vai para dashboard.

### Tecnologias

- Usuário cria tecnologia.
- Usuário edita tecnologia.
- Usuário remove tecnologia.
- Usuário filtra por categoria/status.
- Dados de outro usuário não aparecem.

### GitHub

- Usuário informa username GitHub.
- Sistema lista repositórios públicos.
- Usuário importa repositório como projeto.
- Dados duplicados não são criados.
- Erros da API são tratados.

### Portfólio

- Página pública abre por username.
- Mostra projetos públicos.
- Não mostra dados privados.
- Respeita configurações de visibilidade.
- Página fica responsiva.

---

## 24. Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_TOKEN_ENCRYPTION_KEY=

CRON_SECRET=
```

---

## 25. Comandos de Setup

```bash
npx create-next-app@latest devtrack-portfolio --typescript --tailwind --eslint --app
cd devtrack-portfolio

npm install @supabase/supabase-js @supabase/ssr
npm install zod
npm install lucide-react
npm install recharts
npm install clsx tailwind-merge
npx shadcn@latest init
```

Componentes shadcn sugeridos:

```bash
npx shadcn@latest add button card input textarea badge dialog dropdown-menu progress tabs select switch separator avatar skeleton
```

---

## 26. Exemplo de `README.md` do Projeto

```md
# DevTrack Portfolio

Hub de estudos e portfólio tech vivo conectado ao GitHub.

## Funcionalidades

- Organizar tecnologias estudadas
- Criar metas semanais
- Registrar insights
- Importar repositórios do GitHub
- Publicar portfólio público
- Exibir progresso e commits recentes

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- GitHub API

## Rodar local

```bash
npm install
npm run dev
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e configure Supabase/GitHub.

## Status

MVP em desenvolvimento.
```

---

## 27. Landing Page

### Objetivo

Converter estudante em usuário.

### Estrutura

```txt
Hero
Problema
Solução
Como funciona
Demonstração visual
Benefícios
Exemplo de portfólio
CTA final
```

### Hero

```txt
Headline:
Transforme seus estudos em um portfólio vivo.

Subheadline:
Organize tecnologias, metas, projetos e commits em um só lugar. Mostre sua evolução real para recrutadores.

CTA principal:
Criar meu hub gratuito

CTA secundário:
Ver exemplo de portfólio
```

### Bloco problema

```txt
Você estuda, pratica, faz projetos...
mas sua evolução fica espalhada.
```

### Bloco solução

```txt
DevTrack junta estudos, GitHub e portfólio público em uma página profissional.
```

### Benefícios

```txt
- Mostre consistência
- Organize metas semanais
- Conecte GitHub
- Publique projetos com contexto
- Tenha uma vitrine profissional
```

---

## 28. Copy para Interface

### Empty states

```txt
Nenhuma tecnologia adicionada ainda.
Comece registrando o que você está estudando agora.
```

```txt
Nenhum projeto público.
Importe um repositório do GitHub ou crie um projeto manual.
```

```txt
Sem metas para esta semana.
Defina uma meta pequena e conclua até domingo.
```

### Botões

```txt
Nova tecnologia
Nova meta
Novo insight
Importar do GitHub
Sincronizar GitHub
Publicar no portfólio
Ver meu portfólio
```

### Mensagens de sucesso

```txt
Tecnologia adicionada.
Meta concluída.
Projeto publicado.
GitHub sincronizado.
Perfil atualizado.
```

### Mensagens de erro

```txt
Não foi possível sincronizar o GitHub agora.
Username público já está em uso.
Você não tem permissão para editar este item.
Preencha os campos obrigatórios.
```

---

## 29. Sugestão de IA Interna no Futuro

### Funções com IA

- resumir semana de estudos;
- sugerir próximas metas;
- melhorar descrição de projeto;
- gerar README;
- gerar bio profissional;
- sugerir stack faltante;
- transformar insights em posts para LinkedIn.

### Prompt exemplo — descrição de projeto

```txt
Você é um redator técnico e recrutador de desenvolvedores júnior.
Crie uma descrição clara e profissional para este projeto.

Dados:
Nome: {{project_name}}
Stack: {{tech_stack}}
Descrição bruta: {{raw_description}}
Funcionalidades: {{features}}

Retorne:
1. Descrição curta
2. Descrição longa
3. Principais aprendizados
4. Pontos técnicos relevantes
```

---

## 30. Plano de Execução em 14 Dias

### Dia 1

- criar projeto Next.js;
- configurar Tailwind;
- configurar shadcn/ui;
- criar layout base.

### Dia 2

- configurar Supabase;
- criar tabelas;
- ativar RLS;
- configurar Auth.

### Dia 3

- criar login/register;
- proteger rotas;
- criar perfil básico.

### Dia 4

- onboarding;
- validação de username público;
- salvar configurações iniciais.

### Dia 5

- CRUD tecnologias;
- filtros;
- cards.

### Dia 6

- CRUD metas semanais;
- status;
- progresso semanal.

### Dia 7

- CRUD insights;
- editor simples;
- tags.

### Dia 8

- integração GitHub pública por username;
- listar repositórios.

### Dia 9

- importar repo como projeto;
- editar projeto;
- visibilidade pública.

### Dia 10

- página pública `/u/[username]`;
- hero;
- stack;
- projetos.

### Dia 11

- commits recentes;
- timeline básica.

### Dia 12

- dashboard com métricas;
- cards;
- gráficos simples.

### Dia 13

- configurações públicas;
- ajustes responsivos;
- tratamento de erro.

### Dia 14

- deploy;
- testes finais;
- README;
- gravação de demo.

---

## 31. Deploy

### Recomendação

- **Vercel** para Next.js.
- **Supabase Cloud** para banco/auth.
- **GitHub** para versionamento.

### Checklist

```txt
[ ] Variáveis de ambiente no Vercel
[ ] Supabase URL configurada
[ ] Supabase anon key configurada
[ ] RLS ativo
[ ] Políticas testadas
[ ] Domínio público funcionando
[ ] Página /u/[username] indexável
[ ] Erros monitorados
```

---

## 32. Testes Essenciais

### Testes manuais

```txt
[ ] Criar conta
[ ] Login/logout
[ ] Completar onboarding
[ ] Criar tecnologia
[ ] Criar meta
[ ] Concluir meta
[ ] Criar insight privado
[ ] Tornar insight público
[ ] Buscar GitHub username
[ ] Importar repositório
[ ] Publicar projeto
[ ] Abrir portfólio público
[ ] Confirmar que dados privados não aparecem
```

### Testes automatizados futuros

- validação de schemas;
- actions protegidas;
- RLS;
- renderização de portfólio;
- integração GitHub mockada.

---

## 33. Métricas de Produto

### Para acompanhar

```txt
Usuários cadastrados
Usuários que completaram onboarding
Usuários que conectaram GitHub
Projetos publicados
Metas criadas por semana
Metas concluídas
Portfólios públicos ativos
Cliques em links de contato
```

### Métrica principal

```txt
Número de usuários com portfólio público + pelo menos 1 projeto publicado.
```

### Métrica de retenção

```txt
Usuários que registram pelo menos 1 atividade por semana.
```

---

## 34. Monetização Futura

### Plano gratuito

```txt
1 portfólio público
Projetos ilimitados
Metas e insights básicos
GitHub sync manual
```

### Plano Pro

```txt
Templates premium
Domínio customizado
Exportação PDF
IA para descrições
Analytics avançado
GitHub sync automático
Sem marca do produto
```

### Plano Bootcamp

```txt
Turmas
Painel do mentor
Acompanhamento de alunos
Relatórios de evolução
Ranking privado
```

---

## 35. Riscos e Soluções

| Risco | Solução |
|---|---|
| Usuário abandona após cadastro | Onboarding curto |
| Portfólio fica vazio | Importar GitHub logo no início |
| GitHub API limita requisições | Cache + sync manual + rate limit |
| Dados privados vazam | RLS + visibilidade clara |
| App vira só mais um Notion | Foco em GitHub + portfólio público |
| Escopo cresce demais | MVP enxuto |

---

## 36. Versão Simples para Começar

Se quiser reduzir escopo ao máximo, faça só isto:

```txt
1. Login
2. Perfil público
3. Lista de tecnologias
4. Lista de projetos
5. Importar repositórios públicos do GitHub
6. Página /u/[username]
```

Depois adiciona:

```txt
7. Metas
8. Insights
9. Commits
10. Analytics
```

---

## 37. Prompt para Pedir a uma IA Programadora Criar o Projeto

```txt
Você é um desenvolvedor fullstack sênior.
Crie um MVP chamado DevTrack Portfolio.

Objetivo:
Um web app onde estudantes de tecnologia organizam estudos, metas, insights, projetos e publicam um portfólio público conectado ao GitHub.

Stack obrigatória:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security
- GitHub REST API

Funcionalidades MVP:
1. Cadastro/login com Supabase Auth.
2. Onboarding com nome público, username, headline, bio, foco atual e GitHub username.
3. Dashboard privado em /app.
4. CRUD de tecnologias.
5. CRUD de metas semanais.
6. CRUD de insights.
7. Buscar repositórios públicos do GitHub por username.
8. Importar repositórios como projetos.
9. CRUD de projetos.
10. Configurar visibilidade pública/privada.
11. Página pública em /u/[username].
12. RLS para proteger dados privados.
13. Layout responsivo, moderno e limpo.

Crie:
- estrutura de pastas;
- schema SQL;
- componentes principais;
- server actions;
- route handlers;
- validações com Zod;
- páginas principais;
- README;
- .env.example.

Regras:
- Não exponha tokens no client.
- Toda ação privada deve validar sessão.
- Toda query privada deve filtrar por user_id.
- Dados públicos só aparecem quando visibility = public.
- Use componentes shadcn/ui.
- Use design limpo com cards, sidebar e dashboard.
```

---

## 38. Conclusão

Este projeto é forte porque une três coisas:

1. **utilidade real para quem estuda;**
2. **integração técnica boa para portfólio;**
3. **produto com potencial SaaS.**

Como projeto de aprendizado, ele cobre:

- front-end moderno;
- autenticação;
- banco relacional;
- API externa;
- autorização;
- dashboard;
- portfólio público;
- deploy;
- UX de produto real.

Como portfólio, ele prova que o desenvolvedor sabe criar uma aplicação completa, útil e com lógica de negócio clara.

---

## 39. Fontes Técnicas Oficiais Consultadas

- GitHub Docs — REST API authentication
- GitHub Docs — OAuth Apps
- GitHub Docs — GitHub Apps
- GitHub Docs — REST API repositories/commits
- Next.js Docs — App Router
- Next.js Docs — Route Handlers
- Next.js Docs — Server Actions
- Supabase Docs — Auth
- Supabase Docs — Row Level Security
