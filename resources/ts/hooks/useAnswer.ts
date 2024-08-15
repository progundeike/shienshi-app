import { useToast } from "@chakra-ui/react";
import { useRecoilState } from "recoil";

import {
    ErrorResponse,
} from "../types/form";
import { axiosInstance } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";
import { AiResponse, AnswerInputs } from "../components/organisms/QuestionAndAnswerForm";

export const useAnswer = () => {
    const [isLoading, setIsLoading] = useRecoilState(loadingAtom);
    const toast = useToast();

    const submitAnswer = async (
        answerInputs: AnswerInputs,
        year: number,
        season: string,
        section: number,
    ): Promise<AiResponse[] | null> => {
        setIsLoading(true);

        console.log(answerInputs);

        try {
            const response = await axiosInstance
            .post<ErrorResponse | AiResponse[] | null>("/api/answer", {
                answerInputs,
                year,
                season,
                section,
            })

            // 成功
            if (response.data && Array.isArray(response.data) && response.data[0].questionNumber) {
                return response.data as AiResponse[];
            }

            return null;
        } catch (error) {
            console.log(error);

            // 認証エラー
            // if (error.response.status === 401) {
            //     toast({
            //         title: "認証エラー",
            //         description:
            //             "答案の提出にはログインが必要です。",
            //         status: "error",
            //         duration: 10000,
            //         isClosable: true,
            //         position: "bottom-right",
            //     });

            //     return null
            // }

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
        } finally {
                setIsLoading(false);
        }
    };


    return { submitAnswer };
};
