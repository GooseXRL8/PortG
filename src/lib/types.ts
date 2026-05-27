// ============================================================
// PortG Portfolio — Type Definitions
// ============================================================

// ---- User & Profile ----
export type ExperienceLevel = "beginner" | "basic" | "intermediate" | "advanced" | "professional";
export type PortfolioVisibility = "public" | "private" | "unlisted";

export interface UserProfile {
  id: string;
  email: string;
  password_hash: string;
  public_username: string;
  display_name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  banner_url: string;
  github_username: string;
  linkedin_url: string;
  website_url: string;
  email_public: string;
  current_focus: string;
  experience_level: ExperienceLevel;
  portfolio_visibility: PortfolioVisibility;
  theme: string;
  accent_color: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

// ---- Technologies ----
export type TechCategory = "Frontend" | "Backend" | "Database" | "DevOps" | "Mobile" | "AI" | "Design" | "Soft Skills" | "Tools";
export type TechLevel = "beginner" | "basic" | "intermediate" | "advanced" | "professional";
export type TechStatus = "planned" | "studying" | "paused" | "completed" | "reviewing";

export interface Technology {
  id: string;
  user_id: string;
  name: string;
  category: TechCategory;
  level: TechLevel;
  target_level: TechLevel | "";
  status: TechStatus;
  notes: string;
  is_public: boolean;
  started_at: string;
  created_at: string;
  updated_at: string;
}

// ---- Weekly Goals ----
export type GoalStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type GoalPriority = "low" | "medium" | "high" | "critical";

export interface WeeklyGoal {
  id: string;
  user_id: string;
  technology_id: string | null;
  title: string;
  description: string;
  week_start: string;
  week_end: string;
  status: GoalStatus;
  priority: GoalPriority;
  is_public: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ---- Study Insights ----
export type InsightVisibility = "private" | "public" | "unlisted";
export type InsightType = "concept" | "bug_fix" | "snippet" | "summary" | "idea" | "tip";

export interface StudyInsight {
  id: string;
  user_id: string;
  technology_id: string | null;
  title: string;
  content: string;
  tags: string[];
  insight_type: InsightType;
  visibility: InsightVisibility;
  created_at: string;
  updated_at: string;
}

// ---- GitHub ----
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  html_url: string;
  committed_at: string;
  repository_name: string;
  author_name: string;
}

export interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface ImportedRepo {
  id: string;
  user_id: string;
  github_repo_id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage_url: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  pushed_at: string;
  imported_at: string;
}

// ---- Projects ----
export type ProjectStatus = "idea" | "in_development" | "mvp" | "published" | "archived";
export type ProjectVisibility = "private" | "public" | "unlisted";

export interface Project {
  id: string;
  user_id: string;
  github_repository_id: string | null;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  tech_stack: string[];
  cover_image_url: string;
  repo_url: string;
  demo_url: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ---- Timeline Events ----
export type TimelineEventType =
  | "tech_added"
  | "goal_completed"
  | "insight_published"
  | "project_created"
  | "project_published"
  | "commit_imported"
  | "level_updated";

export interface TimelineEvent {
  id: string;
  user_id: string;
  event_type: TimelineEventType;
  title: string;
  description: string;
  metadata: Record<string, unknown>;
  visibility: "private" | "public" | "unlisted";
  created_at: string;
}

// ---- Portfolio Settings ----
export interface PortfolioSettings {
  id: string;
  user_id: string;
  show_email: boolean;
  show_github: boolean;
  show_linkedin: boolean;
  show_commits: boolean;
  show_goals: boolean;
  show_insights: boolean;
  show_learning_timeline: boolean;
  selected_template: string;
  created_at: string;
  updated_at: string;
}
