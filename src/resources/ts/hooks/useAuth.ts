import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";

import { ErrorResponse, RegisterFormInput } from "../types/form";
import { User } from "../types/user";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";
import { userAtom } from "../states/userAtom";

const showServerErrorToast = (
    toast: ReturnType<typeof useToast>,
    title: string,
) => {
    toast({
        title: title,
        description:
            "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
        status: "error",
        duration: 6000,
        isClosable: true,
        position: "bottom-right",
    });
};

export const useAuth = () => {
    const [, setIsLoading] = useAtom(loadingAtom);

    const [, setUser] = useAtom(userAtom);

    const navigate = useNavigate();
    const toast = useToast();

    const login = async (
        username: string,
        password: string,
    ): Promise<ErrorResponse | null> => {
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

                // バリデーション、認証失敗
                if (status === 422) {
                    return (error.response?.data as ErrorResponse) ?? null;
                }

                // その他HTTPエラー
                showServerErrorToast(toast, "ログインエラー");
                return null;
            }

            // Axios以外の予期しないエラー
            showServerErrorToast(toast, "ログインエラー");
            return null;
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
                showServerErrorToast(toast, "ログアウトに失敗しました");
            }
        }
    };

    const registerUser = async (
        props: RegisterFormInput,
    ): Promise<ErrorResponse | null> => {
        const { username, password } = props;
        try {
            const response = await axiosInstance.post<User>("/api/register", {
                username: username,
                password: password,
            });
            setUser(response.data);
            navigate("/my-page");
            return null;
        } catch (error: unknown) {
            // axiosのエラー
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                // バリデーションエラー
                if (status === 422) {
                    return (error.response?.data as ErrorResponse) ?? null;
                }
                // その他HTTPエラー
                showServerErrorToast(toast, "ユーザー登録エラー");
                return null;
            }
            // Axios以外の予期しないエラー
            showServerErrorToast(toast, "ユーザー登録エラー");
            return null;
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
        try {
            setIsLoading(true);
            await axiosInstance.delete("/api/user");
            setUser(null);
            navigate("/");
            toast({
                title: "アカウントを削除しました。",
                status: "success",
                duration: 6000,
                isClosable: true,
                position: "bottom-right",
            });
        } catch (error: unknown) {
            toast({
                title: "アカウントの削除に失敗しました",
                description:
                    "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "bottom-right",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const updatePassword = async (
        current_password: string,
        new_password: string,
        new_password_confirmation: string,
    ): Promise<ErrorResponse | null> => {
        try {
            await axiosInstance.put("/api/user/password", {
                current_password,
                new_password,
                new_password_confirmation,
            });
            toast({
                title: "パスワードを変更しました",
                status: "success",
                duration: 9000,
                isClosable: true,
                position: "bottom-right",
            });
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
            toast({
                title: "パスワードの変更に失敗しました",
                description:
                    "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "bottom-right",
            });
            return null;
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
