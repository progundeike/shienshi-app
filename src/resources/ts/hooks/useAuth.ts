import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";

import { ErrorResponse, RegisterFormInput } from "../types/form";
import { User } from "../types/user";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";
import { userAtom } from "../states/userAtom";
import { useChakraToast } from "../utils/toastUtils";

export const useAuth = () => {
    const [, setIsLoading] = useAtom(loadingAtom);
    const [, setUser] = useAtom(userAtom);
    const { showServerErrorToast, showSuccessToast } = useChakraToast();

    const navigate = useNavigate();

    const login = async (
        username: string,
        password: string,
    ): Promise<ErrorResponse | null> => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post<User>("/api/login", {
                username,
                password,
            });

            setUser(response.data);
            return null;
        } catch (error: unknown) {
            // axiosのエラー
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (status === 401) {
                    return null;
                }

                // バリデーション、認証失敗
                if (status === 422) {
                    return (error.response?.data as ErrorResponse) ?? null;
                }

                // その他HTTPエラー
                showServerErrorToast("ログインエラー");
                return null;
            }

            // Axios以外の予期しないエラー
            showServerErrorToast("ログインエラー");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post<User>("/api/logout");
            setUser(null);
            navigate("/");
        } catch (error: unknown) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                // セッション切れはログアウト済みとみなす
                if (status === 401 || status === 419) {
                    setUser(null);
                    navigate("/");
                    return;
                }

                // その他HTTPエラー
                showServerErrorToast("ログアウトに失敗しました");
            }
        }
    };

    const registerUser = async (
        props: RegisterFormInput,
    ): Promise<ErrorResponse | null> => {
        const { username, password, password_confirmation } = props;
        setIsLoading(true);
        try {
            const response = await axiosInstance.post<User>("/api/register", {
                username: username,
                password: password,
                password_confirmation: password_confirmation,
            });
            setUser(response.data);
            navigate("/my-page");
            return null;
        } catch (error: unknown) {
            // axiosのエラー
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (status === 401) return null;

                // バリデーションエラー
                if (status === 422) {
                    return (error.response?.data as ErrorResponse) ?? null;
                }
                // その他HTTPエラー
                showServerErrorToast("ユーザー登録エラー");
                return null;
            }
            // Axios以外の予期しないエラー
            showServerErrorToast("ユーザー登録エラー");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const getUser = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get<User>("/api/user");
            if (response.data.username) {
                setUser(response.data);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (status === 401) {
                    // 未ログイン状態と判定
                    setUser(null);
                    return null;
                }
            } else {
                console.error("ユーザー情報の取得に失敗しました", error);
                setUser(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUser = async () => {
        setIsLoading(true);
        try {
            await axiosInstance.delete("/api/user");
            setUser(null);
            navigate("/");
            showSuccessToast("アカウントを削除しました。");
        } catch (error: unknown) {
            showServerErrorToast("アカウントの削除に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    const updatePassword = async (
        current_password: string,
        new_password: string,
        new_password_confirmation: string,
    ): Promise<ErrorResponse | null> => {
        setIsLoading(true);
        try {
            await axiosInstance.put("/api/user/password", {
                current_password,
                new_password,
                new_password_confirmation,
            });
            showSuccessToast("パスワードを変更しました。");
            navigate("/my-page");
            return null;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                // バリデーションエラー
                if (status === 422) {
                    return (error.response?.data as ErrorResponse) ?? null;
                }
            }

            // その他のエラー
            showServerErrorToast("パスワードの変更に失敗しました");

            return null;
        } finally {
            setIsLoading(false);
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
