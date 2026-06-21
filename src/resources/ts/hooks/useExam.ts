import { useAtom } from "jotai";
import axios from "axios";

import { axiosInstance } from "./axiosInstance";
import { useChakraToast } from "../utils/toastUtils";
import { loadingAtom } from "../states/loadingAtom";
import {
    FetchedQuestion,
    PurposeAndReviewComment,
    SubmittedExam,
} from "../types/exam";

export const useExam = () => {
    const [, setIsLoading] = useAtom(loadingAtom);
    const { showServerErrorToast } = useChakraToast();

    const fetchQuestions = async (
        year: number,
        season: string,
        section: number,
    ): Promise<FetchedQuestion[] | null> => {
        const examCode = `${year}_${season}_${section}`;
        return await axiosInstance
            .get(`/api/questions/${examCode}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                // axiosのエラー
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) return null;
                    if (error.response?.status === 404) {
                        showServerErrorToast("設問が見つかりません");
                        return null;
                    }
                }

                showServerErrorToast("設問の取得に失敗しました");
                return null;
            });
    };

    // 提出済みの試験一覧を取得
    const fetchSubmittedExams = async (): Promise<SubmittedExam[] | null> => {
        return await axiosInstance
            .get("/api/user/submittedExams")
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                if (axios.isAxiosError(error) && error.response?.status === 401)
                    return null;
                showServerErrorToast("提出済み試験の取得に失敗しました");
                console.error(error);
                return null;
            });
    };

    const checkPdfExists = async (
        year: number,
        season: string,
        section: number,
    ) => {
        try {
            await axiosInstance.get(`/api/exam/${year}-${season}-${section}`);
            return true;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (status === 404 || status === 422) {
                    return false;
                }
            }

            showServerErrorToast(
                "PDFの取得に失敗しました。時間を置いて再度お試しください",
            );
            throw error;
        }
    };

    const fetchPurposeAndReviewComment = async (
        year: number,
        season: string,
        section: number,
    ): Promise<PurposeAndReviewComment> => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(
                `/api/exam/${year}_${season}_${section}/review`,
            );

            return response.data;
        } catch (error: unknown) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        fetchQuestions,
        fetchSubmittedExams,
        checkPdfExists,
        fetchPurposeAndReviewComment,
    };
};
