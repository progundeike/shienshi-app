import {
    Box,
    Center,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { FC, memo, useState } from "react";
import { Card } from "../../templates/Card";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import { SubmitButton } from "../../atoms/SubmitButton";
import { useAtomValue } from "jotai";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import { loadingAtom } from "../../../states/loadingAtom";
import { LoadingPage } from "../LoadingPage";

type UpdatePasswordFormInput = {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
};

export const UpdatePasswordPage: FC = memo(() => {
    const { updatePassword } = useAuth();
    const isLoading = useAtomValue(loadingAtom);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] =
        useState(false);

    const handleClickShowCurrentPassword = () =>
        setShowCurrentPassword((current) => !current);
    const handleClickShowNewPassword = () =>
        setShowNewPassword((current) => !current);
    const handleClickShowNewPasswordConfirmation = () =>
        setShowNewPasswordConfirmation((current) => !current);

    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm<UpdatePasswordFormInput>();

    const onSubmit = handleSubmit(async (data) => {
        const errorResponse = await updatePassword(
            data.current_password,
            data.new_password,
            data.new_password_confirmation,
        );
        if (!errorResponse) return;
        if ("errors" in errorResponse) {
            console.log(errorResponse);
            // エラーレスポンスを処理する
            for (const [field, message] of Object.entries(
                errorResponse.errors,
            )) {
                if (["current_password", "new_password"].includes(field)) {
                    // バリデーションエラー
                    setError(field as keyof UpdatePasswordFormInput, {
                        type: "manual",
                        message: (message as string[])[0],
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
        <Box p={2} m={1} fontSize={{ base: "sm", md: "md" }}>
            <Card maxW="480px">
                <form onSubmit={onSubmit}>
                    <Center mb={5}>
                        <Heading size={{ base: "md", md: "lg" }}>
                            パスワードの変更
                        </Heading>
                    </Center>

                    {/* 現在のパスワード */}
                    <FormControl
                        mb={3}
                        isInvalid={Boolean(errors.current_password)}
                        fontSize={{ base: "sm", md: "md" }}
                    >
                        <FormLabel htmlFor="currentPassword">
                            現在のパスワードを入力してください
                        </FormLabel>

                        <InputGroup>
                            <Input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                {...register("current_password", {
                                    required: "入力が必要です",
                                })}
                            />
                            <InputRightElement width="3rem">
                                <IconButton
                                    aria-label={
                                        showCurrentPassword
                                            ? "パスワードを隠す"
                                            : "パスワードを表示"
                                    }
                                    icon={
                                        showCurrentPassword ? (
                                            <Icon
                                                as={HiOutlineEyeOff}
                                                boxSize={{
                                                    base: 4,
                                                    md: 6,
                                                }}
                                            />
                                        ) : (
                                            <Icon
                                                as={HiOutlineEye}
                                                boxSize={{
                                                    base: 4,
                                                    md: 6,
                                                }}
                                            />
                                        )
                                    }
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleClickShowCurrentPassword}
                                />
                            </InputRightElement>
                        </InputGroup>

                        <FormErrorMessage>
                            {errors.current_password &&
                                errors.current_password.message}
                        </FormErrorMessage>
                    </FormControl>

                    {/* 新しいパスワード */}
                    <FormControl
                        mb={3}
                        isInvalid={Boolean(errors.new_password)}
                        fontSize={{ base: "sm", md: "md" }}
                    >
                        <FormLabel htmlFor="newPassword">
                            新しいパスワードを入力してください
                        </FormLabel>
                        <InputGroup>
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                {...register("new_password", {
                                    required: "入力が必要です",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "パスワードは8文字以上である必要があります",
                                    },
                                })}
                            />
                            <InputRightElement width="3rem">
                                <IconButton
                                    aria-label={
                                        showNewPassword
                                            ? "パスワードを隠す"
                                            : "パスワードを表示"
                                    }
                                    icon={
                                        showNewPassword ? (
                                            <Icon
                                                as={HiOutlineEyeOff}
                                                boxSize={{
                                                    base: 4,
                                                    md: 6,
                                                }}
                                            />
                                        ) : (
                                            <Icon
                                                as={HiOutlineEye}
                                                boxSize={{
                                                    base: 4,
                                                    md: 6,
                                                }}
                                            />
                                        )
                                    }
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleClickShowNewPassword}
                                />
                            </InputRightElement>
                        </InputGroup>

                        <FormErrorMessage>
                            {errors.new_password && errors.new_password.message}
                        </FormErrorMessage>
                    </FormControl>

                    {/* 新しいパスワードの確認 */}
                    <FormControl
                        mb={3}
                        isInvalid={Boolean(errors.new_password_confirmation)}
                        fontSize={{ base: "sm", md: "md" }}
                    >
                        <FormLabel htmlFor="newPasswordConfirmation">
                            新しいパスワードを再入力してください
                        </FormLabel>
                        <InputGroup>
                            <Input
                                type={
                                    showNewPasswordConfirmation
                                        ? "text"
                                        : "password"
                                }
                                id="newPasswordConfirmation"
                                {...register("new_password_confirmation", {
                                    required: "入力が必要です",
                                    // validate: (value) =>
                                    //     value === watch("newPassword") ||
                                    //     "新しいパスワードが一致しません",
                                })}
                            />
                            <InputRightElement width="3rem">
                                <IconButton
                                    aria-label={
                                        showNewPasswordConfirmation
                                            ? "パスワードを隠す"
                                            : "パスワードを表示"
                                    }
                                    icon={
                                        showNewPasswordConfirmation ? (
                                            <Icon
                                                as={HiOutlineEyeOff}
                                                boxSize={{
                                                    base: 4,
                                                    md: 6,
                                                }}
                                            />
                                        ) : (
                                            <Icon
                                                as={HiOutlineEye}
                                                boxSize={{
                                                    base: 4,
                                                    md: 6,
                                                }}
                                            />
                                        )
                                    }
                                    size="sm"
                                    variant="ghost"
                                    onClick={
                                        handleClickShowNewPasswordConfirmation
                                    }
                                />
                            </InputRightElement>
                        </InputGroup>

                        <FormErrorMessage>
                            {errors.new_password_confirmation &&
                                errors.new_password_confirmation.message}
                        </FormErrorMessage>
                    </FormControl>

                    <Box mt={5}>
                        <SubmitButton>パスワードの変更</SubmitButton>
                    </Box>
                </form>
            </Card>
        </Box>
    );
});
