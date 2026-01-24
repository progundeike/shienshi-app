import { axiosInstance } from "./axiosInstance";

import { useChakraToast } from "../utils/toastUtils";
import { Dialogue, ErrorResponse } from "../types/form";

export const useQuestion = () => {
    const { unexpectedServerErrorToast, toast } = useChakraToast();

    const sendChat = async (
        examCode: string,
        questionCode: string,
        message: string,
    ): Promise<string> => {

        try {
            const response = await axiosInstance
            .post<ErrorResponse | string | null>("/api/chat", {
                examCode,
                questionCode,
                message,
            })

            console.log(response);

            // 成功
            if (response.status === 200 && typeof response.data === "string") {
                return response.data;
            }
            // 失敗
            return '';
        } catch (error) {
            console.log(error);
            // 予期しないサーバーエラー
            toast(unexpectedServerErrorToast);
            return '';
        }
    };

    const fetchDialogues = async (
        examCode: string,
        questionCode: String
    ) => {
        try {
            const response = await axiosInstance
            .get<Dialogue[]>(`/api/dialogues/${examCode}/${questionCode}`)

            // 成功
            if (response.status === 200) {
                return response.data;
            }

            // 失敗
            return '';
        } catch (error) {
            console.log(error);
            toast(unexpectedServerErrorToast);
            return [];
        }
    }

    const deleteDialogues = async (
        examCode: string,
        questionCode: String
    ) => {
        try {
            const response = await axiosInstance
            .delete<Dialogue[]>(`/api/dialogues/${examCode}/${questionCode}`)

            console.log(response);
        } catch (error) {
            console.log(error);
            toast(unexpectedServerErrorToast);
        }
    }

    return { sendChat, fetchDialogues, deleteDialogues };
};
