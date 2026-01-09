import React from "react";
import {
    Box,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Textarea,
} from "@chakra-ui/react";
import Split from "react-split";
import { Card } from "../templates/Card";
import { useForm } from "react-hook-form";
import { InquiryInput } from "../../types/form";
import { SubmitButton } from "../atoms/SubmitButton";
import { useAtomValue } from "jotai";
import { userAtom } from "../../states/userAtom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChakraToast } from "../../utils/toastUtils";
import { axiosInstance } from "../../hooks/axiosInstance";
import { AxiosError } from "axios";
import { TbFocusAuto } from "react-icons/tb";

export const AboutPage = () => {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<InquiryInput>();

    const { unexpectedServerErrorToast, toast } = useChakraToast();
    const qc = useQueryClient();

    const sendInquiry = useMutation({
        mutationFn: async (data: InquiryInput) => {
            const res = await axiosInstance.post("/api/inquiry", data);

            return res.data;
        },

        onSuccess: () => {
            toast({
                title: "お問い合わせを送信しました",
                status: "success",
                duration: 6000,
                isClosable: true,
            });

            reset();
        },

        // バリデーションエラー
        onError: (err: AxiosError<any>) => {
            const errors = err.response?.data?.errors;
            if (!errors) {
                toast(unexpectedServerErrorToast);
                return;
            }
            Object.entries(errors).forEach(([field, messages]) => {
                console.log(field, messages);
                setError(field as keyof InquiryInput, {
                    type: "server",
                    message:
                        (messages as string[])[0] ?? "入力内容をご確認ください",
                });
            });
        },
    });

    const onSubmit = handleSubmit(async (data) => {
        await sendInquiry.mutateAsync(data);
    });

    return (
        <Box w="80%" m="20px auto">
            <Heading size="lg">当サイトについて</Heading>
            <Box m="20px">ここに説明</Box>

            <Card maxW="80%">
                <Box m="auto">
                    <Heading>お問い合わせ</Heading>
                </Box>
                <form onSubmit={onSubmit}>
                    <Flex gap="4" direction="column">
                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel>お名前</FormLabel>
                            <Input
                                {...register("name", {
                                    required: "入力が必要です",
                                })}
                            />
                            <FormErrorMessage>
                                {errors.name && errors.name.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel>メールアドレス</FormLabel>
                            <Input {...register("email")} />
                            <FormErrorMessage>
                                {errors.email && errors.email.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.message}>
                            <FormLabel>お問い合わせ内容</FormLabel>
                            <Textarea
                                {...register("message", {
                                    required: "入力が必要です",
                                })}
                            />
                            <FormErrorMessage>
                                {errors.message && errors.message.message}
                            </FormErrorMessage>
                        </FormControl>

                        <SubmitButton>送信</SubmitButton>
                    </Flex>
                </form>
            </Card>
        </Box>
    );
};
