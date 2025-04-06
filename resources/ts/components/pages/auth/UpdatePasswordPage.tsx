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
    Link,
} from "@chakra-ui/react";
import { FC, memo, useState } from "react";
import { Card } from "../../templates/Card";
import { HiOutlineEyeOff, HiOutlineEye } from "react-icons/hi";
import { SubmitButton } from "../../atoms/SubmitButton";
import { useAtomValue } from "jotai";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import { loadingAtom } from "../../../states/loadingAtom";
import { userAtom } from "../../../states/userAtom";

type UpdatePasswordFormInput = {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
};

export const UpdatePasswordPage: FC = memo(() => {
    const user = useAtomValue(userAtom);

    const { updatePassword } = useAuth();
    const isLoading = useAtomValue(loadingAtom);
    const [showCurrentPassword, setCurrentShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] =
        useState(false);
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm<UpdatePasswordFormInput>();

    const onSubmit = handleSubmit(async (data) => {
        const errorResponse = await updatePassword(
            data.currentPassword,
            data.newPassword,
            data.newPasswordConfirmation
        );
        if (!errorResponse) return;
        if ("errors" in errorResponse) {
            console.log(errorResponse);
            // エラーレスポンスを処理する
            for (const [field, message] of Object.entries(
                errorResponse.errors
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

    return (
        <Box w="80%" m="20px auto">
            <Card maxW="50%">
                <form onSubmit={onSubmit}>
                    <Center mb="20px">
                        <Heading>パスワードの変更</Heading>
                    </Center>

                    {/* 現在のパスワード */}
                    <FormControl
                        mb={3}
                        isInvalid={Boolean(errors.currentPassword)}
                        fontSize={{ base: "11px", md: "md" }}
                    >
                        <FormLabel>
                            現在のパスワードを入力してください
                        </FormLabel>

                        <InputGroup>
                            <Input
                                type={showCurrentPassword ? "text" : "password"}
                                id="currentPassword"
                                {...register("currentPassword", {
                                    required: "入力が必要です",
                                })}
                            />
                            <InputRightElement width="3rem">
                                <Icon
                                    as={
                                        showCurrentPassword
                                            ? HiOutlineEyeOff
                                            : HiOutlineEye
                                    }
                                    fontSize="20px"
                                    onClick={() =>
                                        setCurrentShowPassword(
                                            !showCurrentPassword
                                        )
                                    }
                                    cursor="pointer"
                                />
                            </InputRightElement>
                        </InputGroup>

                        <FormErrorMessage>
                            {errors.currentPassword &&
                                errors.currentPassword.message}
                        </FormErrorMessage>
                    </FormControl>

                    {/* 新しいパスワード */}
                    <FormControl
                        mb={3}
                        isInvalid={Boolean(errors.newPassword)}
                        fontSize={{ base: "11px", md: "md" }}
                    >
                        <FormLabel>
                            新しいパスワードを入力してください
                        </FormLabel>
                        <InputGroup>
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                {...register("newPassword", {
                                    required: "入力が必要です",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "パスワードは8文字以上である必要があります",
                                    },
                                })}
                            />
                            <InputRightElement width="3rem">
                                <Icon
                                    as={
                                        showNewPassword
                                            ? HiOutlineEyeOff
                                            : HiOutlineEye
                                    }
                                    fontSize="20px"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }
                                    cursor="pointer"
                                />
                            </InputRightElement>
                        </InputGroup>

                        <FormErrorMessage>
                            {errors.newPassword && errors.newPassword.message}
                        </FormErrorMessage>
                    </FormControl>

                    {/* 新しいパスワードの確認 */}
                    <FormControl
                        mb={3}
                        isInvalid={Boolean(errors.newPasswordConfirmation)}
                        fontSize={{ base: "11px", md: "md" }}
                    >
                        <FormLabel>
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
                                {...register("newPasswordConfirmation", {
                                    required: "入力が必要です",
                                    validate: (value) =>
                                        value === watch("newPassword") ||
                                        "新しいパスワードが一致しません",
                                })}
                            />
                            <InputRightElement width="3rem">
                                <Icon
                                    as={
                                        showNewPasswordConfirmation
                                            ? HiOutlineEyeOff
                                            : HiOutlineEye
                                    }
                                    fontSize="20px"
                                    onClick={() =>
                                        setShowNewPasswordConfirmation(
                                            !showNewPasswordConfirmation
                                        )
                                    }
                                    cursor="pointer"
                                />
                            </InputRightElement>
                        </InputGroup>

                        <FormErrorMessage>
                            {errors.newPasswordConfirmation &&
                                errors.newPasswordConfirmation.message}
                        </FormErrorMessage>
                    </FormControl>

                    <Box mt="20px">
                        <SubmitButton>パスワードの変更</SubmitButton>
                    </Box>
                </form>
            </Card>
        </Box>
    );
});
