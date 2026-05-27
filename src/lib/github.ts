import type { GitHubProfile, GitHubRepo, GitHubCommit } from "./types";

const BASE = "https://api.github.com";

async function ghFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error("Usuário ou recurso não encontrado no GitHub.");
    if (res.status === 403) throw new Error("Rate limit do GitHub atingido. Tente novamente em alguns minutos.");
    throw new Error(`Erro ao buscar dados do GitHub (${res.status}).`);
  }
  return res.json();
}

export async function fetchGitHubProfile(username: string): Promise<GitHubProfile> {
  return ghFetch<GitHubProfile>(`/users/${username}`);
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const repos = await ghFetch<GitHubRepo[]>(
    `/users/${username}/repos?sort=pushed&per_page=100&type=owner`
  );
  return repos.filter((r) => !r.fork && !r.archived);
}

export async function fetchRepoCommits(
  owner: string,
  repo: string,
  perPage = 10
): Promise<GitHubCommit[]> {
  try {
    const raw = await ghFetch<Array<{
      sha: string;
      html_url: string;
      commit: { message: string; author: { name: string; date: string } };
    }>>(`/repos/${owner}/${repo}/commits?per_page=${perPage}`);

    return raw.map((c) => ({
      sha: c.sha,
      message: c.commit.message.split("\n")[0],
      html_url: c.html_url,
      committed_at: c.commit.author.date,
      repository_name: repo,
      author_name: c.commit.author.name,
    }));
  } catch {
    return [];
  }
}

export async function fetchAllRecentCommits(
  username: string,
  repos: GitHubRepo[],
  maxRepos = 5
): Promise<GitHubCommit[]> {
  const topRepos = repos.slice(0, maxRepos);
  const allCommits = await Promise.all(
    topRepos.map((r) => fetchRepoCommits(username, r.name, 5))
  );
  return allCommits
    .flat()
    .sort((a, b) => new Date(b.committed_at).getTime() - new Date(a.committed_at).getTime());
}
