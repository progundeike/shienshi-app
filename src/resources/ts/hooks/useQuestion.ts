import { axiosInstance } from "./axiosInstance";

import { Dialogue, ErrorResponse } from "../types/form";
import { useChakraToast } from "../utils/toastUtils";

export const useQuestion = () => {
    const { showServerErrorToast } = useChakraToast();

    const sendChat = async (
        examCode: string,
        questionCode: string,
        message: string,
    ): Promise<string> => {
        try {
            const response = await axiosInstance.post<
                ErrorResponse | string | null
            >("/api/chat", {
                examCode,
                questionCode,
                message,
            });

            console.log(response);

            // 成功
            if (response.status === 200 && typeof response.data === "string") {
                return response.data;
            }
            // 失敗
            return "";
        } catch (error) {
            console.log(error);
            // 予期しないサーバーエラー
            showServerErrorToast("質問の送信に失敗しました");
            return "";
        }
    };

    const fetchDialogues = async (examCode: string, questionCode: String) => {
        try {
            const response = await axiosInstance.get<Dialogue[]>(
                `/api/dialogues/${examCode}/${questionCode}`,
            );

            // 成功
            if (response.status === 200) {
                return response.data;
            }

            // 失敗
            return "";
        } catch (error) {
            console.log(error);
            showServerErrorToast("質問履歴の取得に失敗しました");
            return [];
        }
    };

    const deleteDialogues = async (examCode: string, questionCode: String) => {
        try {
            const response = await axiosInstance.delete<Dialogue[]>(
                `/api/dialogues/${examCode}/${questionCode}`,
            );
        } catch (error) {
            console.log(error);
            showServerErrorToast("質問履歴の削除に失敗しました");
        }
    };

    const checkChatProcessingStatus = async (
        examCode: string,
        questionCode: string,
    ): Promise<"processing" | "idle"> => {
        try {
            const response = await axiosInstance.get<{
                status: "processing" | "idle";
            }>(`/api/chat-processing-status/${examCode}/${questionCode}`);
            return response.data.status;
        } catch (error) {
            showServerErrorToast("処理状況の確認に失敗しました");
            console.error(error);
            return "idle";
        }
    };

    return {
        sendChat,
        fetchDialogues,
        deleteDialogues,
        checkChatProcessingStatus,
    };
};
