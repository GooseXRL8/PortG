import type {
  UserProfile, Technology, WeeklyGoal, StudyInsight,
  Project, ImportedRepo, GitHubCommit, TimelineEvent, PortfolioSettings,
  TimelineEventType
} from "./types";
import { supabase } from "./supabase";

export const store = {
  getUsers: async (): Promise<UserProfile[]> => {
    const { data } = await supabase.from("profiles").select("*");
    return data || [];
  },
  
  getCurrentUserId: async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id ?? null;
  },
  
  getCurrentUser: async (): Promise<UserProfile | null> => {
    const id = await store.getCurrentUserId();
    if (!id) return null;
    const { data } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    return data ?? null;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const id = await store.getCurrentUserId();
    if (!id) throw new Error("Usuário não autenticado.");
    const { data: updated, error } = await supabase
      .from("profiles")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return updated as UserProfile;
  },

  getUserByUsername: async (username: string): Promise<UserProfile | null> => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("public_username", username)
      .maybeSingle();
    return data ?? null;
  },

  resetPassword: async (email: string, newPassword: string): Promise<void> => {
    // Note: Em produção, o Supabase exige envio de e-mail de recuperação por motivos de segurança.
    // Lançamos um erro informativo claro se tentado de forma direta.
    throw new Error("Por motivos de segurança no Supabase, a redefinição de senha deve ser feita através do fluxo de recuperação de e-mail.");
  },

  // Technologies
  getTechnologies: async (uid?: string): Promise<Technology[]> => {
    const userId = uid || await store.getCurrentUserId();
    if (!userId) return [];
    const { data } = await supabase
      .from("technologies")
      .select("*")
      .eq("user_id", userId);
    return data || [];
  },

  createTechnology: async (data: Omit<Technology, "id"|"user_id"|"created_at"|"updated_at">): Promise<Technology> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    const { data: created, error } = await supabase
      .from("technologies")
      .insert({ ...data, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    
    await store.addTimelineEvent("tech_added", `Adicionou ${created.name}`, `Categoria: ${created.category}`);
    return created as Technology;
  },

  updateTechnology: async (id: string, data: Partial<Technology>): Promise<Technology> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    const { data: updated, error } = await supabase
      .from("technologies")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return updated as Technology;
  },

  deleteTechnology: async (id: string): Promise<void> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    const { error } = await supabase
      .from("technologies")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
  },

  // Goals
  getGoals: async (uid?: string): Promise<WeeklyGoal[]> => {
    const userId = uid || await store.getCurrentUserId();
    if (!userId) return [];
    const { data } = await supabase
      .from("weekly_goals")
      .select("*")
      .eq("user_id", userId);
    return data || [];
  },

  createGoal: async (data: Omit<WeeklyGoal, "id"|"user_id"|"created_at"|"updated_at">): Promise<WeeklyGoal> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    const { data: created, error } = await supabase
      .from("weekly_goals")
      .insert({ ...data, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return created as WeeklyGoal;
  },

  updateGoal: async (id: string, data: Partial<WeeklyGoal>): Promise<WeeklyGoal> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    
    const updatePayload: any = { ...data, updated_at: new Date().toISOString() };
    if (data.status === "completed") {
      updatePayload.completed_at = new Date().toISOString();
    }
    
    const { data: updated, error } = await supabase
      .from("weekly_goals")
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    
    if (data.status === "completed") {
      await store.addTimelineEvent("goal_completed", `Meta concluída: ${updated.title}`, "");
    }
    return updated as WeeklyGoal;
  },

  deleteGoal: async (id: string): Promise<void> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    const { error } = await supabase
      .from("weekly_goals")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
  },

  // Insights
  getInsights: async (uid?: string): Promise<StudyInsight[]> => {
    const userId = uid || await store.getCurrentUserId();
    if (!userId) return [];
    const { data } = await supabase
      .from("study_insights")
      .select("*")
      .eq("user_id", userId);
    return data || [];
  },

  createInsight: async (data: Omit<StudyInsight, "id"|"user_id"|"created_at"|"updated_at">): Promise<StudyInsight> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    
    // Convert tags array to standard string array formatted for PostgreSQL
    const { data: created, error } = await supabase
      .from("study_insights")
      .insert({ ...data, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    
    if (created.visibility === "public") {
      await store.addTimelineEvent("insight_published", `Insight: ${created.title}`, "");
    }
    return created as StudyInsight;
  },

  updateInsight: async (id: string, data: Partial<StudyInsight>): Promise<StudyInsight> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    const { data: updated, error } = await supabase
      .from("study_insights")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return updated as StudyInsight;
  },

  deleteInsight: async (id: string): Promise<void> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    const { error } = await supabase
      .from("study_insights")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
  },

  // Projects
  getProjects: async (uid?: string): Promise<Project[]> => {
    const userId = uid || await store.getCurrentUserId();
    if (!userId) return [];
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("display_order", { ascending: true });
    return data || [];
  },

  createProject: async (data: Omit<Project, "id"|"user_id"|"created_at"|"updated_at">): Promise<Project> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    const { data: created, error } = await supabase
      .from("projects")
      .insert({ ...data, user_id: userId })
      .select()
      .single();
    if (error) throw error;
    
    await store.addTimelineEvent("project_created", `Projeto: ${created.title}`, "");
    return created as Project;
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    const { data: updated, error } = await supabase
      .from("projects")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return updated as Project;
  },

  deleteProject: async (id: string): Promise<void> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    if (error) throw error;
  },

  // GitHub imported repos
  getImportedRepos: async (uid?: string): Promise<ImportedRepo[]> => {
    const userId = uid || await store.getCurrentUserId();
    if (!userId) return [];
    const { data } = await supabase
      .from("imported_repos")
      .select("*")
      .eq("user_id", userId);
    return data || [];
  },

  upsertImportedRepos: async (repos: Omit<ImportedRepo, "id">[]): Promise<void> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    
    const reposToUpsert = repos.map(r => ({
      user_id: userId,
      github_repo_id: r.github_repo_id,
      name: r.name,
      full_name: r.full_name,
      description: r.description,
      html_url: r.html_url,
      homepage_url: r.homepage_url,
      language: r.language,
      topics: r.topics || [],
      stars: r.stars,
      forks: r.forks,
      pushed_at: r.pushed_at,
      imported_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from("imported_repos")
      .upsert(reposToUpsert, { onConflict: "user_id, github_repo_id" });
    if (error) throw error;
  },

  // GitHub Commits
  getCommits: async (uid?: string): Promise<any[]> => {
    const userId = uid || await store.getCurrentUserId();
    if (!userId) return [];
    const { data } = await supabase
      .from("commits")
      .select("*")
      .eq("user_id", userId)
      .order("committed_at", { ascending: false });
    return data || [];
  },

  upsertCommits: async (commits: GitHubCommit[]): Promise<void> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    
    const commitsToUpsert = commits.map(c => ({
      sha: c.sha,
      user_id: userId,
      message: c.message,
      html_url: c.html_url,
      committed_at: c.committed_at,
      repository_name: c.repository_name,
      author_name: c.author_name
    }));

    const { error } = await supabase
      .from("commits")
      .upsert(commitsToUpsert, { onConflict: "user_id, sha" });
    if (error) throw error;
  },

  // Timeline
  getTimeline: async (uid?: string): Promise<TimelineEvent[]> => {
    const userId = uid || await store.getCurrentUserId();
    if (!userId) return [];
    const { data } = await supabase
      .from("timeline_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return data || [];
  },

  addTimelineEvent: async (
    type: TimelineEventType,
    title: string,
    desc: string,
    vis: "private"|"public"|"unlisted" = "public"
  ): Promise<void> => {
    const userId = await store.getCurrentUserId();
    if (!userId) return;
    const { error } = await supabase
      .from("timeline_events")
      .insert({
        user_id: userId,
        event_type: type,
        title,
        description: desc,
        metadata: {},
        visibility: vis,
        created_at: new Date().toISOString()
      });
    if (error) throw error;
  },

  // Portfolio Settings
  getPortfolioSettings: async (uid?: string): Promise<PortfolioSettings | null> => {
    const userId = uid || await store.getCurrentUserId();
    if (!userId) return null;
    const { data } = await supabase
      .from("portfolio_settings")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    return data ?? null;
  },

  updatePortfolioSettings: async (data: Partial<PortfolioSettings>): Promise<PortfolioSettings> => {
    const userId = await store.getCurrentUserId();
    if (!userId) throw new Error("Usuário não autenticado.");
    const { data: updated, error } = await supabase
      .from("portfolio_settings")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return updated as PortfolioSettings;
  },
};
