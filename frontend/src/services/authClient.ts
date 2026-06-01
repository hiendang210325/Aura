import axios from "axios";
import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

export interface AuthUser {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

type AuthResponse = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  user?: Partial<AuthUser>;
  accessToken?: string;
  token?: string;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

const ACCESS_TOKEN_KEY = "auraAccessToken";
const USER_KEY = "auraUser";
const ADMIN_INFO_KEY = "adminInfo";
const LEGACY_ADMIN_TOKEN_KEY = "adminToken";
const LEGACY_USER_TOKEN_KEY = "token";

let accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY) || null;
let refreshPromise: Promise<AuthSession> | null = null;
let interceptorsConfigured = false;

const normalizeUser = (data: AuthResponse): AuthUser => {
  const source = data.user || data;
  const id = source.id || source._id || data.id || data._id || "";

  return {
    _id: source._id || id,
    id,
    name: source.name || "",
    email: source.email || "",
    role: source.role || "user",
  };
};

const normalizeSession = (data: AuthResponse): AuthSession => {
  const token = data.accessToken || data.token;

  if (!token) {
    throw new Error("Missing access token in auth response");
  }

  return {
    user: normalizeUser(data),
    accessToken: token,
  };
};

const isApiRequest = (url?: string) => Boolean(url && url.includes("/api/"));

const isAuthEndpoint = (url?: string) =>
  Boolean(
    url &&
      (url.includes("/api/v1/auth/login") ||
        url.includes("/api/v1/auth/admin/login") ||
        url.includes("/api/v1/auth/register") ||
        url.includes("/api/v1/auth/refresh") ||
        url.includes("/api/v1/auth/logout")),
  );

export const getAccessToken = () =>
  accessToken || sessionStorage.getItem(ACCESS_TOKEN_KEY) || null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;

  if (token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const getStoredUser = (): AuthUser | null => {
  const rawUser = localStorage.getItem(USER_KEY) || localStorage.getItem(ADMIN_INFO_KEY);

  if (!rawUser) return null;

  try {
    return normalizeUser(JSON.parse(rawUser));
  } catch (error) {
    return null;
  }
};

export const saveAuthSession = (session: AuthSession) => {
  setAccessToken(session.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));

  if (session.user.role === "admin") {
    localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(session.user));
  } else {
    localStorage.removeItem(ADMIN_INFO_KEY);
  }

  localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
  localStorage.removeItem(LEGACY_USER_TOKEN_KEY);
};

export const clearAuthSession = () => {
  setAccessToken(null);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ADMIN_INFO_KEY);
  localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
  localStorage.removeItem(LEGACY_USER_TOKEN_KEY);
};

const authRequestConfig = {
  withCredentials: true,
  skipAuthRefresh: true,
} as AxiosRequestConfig & { skipAuthRefresh: boolean };

export const login = async (email: string, password: string) => {
  const { data } = await axios.post<AuthResponse>(
    "/api/v1/auth/login",
    { email, password },
    authRequestConfig,
  );
  const session = normalizeSession(data);
  saveAuthSession(session);
  return session;
};

export const register = async (name: string, email: string, password: string) => {
  const { data } = await axios.post<AuthResponse>(
    "/api/v1/auth/register",
    { name, email, password },
    authRequestConfig,
  );
  const session = normalizeSession(data);
  saveAuthSession(session);
  return session;
};

export const loginAdmin = async (email: string, password: string) => {
  const { data } = await axios.post<AuthResponse>(
    "/api/v1/auth/admin/login",
    { email, password },
    authRequestConfig,
  );
  const session = normalizeSession(data);
  saveAuthSession(session);
  return session;
};

export const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<AuthResponse>("/api/v1/auth/refresh", {}, authRequestConfig)
      .then(({ data }) => {
        const session = normalizeSession(data);
        saveAuthSession(session);
        return session;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const getProfile = async () => {
  const { data } = await axios.get<AuthResponse>("/api/v1/auth/profile");
  return normalizeUser(data);
};

export const logoutSession = async () => {
  try {
    await axios.post("/api/v1/auth/logout", {}, authRequestConfig);
  } finally {
    clearAuthSession();
  }
};

export const configureAuthInterceptors = () => {
  if (interceptorsConfigured) return;
  interceptorsConfigured = true;
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use((config) => {
    if (isApiRequest(config.url)) {
      const token = getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (config.headers.Authorization === "Bearer null") {
        delete config.headers.Authorization;
      }
    }

    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.skipAuthRefresh ||
        isAuthEndpoint(originalRequest.url)
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const session = await refreshSession();
        originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        clearAuthSession();
        return Promise.reject(refreshError);
      }
    },
  );
};
