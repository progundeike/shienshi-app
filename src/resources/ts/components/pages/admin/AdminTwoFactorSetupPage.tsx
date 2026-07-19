import { memo, useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../../hooks/axiosInstance";
import axios from "axios";
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
    Button,
} from "@chakra-ui/react";
import { Card } from "../../templates/Card";

type ConfirmTwoFactorInput = {
    code: string;
};

type QrCodeResponse = {
    svg: string;
};

export const AdminTwoFactorSetupPage = memo(() => {
    const navigate = useNavigate();
    const { getUser } = useAuth();

    const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ConfirmTwoFactorInput>();

    useEffect(() => {
        const initializeTwoFactor = async () => {
            try {
                await axiosInstance.post("/api/user/two-factor-authentication");
                const qrResponse = await axiosInstance.get<QrCodeResponse>(
                    "/api/user/two-factor-qr-code",
                );

                setQrCodeSvg(qrResponse.data.svg);
            } finally {
                setIsInitializing(false);
            }
        };
        initializeTwoFactor();
    });

    const onSubmit = handleSubmit(async ({ code }) => {
        try {
            await axiosInstance.post(
                "/api/user/confirmed-two-factor-authentication",
                { code },
            );
            await getUser();
            navigate("/admin", { replace: true });
        } catch (error: unknown) {
            if (
                axios.isAxiosError(error) &&
                (error.response?.status === 422 ||
                    error.response?.status === 400)
            ) {
                setError("code", {
                    type: "server",
                    message: "認証コードが正しくありません",
                });
                return;
            }

            throw error;
        }
    });

    return (
        <Box>
            <Card maxW="560px">
                <VStack spacing={5} align="stretch">
                    <Center>
                        <Heading size="md">管理者用2要素認証の設定</Heading>
                    </Center>
                    <Text>
                        認証アプリでQRコードを読み取り、表示された6桁のコードを入力してください
                    </Text>

                    {isInitializing && <Text>準備中です...</Text>}
                    {qrCodeSvg && (
                        <Center>
                            <Box
                                dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                            />
                        </Center>
                    )}

                    <form onSubmit={onSubmit}>
                        <FormControl isInvalid={Boolean(errors.code)}>
                            <FormLabel htmlFor="code">認証コード</FormLabel>
                            <Input
                                id="code"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                {...register("code", {
                                    required: "認証コードを入力してください",
                                })}
                            />
                            <FormErrorMessage>
                                {errors.code?.message}
                            </FormErrorMessage>
                        </FormControl>
                        <Button
                            type="submit"
                            mt={4}
                            w="100%"
                            isLoading={isSubmitting}
                            colorScheme="blue"
                            borderRadius="full"
                        >
                            2要素認証を有効化
                        </Button>
                    </form>
                </VStack>
            </Card>
        </Box>
    );
});
