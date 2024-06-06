import { useToast } from "@chakra-ui/react";
import { useRecoilState } from "recoil";

import {
    ErrorResponse,
} from "../types/form";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";

export type FetchedQuestion = {
    examYear: number;
    examSeason: string;
    examId: number;
    questionId: number;
    subQuestionId: number;
    type: string;
    text: string;
    options: Option[] | null; // JSON文字列
    maxLength: number | null
};

export type Option = {
    label: string;
    value: string;
}

export const useExam = () => {
    const [isLoading, setIsLoading] = useRecoilState(loadingAtom);
    const toast = useToast();

    const fetchQuestions = async (
        examYear: number,
        examSeason: string,
        examId: number
    ): Promise<FetchedQuestion[] | null> => {
        setIsLoading(true);
        return await axiosInstance
            .get(`/api/questions/${examYear}-${examSeason}-${examId}`)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                // その他のエラー
                toast({
                    title: "サーバーエラー",
                    description:
                        "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                    position: "bottom-right",
                });
                return null;
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return { fetchQuestions };
};
