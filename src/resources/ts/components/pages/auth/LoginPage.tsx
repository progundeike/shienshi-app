import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    Link as ChakraLink,
    IconButton,
    Icon,
} from "@chakra-ui/react";
import { memo, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";
import { LoginFormInput } from "../../../types/form";
import { Card } from "../../templates/Card";
import { SubmitButton } from "../../atoms/SubmitButton";
import axios from "axios";
import type { ErrorResponse } from "../../../types/form";

export const LoginPage: FC = memo(() => {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () =>
        setShowPassword((current) => !current);
    const passwordIcon = showPassword ? HiOutlineEyeOff : HiOutlineEye;

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInput>();

    const onSubmit = handleSubmit(async (data) => {
        try {
            await login(data.username, data.password);
        } catch (error: unknown) {
            if (!axios.isAxiosError<ErrorResponse>(error)) {
                return;
            }

            if (error.response?.status === 401) {
                setError("password", {
                    type: "server",
                    message: "ユーザーIDまたはパスワードが正しくありません。",
                });
                return;
            }

            const responseData = error.response?.data;

            if (responseData?.errors) {
                // エラーレスポンスを処理する
                for (const [field, message] of Object.entries(
                    responseData.errors,
                )) {
                    if (["username", "password"].includes(field)) {
                        // バリデーションエラー
                        setError(field as keyof LoginFormInput, {
                            type: "server",
                            message: message[0] as string,
                        });
                    } else {
                        // バリデーション以外のエラー
                        console.error(responseData);
                    }
                }
            }
        }
    });

    return (
        <Box p={2} m={1} fontSize={{ base: "sm", md: "md" }}>
            <Center my={3} lineHeight="1.8">
                <Text>
                    AI添削機能の利用にはログインが必要です。
                    登録がお済みでない場合は、
                    <ChakraLink
                        as={RouterLink}
                        textDecoration="underline"
                        color="blue.600"
                        to="/register"
                    >
                        ユーザー登録
                    </ChakraLink>
                    をしてください。
                </Text>
            </Center>
            <Card maxW="480px">
                <form onSubmit={onSubmit}>
                    <Center mb={5}>
                        <Heading size={{ base: "md", md: "lg" }}>
                            ログイン
                        </Heading>
                    </Center>
                    <FormControl
                        mb={3}
                        isInvalid={Boolean(errors.username)}
                        fontSize={{ base: "sm", md: "md" }}
                    >
                        <FormLabel
                            htmlFor="username"
                            fontSize={{ base: "sm", md: "md" }}
                        >
                            ユーザーID
                        </FormLabel>
                        <Input
                            type="text"
                            id="username"
                            autoComplete="username"
                            {...register("username", {
                                required: "入力が必要です",
                            })}
                        />
                        <FormErrorMessage>
                            {errors.username && errors.username.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl mb={3} isInvalid={Boolean(errors.password)}>
                        <Flex justify="space-between">
                            <FormLabel
                                htmlFor="password"
                                fontSize={{ base: "sm", md: "md" }}
                            >
                                パスワード
                            </FormLabel>
                        </Flex>
                        <InputGroup>
                            <Input
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                id="password"
                                {...register("password", {
                                    required: "入力が必要です",
                                })}
                            />
                            <InputRightElement width="3rem">
                                <IconButton
                                    aria-label={
                                        showPassword
                                            ? "パスワードを隠す"
                                            : "パスワードを表示"
                                    }
                                    icon={
                                        <Icon
                                            as={passwordIcon}
                                            boxSize={{
                                                base: 4,
                                                md: 6,
                                            }}
                                        />
                                    }
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleClickShowPassword}
                                />
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                            {errors.password && errors.password.message}
                        </FormErrorMessage>
                    </FormControl>
                    <SubmitButton
                        isLoading={isSubmitting}
                        loadingText="ログイン中"
                    >
                        ログイン
                    </SubmitButton>

                    <Divider my={2} />

                    <Text textAlign="center">
                        アカウントをお持ちでない方はこちら
                    </Text>
                    <Button
                        as={RouterLink}
                        to="/register"
                        w="100%"
                        my={2}
                        borderRadius="full"
                        backgroundColor="accentColor"
                        color="accentTextColor"
                        shadow="md"
                    >
                        ユーザー登録
                    </Button>
                </form>
            </Card>
        </Box>
    );
});
