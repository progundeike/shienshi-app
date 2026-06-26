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
    IconButton,
} from "@chakra-ui/react";
import { memo, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { useAtomValue } from "jotai";

import { useAuth } from "../../../hooks/useAuth";
import { RegisterFormInput } from "../../../types/form";
import { loadingAtom } from "../../../states/loadingAtom";
import { Card } from "../../templates/Card";
import { SubmitButton } from "../../atoms/SubmitButton";
import { LoadingPage } from "../LoadingPage";

const MAX_USERNAME_LENGTH = 50;

const PASSWORD_MIN_LENGTH = 8;

export const RegisterPage: FC = memo(() => {
    const [isLoading, setIsLoading] = useState(false);
    const { registerUser } = useAuth();
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm<RegisterFormInput>();
    const usernameLength = watch("username")?.length || 0;

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => () =>
        setShowPassword((current) => !current);
    const passwordIcon = showPassword ? HiOutlineEyeOff : HiOutlineEye;

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            const errorResponse = await registerUser(data);
            if (!errorResponse) return;
            if ("errors" in errorResponse) {
                // エラーレスポンスを処理する
                for (const [field, message] of Object.entries(
                    errorResponse.errors,
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
        } finally {
            setIsLoading(false);
        }
    });

    if (isLoading) return <LoadingPage />;

    return (
        <>
            <Box p={2} m={1} fontSize={{ base: "sm", md: "md" }}>
                <Card maxW="50%">
                    <form onSubmit={onSubmit}>
                        <Center mb="20px">
                            <Heading>ユーザー登録</Heading>
                        </Center>
                        <Box my="20px">
                            <Text>
                                ユーザー登録をすることで、AI添削機能や学習履歴の保存が利用できます。
                                <br />
                                当サイトは無料のサービスです。
                            </Text>
                        </Box>

                        <FormControl
                            mb={3}
                            isInvalid={Boolean(errors.username)}
                        >
                            <FormLabel htmlFor="name">ユーザーID</FormLabel>
                            <Text color="gray.600">
                                半角英小文字、数字、アンダーバーが使用できます
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
                                                `^[a-z0-9_]{1,${MAX_USERNAME_LENGTH}}$`,
                                            );
                                            if (!regex.test(value)) {
                                                return `${MAX_USERNAME_LENGTH}文字以内で半角英小文字、数字、アンダーバーのみ使用できます`;
                                            }
                                        },
                                    })}
                                />
                                <InputRightElement
                                    mr="10px"
                                    children={
                                        <Text
                                            color={
                                                usernameLength === 0 ||
                                                usernameLength >
                                                    MAX_USERNAME_LENGTH
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

                        {/* パスワード */}
                        <FormControl
                            mb={3}
                            isInvalid={Boolean(errors.password)}
                        >
                            <FormLabel htmlFor="password">パスワード</FormLabel>
                            <Text color="gray.600">
                                半角英数記号{PASSWORD_MIN_LENGTH}
                                文字以上で入力してください
                            </Text>
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    {...register("password", {
                                        required: "入力が必要です",
                                        validate: (value: string) => {
                                            if (
                                                value.length <
                                                PASSWORD_MIN_LENGTH
                                            ) {
                                                return `${PASSWORD_MIN_LENGTH}文字以上で入力してください`;
                                            }
                                        },
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

                        {/* パスワード再入力 */}
                        <FormControl
                            mb={3}
                            isInvalid={Boolean(errors.password_confirmation)}
                        >
                            <FormLabel htmlFor="password_confirmation">
                                パスワード（確認）
                            </FormLabel>
                            <Text color="gray.600">
                                パスワードを再入力してください
                            </Text>
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password_confirmation"
                                    {...register("password_confirmation", {
                                        required: "入力が必要です",
                                        validate: (value: string) => {
                                            if (value !== watch("password")) {
                                                return "パスワードが一致しません";
                                            }
                                        },
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
                                {errors.password_confirmation &&
                                    errors.password_confirmation.message}
                            </FormErrorMessage>
                        </FormControl>

                        <VStack>
                            <Link to="/terms">利用規約はこちら</Link>
                            <SubmitButton isLoading={isLoading}>
                                登録
                            </SubmitButton>
                        </VStack>
                    </form>
                </Card>
            </Box>
        </>
    );
});
