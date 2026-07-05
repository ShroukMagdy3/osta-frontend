import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

// ── Request interceptor ───────────────────────────────────────────────────
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// ── Response interceptor ─────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // مش 401 أو ده نفسه كان refresh request → مش نعيد
        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        // في refresh شغال دلوقتي → انضم للـ queue واستنى
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    },
                    reject,
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem("refresh_token");

            const {data} = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                {refreshToken}, // ← بيبعت الـ token في الـ body
                {withCredentials: true}
            );

            const accessToken: string = data.data.access_token;
            const newRefreshToken: string | undefined = data.data.refresh_token;

            localStorage.setItem("access_token", accessToken);
            if (newRefreshToken) {
                localStorage.setItem("refresh_token", newRefreshToken);
            }

            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            processQueue(null, accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
