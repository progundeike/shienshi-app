import axios from "axios";

declare module "axios" {
    interface AxiosRequestConfig {
        _retry?: boolean; // トークンリフレッシュの再試行フラグ
        _authNotified?: boolean; // 認証切れイベント発火のフラグ
        meta?: {
            silent401?: boolean; // trueの場合、401イベントを発火しない
        };
    }
}

async function refreshToken() {
    try {
        await axios.get("/sanctum/csrf-cookie");
        return;
    } catch (error) {
        console.log("Failed to refresh CSRF token:", error);
        throw error;
    }
}

export const axiosInstance = axios.create({
    headers: {
        Accept: "application/json", // 全てのリクエストにJsonレスポンスを要求
        "X-Requested-With": "XMLHttpRequest", // LaravelがAJAXリクエストと認識するため
    },
    withCredentials: true, // Cookieを送信するために必要
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;
        if (!originalRequest) {
            return Promise.reject(error);
        }

        const status = error.response?.status;

        // 419エラーが発生した場合、トークンを更新してリクエストを再試行する
        if (status === 419 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await refreshToken();
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // トークンのリフレッシュに失敗した場合は、認証切れイベントを発火させる
                if (!originalRequest._authNotified) {
                    originalRequest._authNotified = true;
                    window.dispatchEvent(new CustomEvent("auth:Expired"));
                    return Promise.reject(refreshError);
                }
            }
        }

        // 401エラーが発生したら、カスタムイベントを投げる
        if (status === 401) {
            const silent401 = originalRequest.meta?.silent401 === true;
            if (!silent401 && !originalRequest._authNotified) {
                originalRequest._authNotified = true;
                window.dispatchEvent(new CustomEvent("auth:Unauthenticated"));
            }
        }

        return Promise.reject(error);
    },
);
