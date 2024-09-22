import { useToast } from "@chakra-ui/react";
import { useAtom } from "jotai";

import {
    ErrorResponse,
} from "../types/form";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";
import { AnswerInputs } from "../components/organisms/QuestionAndAnswerForm";
import { set } from "react-hook-form";

export const useQuestion = () => {
    const [isLoading, setIsLoading] = useAtom(loadingAtom);
    const toast = useToast();

    const submitQuestion = async (
        year: number,
        season: string,
        section: number,
        questionNumber: number,
        subQuestionNumber: number,
        message: string,
    ): Promise<string> => {
        setIsLoading(true);

        try {
            const response = await axiosInstance
            .post<ErrorResponse | string | null>("/api/question", {
                year: year,
                season: season,
                section: section,
                questionNumber: questionNumber,
                subQuestionNumber: subQuestionNumber,
                message: message,
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

            toast({
                title: "サーバーエラー",
                description:
                    "サーバーに不具合が発生しています。しばらく経ってから再度お試しください",
                status: "error",
                duration: 6000,
                isClosable: true,
                position: "bottom-right",
            });
            return '';
        } finally {
                setIsLoading(false);
        }
    };


    return { submitQuestion };
};
