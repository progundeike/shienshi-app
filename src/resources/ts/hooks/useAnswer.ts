import { useToast } from "@chakra-ui/react";
import { useAtom } from "jotai";
import axios from "axios";

import { Answer, ErrorResponse } from "../types/form";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";
import { useChakraToast } from "../utils/toastUtils";
import { Correction } from "../components/organisms/QuestionAndAnswerInput";

export const useAnswer = () => {
    const [, setIsLoading] = useAtom(loadingAtom);
    const { showServerErrorToast } = useChakraToast();
    const toast = useToast();

    const submitAnswer = async (
        answers: Answer[],
        year: number,
        season: string,
        section: number,
    ): Promise<void> => {
        setIsLoading(true);

        try {
            const response = await axiosInstance.post<
                ErrorResponse | Correction[] | null
            >("/api/answer", {
                answers,
                year,
                season,
                section,
            });

            return;
        } catch (error) {
            // axiosのエラー処理
            if (axios.isAxiosError(error)) {
                // 429 Too Many Requests（多重送信）エラーのときは特別なトーストを表示
                if (error.response?.status === 429) {
                    toast({
                        title: "他の処理が進行中です",
                        description:
                            "AIが現在あなたの答案を添削しています。少し待ってから再度提出してください。",
                        status: "warning",
                        duration: 6000,
                        isClosable: true,
                        position: "bottom-right",
                    });
                }

                return;
            }

            showServerErrorToast("答案提出に失敗しました");

            console.error(error);
            return;
        } finally {
            setIsLoading(false);
        }
    };

    // 提出ずみの答案と添削結果を取得
    const fetchCorrection = async (
        year: number,
        season: string,
        section: number,
    ): Promise<Correction[] | null> => {
        setIsLoading(true);

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
        } finally {
            setIsLoading(false);
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

    const checkAnswerProcessingStatus = async (
        year: number,
        season: string,
        section: number,
    ): Promise<"processing" | "idle" | null> => {
        try {
            const response = await axiosInstance.get<{
                status: "processing" | "idle";
            }>(`/api/answer-processing-status/${year}_${season}_${section}`);
            return response.data.status;
        } catch (error) {
            // 401認証切れのときはRouterのイベントリスナーで捕捉するため、ここではトーストを表示せずnullを返す
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                return null;
            }

            showServerErrorToast("処理状況の取得に失敗しました");
            console.error(error);
            return "idle";
        }
    };

    return {
        submitAnswer,
        fetchCorrection,
        deleteSubmittedAnswer,
        checkAnswerProcessingStatus,
    };
};
