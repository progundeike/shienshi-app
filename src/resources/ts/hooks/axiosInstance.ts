import axios from "axios";

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
    async (error: any) => {
        const originalRequest = error.config;
        
        // 419エラーが発生した場合、トークンを更新してリクエストを再試行する
        if (error.response.status === 419 && !originalRequest._retry) {
            originalRequest._retry = true;

            await refreshToken();
            return axiosInstance(originalRequest);
        }

        // 401エラーが発生したら、カスタムイベントを投げる
        if (error.response.status === 401) {
            if (!originalRequest._authExpired) {
                originalRequest._authExpired = true;
                window.dispatchEvent(new CustomEvent("auth:Expired"));
            }
        }

        return Promise.reject(error);
    }
);

