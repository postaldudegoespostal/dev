import axios from 'axios';
const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Response interceptor to handle token expiration
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await client.post('/auth/refresh-token');
                return client(originalRequest);
            } catch (err) {
                if (window.location.pathname.startsWith('/admin')) {
                   // window.location.reload();
                   // Don't reload, just fail. Login page will show.
                }
            }
        }
        return Promise.reject(error);
    }
);
export interface SendMailRequest {
  senderEmail: string;
  subject: string;
  message: string;
}
export interface GithubRepoResponse {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: string;
  language: string;
}
export interface StatsResponse {
  isCodingNow: boolean;
  ideName: string;
  projectName: string;
  currentlyEditingFile: string;
  lastActiveTime: string;
  totalSpentOnCurrentProject: string;
  totalSpentOnAllProjects: string;
}
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdDate: string;
}
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
export interface SimulationScenarioResponse {
  id: string;
  title: string;
  description: string;
  systemState: {
    cpuLoad: number;
    latency: number;
    memoryUsage: number;
  };
  options: {
    id: string;
    title: string;
    description: string;
  }[];
}
export interface VerifySimulationRequest {
  scenarioId: string;
  selectedOptionId: string;
}
export interface VerificationResultResponse {
  success: boolean;
  userLevel: string;
  message: string;
  redirectPath: string;
}
export interface PinnedProject {
  id: number;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
}
export interface CreatePinnedProjectRequest {
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
}
export interface CreateTechStackRequest {
  name: string;
  type: string;
}
export interface AuthenticationResponse {
  token: string;
  refreshToken: string;
}
export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}
export interface TechStackResponse {
    id: number;
    name: string;
    type: string;
}
export const api = {
  auth: {
    login: (data: LoginRequest) => client.post<AuthenticationResponse>('/auth/login', data).then(res => res.data),
    check: () => client.get('/auth/check'),
    logout: () => client.post('/auth/logout'),
  },
  contact: {
    sendMessage: (data: SendMailRequest) => client.post('/contact', data),
  },
  projects: {
    getAll: (pageNo = 1, pageSize = 10) => client.get<GithubRepoResponse[]>((`/projects?pageNo=${pageNo}&pageSize=${pageSize}`)).then((res) => res.data),
  },
  pinnedProjects: {
    getAll: () => client.get<PinnedProject[]>('/pinned-projects').then((res) => res.data),
    add: (data: CreatePinnedProjectRequest) => client.post('/pinned-projects/admin/add', data),
    update: (id: number, data: CreatePinnedProjectRequest) => client.put((`/pinned-projects/admin/update/${id}`), data),
    delete: (id: number) => client.delete((`/pinned-projects/admin/delete/${id}`)),
  },
  stats: {
    getCurrent: () => client.get<StatsResponse>('/stats/current').then((res) => res.data),
  },
  blogs: {
    getAll: (pageNo = 1, pageSize = 10) => client.get<PaginatedResponse<BlogPost>>((`/blogs?pageNo=${pageNo}&pageSize=${pageSize}`)).then((res) => res.data),
    add: (data: { title: string; content: string }) => client.post('/blogs', data),
    update: (id: number, data: { title: string; content: string }) => client.put((`/blogs/${id}`), data),
    delete: (id: number) => client.delete((`/blogs/${id}`)),
  },
  simulation: {
    getRandom: () => client.get<SimulationScenarioResponse>('/simulation/random').then(res => res.data),
    verify: (data: VerifySimulationRequest) => client.post<VerificationResultResponse>('/simulation/verify', data).then(res => res.data)
  },
  techStacks: {
    getAll: () => client.get<TechStackResponse[]>('/techstacks').then(res => res.data),
    add: (data: CreateTechStackRequest) => client.post('/techstacks/admin', data),
    update: (id: number, data: CreateTechStackRequest) => client.put(`/techstacks/admin/${id}`, data),
    delete: (id: number) => client.delete(`/techstacks/admin/${id}`),
  }
};
