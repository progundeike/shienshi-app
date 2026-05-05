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
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Text,
} from "@chakra-ui/react";
import { memo, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";

import { useAuth } from "../../../hooks/useAuth";
import { userAtom } from "../../../states/userAtom";
import { LoginFormInput } from "../../../types/form";
import { loadingAtom } from "../../../states/loadingAtom";
import { LoadingPage } from "../LoadingPage";
import { Card } from "../../templates/Card";
import { SubmitButton } from "../../atoms/SubmitButton";

export const LoginPage: FC = memo(() => {
    const user = useAtomValue(userAtom);

    const [emailVerifyQuery, setEmailVerifyQuery] = useState("");
    const { login } = useAuth();
    const isLoading = useAtomValue(loadingAtom);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginFormInput>();

    const onSubmit = handleSubmit(async (data) => {
        const errorResponse = await login(data.username, data.password);
        if (!errorResponse) return;
        if ("errors" in errorResponse) {
            // エラーレスポンスを処理する
            for (const [field, message] of Object.entries(
                errorResponse.errors,
            )) {
                if (["username", "password"].includes(field)) {
                    // バリデーションエラー
                    setError(field as keyof LoginFormInput, {
                        type: "manual",
                        message: message[0] as string,
                    });
                } else {
                    // バリデーション以外のエラー
                    console.log(errorResponse);
                }
            }
        }
    });

    if (isLoading) return <LoadingPage />;

    return (
        <>
            <Center my="10px">
                <Heading size="sm">
                    AI添削機能にはログインが必要です。登録がお済みでない場合は、
                    <Box as="span" textDecoration="underline" color="blue.600">
                        <Link to="/register">ユーザー登録</Link>
                    </Box>
                    をしてください。
                </Heading>
            </Center>
            <Card maxW="50%">
                <form onSubmit={onSubmit}>
                    <Center mb="20px">
                        <Heading>ログイン</Heading>
                    </Center>
                    <FormControl
                        mb={3}
                        isInvalid={Boolean(errors.username)}
                        fontSize={{ base: "11px", md: "md" }}
                    >
                        <FormLabel>ユーザーID</FormLabel>
                        <Input
                            type="text"
                            id="string"
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
                            <FormLabel htmlFor="password">パスワード</FormLabel>
                            <Link to="/forgot-password">
                                <Text fontSize={{ base: "13px", md: "16px" }}>
                                    パスワードをお忘れですか？
                                </Text>
                            </Link>
                        </Flex>
                        <InputGroup>
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                {...register("password", {
                                    required: "入力が必要です",
                                })}
                            />
                            <InputRightElement width="3rem">
                                <Icon
                                    as={
                                        showPassword
                                            ? HiOutlineEyeOff
                                            : HiOutlineEye
                                    }
                                    fontSize="20px"
                                    onClick={handleClickShowPassword}
                                    cursor="pointer"
                                />
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                            {errors.password && errors.password.message}
                        </FormErrorMessage>
                    </FormControl>
                    <SubmitButton>ログイン</SubmitButton>

                    <Divider my="10px" />

                    <Text textAlign="center">
                        アカウントをお持ちでない方はこちら
                    </Text>
                    <Link to="/register">
                        <Button
                            w="100%"
                            my="10px"
                            borderRadius="full"
                            backgroundColor="accentColor"
                            color="accentTextColor"
                            shadow="md"
                        >
                            ユーザー登録
                        </Button>
                    </Link>
                </form>
            </Card>
        </>
    );
});
