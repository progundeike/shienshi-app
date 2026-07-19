import {
    Box,
    Center,
    Heading,
    VStack,
    Text,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
} from "@chakra-ui/react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../../hooks/axiosInstance";
import axios from "axios";
import { Card } from "../../templates/Card";
import { SubmitButton } from "../../atoms/SubmitButton";

type TwoFactorChallengeInput = { code: string };

export const TwoFactorChallengePage = memo(() => {
    const navigate = useNavigate();
    const { getUser } = useAuth();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<TwoFactorChallengeInput>();

    const onSubmit = handleSubmit(async (data) => {
        try {
            await axiosInstance.post("/api/two-factor-challenge", {
                code: data.code,
            });
            await getUser();
            navigate("/admin", { replace: true });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;

                if (status === 422 || status === 401) {
                    setError("code", {
                        type: "server",
                        message: "認証コードが正しくありません",
                    });
                    return;
                }
            }

            setError("code", {
                type: "server",
                message: "認証に失敗しました。時間をおいて再度お試しください。",
            });
        }
    });

    return (
        <Box>
            <Card maxW="480px">
                <form onSubmit={onSubmit}>
                    <VStack spacing={5} align="stretch">
                        <Center>
                            <Heading size={{ base: "md", md: "lg" }}>
                                2要素認証
                            </Heading>
                        </Center>
                        <Text fontSize={{ base: "sm", md: "md" }}>
                            認証アプリに表示されているコードを入力してください
                        </Text>

                        <FormControl isInvalid={Boolean(errors.code)}>
                            <FormLabel htmlFor="code">認証コード</FormLabel>
                        </FormControl>

                        <Input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            {...register("code", {
                                required: "入力が必要です",
                            })}
                        />
                        <FormErrorMessage>
                            {errors.code?.message}
                        </FormErrorMessage>
                        <SubmitButton isLoading={isSubmitting}>
                            認証する
                        </SubmitButton>
                    </VStack>
                </form>
            </Card>
        </Box>
    );
});
