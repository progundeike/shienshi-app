import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useCallback } from "react";

import { axiosInstance } from "./axiosInstance";
import { useChakraToast } from "../utils/toastUtils";
import { Correction } from "../components/organisms/QuestionAndAnswerInput";
import type { Answer, ErrorResponse } from "../types/form";

export const useAnswer = () => {
    const { showServerErrorToast } = useChakraToast();
    const toast = useToast();

    const submitAnswer = async (
        answers: Answer[],
        year: number,
        season: string,
        section: number,
    ): Promise<void> => {
        try {
            await axiosInstance.post<ErrorResponse | Correction[] | null>(
                "/api/answer",
                {
                    answers,
                    year,
                    season,
                    section,
                },
            );

            return;
        } catch (error) {
            // axiosのエラー処理
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                // 401認証切れ
                if (status === 401) {
                    return;
                }

                // 429 Too Many Requests（多重送信）エラーのときは特別なトーストを表示
                if (status === 429) {
                    toast({
                        title: "他の処理が進行中です",
                        description:
                            "AIが現在あなたの答案を添削しています。少し待ってから再度提出してください。",
                        status: "warning",
                        duration: 6000,
                        isClosable: true,
                        position: "bottom-right",
                    });
                } else {
                    showServerErrorToast("答案提出に失敗しました");
                }

                throw error;
            }

            showServerErrorToast("答案提出に失敗しました");

            throw error;
        }
    };

    // 提出ずみの答案と添削結果を取得
    const fetchCorrection = async (
        year: number,
        season: string,
        section: number,
    ): Promise<Correction[] | null> => {
        try {
            const response = await axiosInstance.get<
                ErrorResponse | Correction[]
            >(`/api/corrections/${year}_${season}_${section}`);

            // 未提出の場合
            if (Array.isArray(response.data) && response.data.length === 0) {
                return null;
            }

            // 成功
            if (
                Array.isArray(response.data) &&
                response.data[0].questionNumber
            ) {
                return response.data as Correction[];
            }

            return null;
        } catch (error) {
            // 401認証切れのときはRouterのイベントリスナーで捕捉するため、ここではトーストを表示せずnullを返す
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                return null;
            }

            showServerErrorToast("添削結果の取得に失敗しました");
            console.error(error);
            return null;
        }
    };

    const deleteSubmittedAnswer = async (
        year: number,
        season: string,
        section: number,
    ): Promise<void> => {
        try {
            await axiosInstance.delete(
                `/api/answer/${year}-${season}-${section}`,
            );
        } catch (error) {
            // 401認証切れのときはRouterのイベントリスナーで捕捉するため、ここではトーストを表示せずnullを返す
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                return;
            }

            showServerErrorToast("答案の削除に失敗しました");
            console.error(error);
        }
    };

    const checkAnswerProcessingStatus = useCallback(
        async (
            year: number,
            season: string,
            section: number,
        ): Promise<"processing" | "idle" | null> => {
            try {
                const response = await axiosInstance.get<{
                    status: "processing" | "idle";
                }>(
                    `/api/answer-processing-status/${year}_${season}_${section}`,
                );
                return response.data.status;
            } catch (error) {
                // 401認証切れのときはRouterのイベントリスナーで捕捉するため、ここではトーストを表示せずnullを返す
                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 401
                ) {
                    return null;
                }
                console.error(error);
                return "idle";
            }
        },
        [],
    );

    return {
        submitAnswer,
        fetchCorrection,
        deleteSubmittedAnswer,
        checkAnswerProcessingStatus,
    };
};
