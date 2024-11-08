import { useToast } from "@chakra-ui/react";
import { useAtom } from "jotai";

import {
    ErrorResponse,
} from "../types/form";
import { axiosInstance, otherServerErrorToast } from "./axiosInstance";
import { loadingAtom } from "../states/loadingAtom";
import { Correction, AnswerInputs } from "../components/organisms/QuestionAndAnswerForm";

export const useAnswer = () => {
    const [isLoading, setIsLoading] = useAtom(loadingAtom);
    const toast = useToast();

    const submitAnswer = async (
        answerInputs: AnswerInputs,
        year: number,
        season: string,
        section: number,
    ): Promise<Correction[] | null> => {
        setIsLoading(true);

        console.log(answerInputs);

        try {
            const response = await axiosInstance
            .post<ErrorResponse | Correction[] | null>("/api/answer", {
                answerInputs,
                year,
                season,
                section,
            })

            // 成功
            if (response.data && Array.isArray(response.data) && response.data[0].questionNumber) {
                return response.data as Correction[];
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

            otherServerErrorToast(toast);

            return null;
        } finally {
                setIsLoading(false);
        }
    };

    // 提出ずみの答案と添削結果を取得
    const fetchCorrection = async (
        year: number,
        season: string,
        section: number
    ): Promise<Correction[] | null> => {
        setIsLoading(true);

        try {
            const response = await axiosInstance
            .get<ErrorResponse | Correction[]>(`/api/corrections/${year}-${season}-${section}`)

            // 未提出の場合
            if (Array.isArray(response.data) && response.data.length === 0) {
                return null;
            }

            // 成功
            if (Array.isArray(response.data) && response.data[0].questionNumber) {
                return response.data as Correction[];
            }

            return null;
        } catch (error) {
            console.log(error);

            otherServerErrorToast(toast);

            return null;
        } finally {
            setIsLoading(false);
        }
    }

    const deleteSubmittedAnswer = async (
        year: number,
        season: string,
        section: number
    ): Promise<void> => {
        setIsLoading(true);

        try {
            const response = await axiosInstance
            .delete(`/api/answer/${year}-${season}-${section}`)
            // 成功
            if (response.status === 200) {
                console.log("reset success");
            }
        } catch (error) {
            console.log(error);
            otherServerErrorToast(toast);

        } finally {
            setIsLoading(false);
        }
    }

    return { submitAnswer, fetchCorrection, deleteSubmittedAnswer };
};
