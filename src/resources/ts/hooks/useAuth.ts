import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";

import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";
import { userAtom } from "../states/userAtom";
import { useChakraToast } from "../utils/toastUtils";
import type { RegisterFormInput } from "../types/form";
import type { User } from "../types/user";

export const useAuth = () => {
    const [, setIsLoading] = useAtom(loadingAtom);
    const [, setUser] = useAtom(userAtom);
    const { showServerErrorToast, showSuccessToast } = useChakraToast();

    const navigate = useNavigate();

    // グローバルのisLoadingを使うと、バリデーションエラーが表示できない
    const login = async (username: string, password: string): Promise<void> => {
        try {
            const response = await axiosInstance.post<User>(
                "/api/login",
                {
                    username,
                    password,
                },
                {
                    meta: { silent401: true }, // 401エラーでイベントを発火させない
                },
            );

            setUser(response.data);
        } catch (error: unknown) {
            // axiosのエラー
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (status === 401 || status === 422) {
                    throw error;
                }
            }

            showServerErrorToast(
                "ログインに失敗しました。しばらく時間をおいてお試しください。",
            );
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await axiosInstance.post<User>(
                "/api/logout",
                {},
                {
                    meta: { silent401: true }, // 401エラーでイベントを発火させない
                },
            );
            setUser(null);
            navigate("/", { replace: true });
        } catch (error: unknown) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                // セッション切れはログアウト済みとみなす
                if (status === 401 || status === 419) {
                    setUser(null);
                    navigate("/", { replace: true });
                    return;
                }
            }

            //  予期しないエラー
            showServerErrorToast("ログアウトに失敗しました");
            throw error;
        }
    };

    // グローバルのisLoadingを使うと、バリデーションエラーが表示できない
    const registerUser = async (props: RegisterFormInput): Promise<void> => {
        const { username, password, password_confirmation } = props;
        try {
            const response = await axiosInstance.post<User>("/api/register", {
                username: username,
                password: password,
                password_confirmation: password_confirmation,
            });
            setUser(response.data);
            navigate("/my-page");
        } catch (error: unknown) {
            // axiosのエラー
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (status === 401 || status === 422) {
                    throw error;
                }
            }

            // 予期しないエラー
            showServerErrorToast(
                "ユーザー登録に失敗しました。しばらく時間をおいてお試しください。",
            );
            throw error;
        }
    };

    const getUser = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get<User>("/api/user", {
                meta: { silent401: true }, // 401エラーでイベントを発火させない
            });
            if (response.data.username) {
                setUser(response.data);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                // 未ログイン状態と判定
                setUser(null);
                return null;
            }

            console.error("ユーザー情報の取得に失敗しました", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUser = async (password: string) => {
        try {
            await axiosInstance.delete("/api/user", {
                data: { password },
            });
            setUser(null);
            navigate("/");
            showSuccessToast("アカウントを削除しました。");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                throw error;
            }
            showServerErrorToast(
                "アカウントの削除に失敗しました。しばらく時間を置いてお試しください。",
            );
            throw error;
        }
    };

    const updatePassword = async (
        current_password: string,
        new_password: string,
        new_password_confirmation: string,
    ): Promise<void> => {
        try {
            await axiosInstance.put("/api/user/password", {
                current_password,
                new_password,
                new_password_confirmation,
            });
            showSuccessToast("パスワードを変更しました。");
            navigate("/my-page");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                throw error;
            }
            showServerErrorToast(
                "パスワードの変更に失敗しました。しばらく時間を置いてお試しください。",
            );
            throw error;
        }
    };

    return {
        login,
        logout,
        getUser,
        registerUser,
        updatePassword,
        deleteUser,
    };
};
