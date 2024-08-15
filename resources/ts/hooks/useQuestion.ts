import { useToast } from "@chakra-ui/react";
import { useRecoilState } from "recoil";

import {
    ErrorResponse,
} from "../types/form";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";
import { AnswerInputs } from "../components/organisms/QuestionAndAnswerForm";
import { set } from "react-hook-form";

type AIResponse = {
    questionNumber: number;
    subQuestionNumber: number;
    rating: string;
    comment: string;
};

export const useQuestion = () => {
    const [isLoading, setIsLoading] = useRecoilState(loadingAtom);
    const toast = useToast();

    const submitQuestion = async (
        year: number,
        season: string,
        section: number,
        questionNumber: number,
        subQuestionNumber: number,
        question: string,
    ): Promise<AIResponse[] | null> => {
        setIsLoading(true);

        try {
            const response = await axiosInstance
            .post<ErrorResponse | AIResponse[] | null>("/api/question", {
                year: year,
                season: season,
                section: section,
                questionNumber: questionNumber,
                subQuestionNumber: subQuestionNumber,
                question: question,
            })

            console.log(response);

            // 成功

            // 失敗
            return null;
        } catch (error) {
            console.log(error);

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
        } finally {
                setIsLoading(false);
        }
    };


    return { submitQuestion };
};
