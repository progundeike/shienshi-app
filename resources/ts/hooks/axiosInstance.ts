import axios from "axios";

async function refreshToken() {
    try {
        const response = await axios.get("api/refresh-token");
        const newToken = response.data.csrfToken;
        return newToken;
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
        console.log(error);
        const originalRequest = error.config;
        
        // 419エラーが発生した場合、トークンを更新してリクエストを再試行する
        if (error.response.status === 419 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newToken = await refreshToken();
            axios.defaults.headers.common["X-CSRF-TOKEN"] = newToken;
            return axiosInstance(originalRequest);
        }
        return Promise.reject(error);
    }
);

// export const otherServerErrorToast = (toast: any) => {
//     toast({
//         title: "サーバーエラー",
//         description:
//             "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
//         status: "error",
//         duration: 6000,
//         isClosable: true,
//         position: "bottom-right",
//     });
// }


