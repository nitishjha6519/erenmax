const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ── Token storage ──────────────────────────────────────────────────────────

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },
  set: (token: string): void => {
    localStorage.setItem("auth_token", token);
  },
  remove: (): void => {
    localStorage.removeItem("auth_token");
  },
};

// ── Types ──────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  trustScore: number;
  location?: string;
  yoe?: number;
  showUpRate?: number; // 0–1, e.g. 0.95 = 95%
  sessionsCount?: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  pledgedPoints: number;
  status: string;
  applicationsOpen: boolean;
  defaultDurationMins?: number;
  defaultPlatform?: string;
  approvalDeadlineOffset?: string;
  applicationCount?: number;
  openSlotCount?: number;
  // legacy / backward-compat
  topic?: string;
  scheduledDate?: string;
  duration?: number;
  meetingLink?: string;
  owner?: ApiUser;
  user?: ApiUser; // new field name for goal owner (API returns this)
  openSlotsCount?: number;
  helpersCount?: number;
  repsDone?: number;
  repsTotal?: number;
  createdAt: string;
}

export interface GoalSession {
  id: string;
  topic: string;
  category: string;
  scheduledAt?: string; // new primary field
  scheduledDate?: string; // legacy alias
  duration: number;
  platform?: string;
  meetingLink?: string;
  status: string; // 'open' | 'pending_approval' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
  approvedHelper?: {
    id: string;
    name: string;
    avatar?: string;
    trustScore?: number;
  };
  partner?: { id: string; name: string }; // legacy alias
  appCount?: number; // new primary field
  applicationsCount?: number; // legacy alias
  firstApplicant?: { id: string; name: string }; // first/only pending applicant
  sessionNumber?: number;
  earnedPoints?: number;
  approvalDeadline?: string;
}

export interface GoalDetail extends Goal {
  sessions: GoalSession[];
  owner: ApiUser;
  applicationCount?: number;
  openSlotCount?: number;
  approvalDeadlineOffset?: string;
}

export interface Session {
  id: string;
  goalId: string;
  topic: string;
  category: string;
  scheduledAt?: string; // new primary field
  scheduledDate?: string; // legacy alias
  duration: number;
  meetingLink?: string;
  status: string;
  notes?: string;
  owner?: ApiUser; // legacy alias
  goalOwner?: ApiUser; // new field name
  partner?: ApiUser; // legacy alias
  approvedHelper?: ApiUser; // new field name
  isOwner?: boolean;
  role?: string;
  rating?: number;
  feedback?: string;
  sessionNumber?: number;
  repsDone?: number;
  repsTotal?: number;
  repsLeft?: number;
  stakedPoints?: number;
  goal?: {
    id: string;
    title: string;
    category: string;
    description?: string;
    difficulty?: string;
    pledgedPoints?: number;
  };
}

export interface Application {
  id: string;
  goalId: string;
  sessionId?: string;
  status: string; // 'pending' | 'approved' | 'rejected'
  message: string;
  stakedPoints: number;
  createdAt: string;
  updatedAt: string;
  applicant?: ApiUser;
  // Flat session fields from GET /api/goals/:goalId/applications
  sessionTopic?: string;
  sessionCategory?: string;
  sessionScheduledAt?: string;
  sessionStatus?: string;
  session?: {
    id: string;
    topic?: string;
    sessionNumber?: number;
    scheduledDate?: string;
    scheduledAt?: string;
    approvalDeadline?: string;
    applicationsCount?: number;
    appCount?: number;
  };
}

export interface ApplicationWithDetails extends Application {
  goal?: {
    id: string;
    title: string;
    topic?: string;
    scheduledDate?: string;
    scheduledAt?: string;
    duration?: number;
    owner?: ApiUser;
    user?: ApiUser; // new field name for goal owner
    category?: string;
    status?: string;
  };
  session?: {
    id: string;
    scheduledDate?: string;
    scheduledAt?: string;
    topic?: string;
    category?: string;
    sessionNumber?: number;
    duration?: number;
    status?: string;
  };
}

export interface Partner {
  // New API shape: { user, sessionsCount, lastSessionAt, averageRating }
  user?: ApiUser;
  sessionsCount: number;
  lastSessionAt?: string;
  averageRating?: number;
  // Legacy flat fields for backward compat
  id?: string;
  name?: string;
  avatar?: string;
  trustScore?: number;
  topics?: string[];
}

export interface ScoreBreakdown {
  sessionsPoints: number;
  feedbackPoints: number;
  streakPoints: number;
  missedPenalty: number;
  missedCount: number;
}

export interface UserStats {
  trustScore: number;
  sessionsCompleted: number;
  showUpRate?: number; // 0–1 float from some endpoints
  showRate?: number; // 0–100 integer from new API
  avgRating?: number;
  averageRating?: number;
  currentStreak: number;
  totalHelped?: number;
  repsDone?: number;
  repsTotal?: number;
  sessionsThisWeek?: number;
  goalsPosted?: number;
  goalsHelped?: number;
  longestStreak?: number;
  totalHoursSpent?: number;
  scoreBreakdown?: ScoreBreakdown;
}

export interface LiveSession {
  id: string;
  topic: string;
  category: string;
  scheduledAt: string;
  endsAt: string;
  duration: number;
  status: string;
  meetingLink?: string; // only exposed when isLive=true
  goal: {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    pledgedPoints: number;
  };
  goalOwner: { id: string; name: string; avatar?: string; trustScore: number };
  approvedHelper: {
    id: string;
    name: string;
    avatar?: string;
    trustScore: number;
  };
}

export interface TrustHistoryEntry {
  id: string;
  change: number;
  reason: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// ── Request helper ─────────────────────────────────────────────────────────

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ??
        `Request failed (${res.status})`,
    );
  }
  return res.json().then(normalizeIds) as Promise<T>;
}

function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  const str = q.toString();
  return str ? `?${str}` : "";
}

// Normalize MongoDB _id → id recursively so the rest of the code can use .id everywhere
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeIds(obj: any): any {
  if (Array.isArray(obj)) return obj.map(normalizeIds);
  if (obj !== null && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = normalizeIds(v);
    }
    if (out["_id"] !== undefined && out["id"] === undefined) {
      out["id"] = out["_id"];
    }
    return out;
  }
  return obj;
}

// ── API ────────────────────────────────────────────────────────────────────

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string }) =>
      request<{ token: string; user: ApiUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: ApiUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    me: () => request<{ user: ApiUser }>("/api/auth/me"),
    logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  },

  users: {
    getProfile: (userId: string) =>
      request<{ user: ApiUser }>(`/api/users/${userId}`),
    updateProfile: (data: { name?: string; bio?: string; avatar?: string }) =>
      request<{ user: ApiUser }>("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    getMyStats: () =>
      request<{
        stats: UserStats;
        scoreBreakdown?: ScoreBreakdown;
        weeklyActivity?: Array<{
          date: string;
          sessions: number;
          points: number;
        }>;
        categoryBreakdown?: Array<{
          category: string;
          sessionsCount: number;
          points: number;
          percentage: number;
        }>;
      }>("/api/users/me/stats"),
    getTrustScoreHistory: (params?: { limit?: number; offset?: number }) =>
      request<{ history: TrustHistoryEntry[] }>(
        `/api/users/me/trust-score-history${buildQuery({
          limit: params?.limit,
          offset: params?.offset,
        })}`,
      ),
  },

  goals: {
    create: (data: {
      title: string;
      description: string;
      category: string;
      difficulty: string;
      pledgedPoints: number;
      defaultDurationMins?: number;
      defaultPlatform?: string;
      approvalDeadlineOffset?: string;
      // legacy fields
      topic?: string;
      scheduledDate?: string;
      duration?: number;
      meetingLink?: string;
    }) =>
      request<{ goal: Goal }>("/api/goals", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    browse: (params?: {
      status?: string;
      category?: string;
      difficulty?: string;
      search?: string;
      sortBy?: string;
      limit?: number;
      offset?: number;
    }) =>
      request<{ goals: Goal[] }>(
        `/api/goals${buildQuery({
          status: params?.status,
          category: params?.category,
          difficulty: params?.difficulty,
          search: params?.search,
          sortBy: params?.sortBy,
          limit: params?.limit,
          offset: params?.offset,
        })}`,
      ),
    get: (goalId: string) =>
      request<{ goal: GoalDetail }>(`/api/goals/${goalId}`),
    update: (
      goalId: string,
      data: {
        title?: string;
        description?: string;
        meetingLink?: string;
        applicationsOpen?: boolean;
        defaultDurationMins?: number;
        defaultPlatform?: string;
        approvalDeadlineOffset?: string;
      },
    ) =>
      request<{ goal: Goal }>(`/api/goals/${goalId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    myGoals: (params?: { status?: string; limit?: number; offset?: number }) =>
      request<{ goals: Goal[] }>(
        `/api/goals/my${buildQuery({
          status: params?.status ?? "all",
          limit: params?.limit,
          offset: params?.offset,
        })}`,
      ),
    addSession: (
      goalId: string,
      data: {
        topic: string;
        category: string;
        scheduledDate: string;
        durationMins?: number;
        duration?: number; // legacy alias
        platform?: string;
        meetingLink?: string;
        approvalDeadlineOffset?: string;
      },
    ) =>
      request<{ session: GoalSession }>(`/api/goals/${goalId}/sessions`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    delete: (goalId: string) =>
      request<void>(`/api/goals/${goalId}`, { method: "DELETE" }),
  },

  applications: {
    apply: (
      sessionId: string,
      data: { message?: string; stakedPoints: number },
    ) =>
      request<{ application: Application }>(
        `/api/sessions/${sessionId}/applications`,
        { method: "POST", body: JSON.stringify(data) },
      ),
    getForGoal: (goalId: string) =>
      request<{ applications: Application[] }>(
        `/api/goals/${goalId}/applications`,
      ),
    approve: (applicationId: string) =>
      request<{ session: Session }>(
        `/api/applications/${applicationId}/approve`,
        { method: "POST" },
      ),
    reject: (applicationId: string) =>
      request<void>(`/api/applications/${applicationId}/reject`, {
        method: "POST",
      }),
    withdraw: (applicationId: string) =>
      request<void>(`/api/applications/${applicationId}`, {
        method: "DELETE",
      }),
    myApplications: (params?: { status?: string }) =>
      request<{
        applications: ApplicationWithDetails[];
        pending: ApplicationWithDetails[];
        upcoming: ApplicationWithDetails[];
        past: ApplicationWithDetails[];
        total: number;
      }>(
        `/api/applications/my${buildQuery({
          status: params?.status ?? "all",
        })}`,
      ),
  },

  sessions: {
    getMySessions: (params?: {
      type?: string;
      role?: string;
      status?: string;
      limit?: number;
      offset?: number;
    }) =>
      request<{ sessions: Session[] }>(
        `/api/sessions${buildQuery({
          type: params?.type,
          role: params?.role,
          status: params?.status,
          limit: params?.limit,
          offset: params?.offset,
        })}`,
      ),
    getUpcoming: (params?: { limit?: number; offset?: number }) =>
      request<{ sessions: Session[] }>(
        `/api/sessions/upcoming${buildQuery({
          limit: params?.limit,
          offset: params?.offset,
        })}`,
      ),
    open: (params?: {
      category?: string;
      from?: string;
      limit?: number;
      offset?: number;
    }) =>
      request<{ sessions: Session[]; total: number; hasMore: boolean }>(
        `/api/sessions/open${buildQuery({
          category: params?.category,
          from: params?.from,
          limit: params?.limit,
          offset: params?.offset,
        })}`,
      ),
    get: (sessionId: string) =>
      request<{ session: Session }>(`/api/sessions/${sessionId}`),
    getLive: (sessionId: string) =>
      request<{ isLive: boolean; session: LiveSession }>(
        `/api/sessions/${sessionId}/live`,
      ),
    update: (
      sessionId: string,
      data: { notes?: string; meetingLink?: string },
    ) =>
      request<{ session: Session }>(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    start: (sessionId: string) =>
      request<{ session: Session }>(`/api/sessions/${sessionId}/start`, {
        method: "POST",
      }),
    complete: (
      sessionId: string,
      data: { rating: number; feedback: string; partnerShowedUp: boolean },
    ) =>
      request<{ session: Session }>(`/api/sessions/${sessionId}/complete`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    cancel: (sessionId: string, data: { reason: string }) =>
      request<void>(`/api/sessions/${sessionId}/cancel`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  partners: {
    getMyPartners: (params?: { limit?: number; offset?: number }) =>
      request<{ partners: Partner[] }>(
        `/api/partners${buildQuery({
          limit: params?.limit,
          offset: params?.offset,
        })}`,
      ),
  },

  categories: {
    getAll: () => request<{ categories: Category[] }>("/api/categories"),
  },
};
