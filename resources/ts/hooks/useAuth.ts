import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import { userAtom } from "../states/userAtom";
import {
    ErrorResponse,
    PasswordResetFormInput,
    RegisterFormInput,
} from "../types/form";
import { User } from "../types/user";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useRecoilState(loadingAtom);
    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();
    const toast = useToast();

    const login = async (
        username: string,
        password: string,
        emailVerifyQuery: string
    ): Promise<ErrorResponse | null> => {
        return await axiosInstance
            .post<User>("/api/login", {
                username,
                password,
            })
            .then((response) => {
                setUser(response.data);
                navigate(
                    "/my-page" +
                        (emailVerifyQuery ? "?" + emailVerifyQuery : "")
                );
                return null;
            })
            .catch((error) => {
                console.log(error);
                // バリデーションエラー
                if (error.response.status === 422) {
                    return error.response.data;
                }

                // その他のエラー
                toast({
                    title: "ログインエラー",
                    description:
                        "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                    position: "bottom-right",
                });
                return null;
            });
    };

    const logout = async () => {
        await axiosInstance
            .post<User>("/api/logout")
            .then(() => {
                navigate("/");
                setUser(null);
            })
            .catch((error) => console.error(error));
    };

    const registerUser = async (
        props: RegisterFormInput
    ): Promise<ErrorResponse | null> => {
        const { username, password } = props;
        try {
            const response = await axiosInstance.post<User>("/api/register", {
                username: username,
                password: password,
            });
            setUser(response.data);
            toast({
                title: "ユーザー登録が完了しました",
                // description: "",
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "bottom-right",
            });
            navigate("/my-page");
            return null;
        } catch (error: any) {
            console.error(error.data);
            return error.response.data;
        }
    };

    const getUser = async () => {
        setIsLoading(true);
        axios
            .get<User>("/api/user")
            .then((response) => {
                if (response.data.username) {
                    setUser(response.data);
                }
                console.log(response.data)
            })
            .catch((error) => console.log(error))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const deleteUser = async () => {
        try {
            setIsLoading(true);
            await axios.delete("/api/user");
            setUser(null);
            toast({
                title: "ユーザー情報を削除しました。",
                // description: "",
                status: "success",
                duration: 6000,
                isClosable: true,
                position: "bottom-right",
            });
        } catch (error: any) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (data: PasswordResetFormInput) => {
        await axiosInstance
            .post("/api/reset-password", data)
            .then((res: any) => {
                toast({
                    title: res.data.message,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                });
                navigate("/login");
            })
            .catch((error: any) => {
                console.log(error);
                toast({
                    title: "パスワードの更新に失敗しました",
                    description:
                        "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                });
            });
    };

    const forgotPassword = async (data: {
        email: string;
    }): Promise<ErrorResponse | null> => {
        return await axiosInstance
            .post("/api/forgot-password", data)
            .then(() => {
                toast({
                    title: "パスワードリセットメールを送信しました",
                    description: "メールを確認してください",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                });
                navigate("/login");
                return null;
            })
            .catch((error: any) => {
                console.log(error);
                // バリデーションエラー
                if (error.response.status === 422) {
                    return error.response.data;
                }

                // その他のエラー
                toast({
                    title: "プロフィールの更新に失敗しました",
                    description:
                        "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                });
                return null;
            });
    };

    return {
        login,
        logout,
        getUser,
        registerUser,
        resetPassword,
        forgotPassword,
        deleteUser,
    };
};
