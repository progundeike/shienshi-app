import {
    Box,
    Center,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    VStack,
    Text,
    Icon,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { memo, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useAtom } from "jotai";

import { useAuth } from "../../../hooks/useAuth";
import { RegisterFormInput } from "../../../types/form";
import { loadingAtom } from "../../../states/loadingAtom";
import { Card } from "../../templates/Card";
import { SubmitButton } from "../../atoms/SubmitButton";

const MIN_USERNAME_LENGTH = 8;
const MAX_USERNAME_LENGTH = 50;

const PASSWORD_MIN_LENGTH = 8;

// TODO: loadingの処理を追加する

export const RegisterPage: FC = memo(() => {
    const { registerUser } = useAuth();
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm<RegisterFormInput>();
    const [isLoading, setIsLoading] = useAtom(loadingAtom);
    const usernameLength = watch("username")?.length || 0;

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const onSubmit = handleSubmit(async (data) => {
        const errorResponse = await registerUser(data);
        if (!errorResponse) return;
        if ("errors" in errorResponse) {
            // エラーレスポンスを処理する
            for (const [field, message] of Object.entries(
                errorResponse.errors
            )) {
                if (["username", "password"].includes(field)) {
                    // バリデーションエラー
                    setError(field as keyof RegisterFormInput, {
                        type: "manual",
                        message: message[0] as string,
                    });
                } else {
                    // バリデーション以外のエラー
                    console.error(errorResponse);
                }
            }
        }
    });

    return (
        <>
            <Card maxW="lg">
                <form onSubmit={onSubmit}>
                    <Center mb="20px">
                        <Heading>ユーザー登録</Heading>
                    </Center>
                    <Box my="20px">
                        <Text>
                            ユーザー登録をすることで、AI添削機能や学習履歴の保存が利用できます。
                            当サイトは無料のサービスです。
                        </Text>
                    </Box>

                    <FormControl mb={3} isInvalid={Boolean(errors.username)}>
                        <FormLabel htmlFor="name">ユーザーID</FormLabel>
                        <Text color="gray.600">
                            {`${MIN_USERNAME_LENGTH}~${MAX_USERNAME_LENGTH}
                            文字以内の半角英数字とアンダーバーのみで入力してください`}
                        </Text>
                        <InputGroup>
                            <Input
                                type="text"
                                id="username"
                                autoComplete="off"
                                {...register("username", {
                                    required: "入力が必要です",
                                    validate: (value) => {
                                        // 正規表現を動的に生成する
                                        const regex = new RegExp(
                                            `^[a-zA-Z0-9_]{${MIN_USERNAME_LENGTH},${MAX_USERNAME_LENGTH}}$`
                                        );
                                        if (!regex.test(value)) {
                                            return `${MIN_USERNAME_LENGTH}~${MAX_USERNAME_LENGTH}文字以内の半角英数字とアンダーバーのみで入力してください`;
                                        }
                                    },
                                })}
                            />
                            <InputRightElement
                                mr="10px"
                                children={
                                    <Text
                                        color={
                                            usernameLength <
                                                MIN_USERNAME_LENGTH ||
                                            usernameLength > MAX_USERNAME_LENGTH
                                                ? "red"
                                                : "gray.600"
                                        }
                                    >
                                        {usernameLength > 0
                                            ? usernameLength +
                                              "/" +
                                              MAX_USERNAME_LENGTH
                                            : ""}
                                    </Text>
                                }
                            />
                        </InputGroup>
                        <FormErrorMessage>
                            {errors.username && errors.username.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl mb={3} isInvalid={Boolean(errors.password)}>
                        <FormLabel htmlFor="password">パスワード</FormLabel>
                        <InputGroup>
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder={`半角英数記号${PASSWORD_MIN_LENGTH}文字以上`}
                                {...register("password", {
                                    required: "入力が必要です",
                                    validate: (value: string) => {
                                        if (
                                            value.length < PASSWORD_MIN_LENGTH
                                        ) {
                                            return `${PASSWORD_MIN_LENGTH}文字以上で入力してください`;
                                        }
                                    },
                                })}
                                {...register("password", {
                                    required: "入力が必要です",
                                })}
                            />
                            <InputRightElement width="3rem">
                                <Icon
                                    as={
                                        showPassword
                                            ? HiOutlineEye
                                            : HiOutlineEyeOff
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
                    <VStack>
                        <Link to="/terms">利用規約はこちら</Link>
                        <SubmitButton>登録</SubmitButton>
                    </VStack>
                </form>
            </Card>
        </>
    );
});
