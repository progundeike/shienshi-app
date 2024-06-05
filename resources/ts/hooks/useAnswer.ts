import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRecoilState } from "recoil";

import {
    ErrorResponse,
} from "../types/form";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";
import { AnswerInputs } from "../components/organisms/QuestionAndAnswerForm";

export const useAnswer = () => {
    const [isLoading, setIsLoading] = useRecoilState(loadingAtom);
    const toast = useToast();

    const submitAnswer = async (
        answerInputs: AnswerInputs,
        year: number,
        season: string,
    ): Promise<ErrorResponse | null> => {
        setIsLoading(true);
        console.log(answerInputs);

        return await axiosInstance
            .post<AnswerInputs>("/api/answer", {
                answerInputs,
                year,
                season
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
                // バリデーションエラー
                if (error.response.status === 422) {
                    return error.response.data;
                }

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


    return { submitAnswer
    };
};
