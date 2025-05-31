import axios from "axios";
import { atom, useAtom } from "jotai";

import { User } from "../types/user";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";
import { userAtom } from "../states/userAtom";
import { useChakraToast } from "../utils/toastUtils";

export type ExamSentenceResponse = {
    sentence: string;
    purpose: string;
    reviewComment: string;
}

export const useAdmin = () => {
    const [isLoading, setIsLoading] = useAtom(loadingAtom);
    const { unexpectedServerErrorToast, toast } = useChakraToast();

    // examSentenceを取得
    const getExamSentence = async (
        year: number,
        season: string,
        section: number
    ): Promise<ExamSentenceResponse | null> => {
        try {
            const response = await axiosInstance.get<ExamSentenceResponse>(
                `/api/admin/sentence/${year}-${season}-${section}`
            );

            return response.data;
        } catch (error) {
            console.error("examSentenceの取得に失敗しました", error);
            if (axios.isAxiosError(error) && error.response) {
                // サーバーからのエラーメッセージを表示
                toast({
                    title: "examSentenceの取得エラー",
                    description: error.response.data,
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                    position: "bottom-right",
                });
                return null;
            } else {
                toast(unexpectedServerErrorToast);
                console.error(error);
                return null;
            }
        }
    };

    return { getExamSentence };
}