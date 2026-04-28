import React, { useMemo } from "react";
import {
    Box,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Card } from "../templates/Card";
import { useChakraToast } from "../../utils/toastUtils";
import { SubmitButton } from "../atoms/SubmitButton";
import { InquiryInput } from "../../types/form";
import { axiosInstance } from "../../hooks/axiosInstance";

export const ContactPage = () => {
    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<InquiryInput>();

    const { unexpectedServerErrorToast, toast } = useChakraToast();
    const qc = useQueryClient();
    const openedAt = useMemo(() => Math.floor(Date.now() / 1000), []); // ページが開かれた日時

    const sendInquiry = useMutation({
        mutationFn: async (data: InquiryInput) => {
            const res = await axiosInstance.post("/api/inquiry", {
                opened_at: openedAt,
                ...data,
            });

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
            <Card maxW="80%">
                <Box textAlign="center">
                    <Box my="20px">
                        <Heading mb="20px">お問い合わせ</Heading>
                        <Text textAlign="left">
                            お問い合わせは下記フォームよりお願い致します。
                        </Text>
                    </Box>

                    <form onSubmit={onSubmit}>
                        <Flex gap="4" direction="column">
                            <FormControl isInvalid={!!errors.name} isRequired>
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

                            <FormControl
                                isInvalid={!!errors.message}
                                isRequired
                            >
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
                            <Box display="none" aria-hidden="true">
                                <FormControl>
                                    <FormLabel>company</FormLabel>
                                    <Input
                                        id="company"
                                        type="text"
                                        autoComplete="off"
                                        tabIndex={-1}
                                        {...register("company")}
                                    />
                                </FormControl>
                            </Box>
                            <SubmitButton>送信</SubmitButton>
                        </Flex>
                    </form>
                </Box>
            </Card>
        </Box>
    );
};
