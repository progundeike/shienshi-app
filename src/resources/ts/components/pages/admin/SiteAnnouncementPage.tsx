import {
    Alert,
    AlertIcon,
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Spinner,
    Stack,
    Switch,
    Text,
    Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { memo, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

import { axiosInstance } from "../../../hooks/axiosInstance";
import { useChakraToast } from "../../../utils/toastUtils";
import { siteAnnouncementQueryKey } from "../../../hooks/useSiteAnnouncement";

type SiteAnnouncementForm = {
    message: string;
    is_active: boolean;
    maintenance_start_at: string;
};

type ValidationErrorResponse = {
    errors?: Partial<Record<keyof SiteAnnouncementForm, string[]>>;
};

type SiteAnnouncementData = Omit<
    SiteAnnouncementForm,
    "maintenance_start_at"
> & {
    maintenance_start_at: string | null;
};

const fields = ["message", "is_active", "maintenance_start_at"] as const;

export const SiteAnnouncementPage = memo(() => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const { showSuccessToast } = useChakraToast();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SiteAnnouncementForm>({
        defaultValues: {
            message: "",
            is_active: false,
            maintenance_start_at: "",
        },
    });
    const isActive = watch("is_active");

    // 管理用APIから、非公開の文面も含めて取得する
    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            try {
                const response = await axiosInstance.get<SiteAnnouncementData>(
                    "/api/admin/site-announcement",
                    { signal: controller.signal },
                );

                if (!controller.signal.aborted) {
                    reset({
                        ...response.data,
                        maintenance_start_at:
                            response.data.maintenance_start_at ?? "",
                    });
                }
            } catch {
                if (!controller.signal.aborted) {
                    setLoadError(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        void load();

        return () => controller.abort();
    }, [reset]);

    const onSubmit: SubmitHandler<SiteAnnouncementForm> = async (data) => {
        clearErrors();

        try {
            const payload: SiteAnnouncementData = {
                ...data,
                maintenance_start_at:
                    data.maintenance_start_at.trim() === ""
                        ? null
                        : data.maintenance_start_at,
            };

            await axiosInstance.put("/api/admin/site-announcement", payload);

            void queryClient.invalidateQueries({
                queryKey: siteAnnouncementQueryKey,
            });
            reset(data);
            showSuccessToast("重要告知を保存しました");
        } catch (error: unknown) {
            if (axios.isAxiosError<ValidationErrorResponse>(error)) {
                const response = error.response;

                if (response?.status === 422 && response.data.errors) {
                    fields.forEach((field) => {
                        const message = response.data.errors?.[field]?.[0];

                        if (message) {
                            setError(field, {
                                type: "server",
                                message,
                            });
                        }
                    });

                    setError("root.server", {
                        message: "入力内容を確認してください。",
                    });
                    return;
                }

                if (response?.status === 401 || response?.status === 403) {
                    setError("root.server", {
                        message:
                            "保存できませんでした。ログイン状態・管理者権限・二要素認証の設定を確認してください。",
                    });
                    return;
                }
            }

            setError("root.server", {
                message:
                    "保存を確認できませんでした。通信状況を確認してください。入力内容は保持されています。",
            });
        }
    };

    if (isLoading) {
        return (
            <Box textAlign="center" my="50px">
                <Spinner aria-label="重要告知を読み込み中" />
            </Box>
        );
    }

    // 取得に失敗した状態では、空の設定を保存させない
    if (loadError) {
        return (
            <Box maxW="800px" mx="auto" my="50px" px={4}>
                <Alert status="error">
                    <AlertIcon />
                    告知を取得できませんでした。
                    ログイン状態や通信状況を確認して、ページを再読み込みしてください。
                </Alert>
            </Box>
        );
    }

    return (
        <Box maxW="800px" mx="auto" my="50px" px={4}>
            <Heading size="lg" mb={3}>
                重要告知編集
            </Heading>

            <Text color="gray.600" mb={8}>
                設定は「保存する」を押すと反映されます。
                告知を有効にすると、トップページに即時表示します。
                ヘッダーの案内はメンテナンス開始24時間前から表示します（トップページを除く）。
                開始時刻を過ぎても表示は続くため、復旧後に告知を無効にしてください。
                無効にしても、文面と開始日時は残ります。
            </Text>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={6}>
                    <FormControl
                        isRequired
                        isDisabled={isSubmitting}
                        isInvalid={!!errors.message}
                    >
                        <FormLabel htmlFor="message">
                            トップページ用の文面
                        </FormLabel>
                        <Textarea
                            id="message"
                            rows={7}
                            {...register("message", {
                                validate: (value) =>
                                    value.trim().length > 0 ||
                                    "トップページ用の文面を入力してください",
                                maxLength: {
                                    value: 5000,
                                    message: "5000文字以内で入力してください",
                                },
                            })}
                        />
                        <FormErrorMessage>
                            {errors.message?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl
                        isRequired={isActive}
                        isDisabled={isSubmitting}
                        isInvalid={!!errors.maintenance_start_at}
                    >
                        <FormLabel htmlFor="maintenance_start_at">
                            メンテナンス開始日時（日本時間）
                        </FormLabel>
                        <Input
                            id="maintenance_start_at"
                            type="datetime-local"
                            step={60}
                            {...register("maintenance_start_at", {
                                validate: (value, values) => {
                                    if (value.trim() === "") {
                                        return (
                                            !values.is_active ||
                                            "告知を有効にする場合は開始日時を入力してください"
                                        );
                                    }
                                    return (
                                        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(
                                            value,
                                        ) || "日時を分単位で入力してください"
                                    );
                                },
                            })}
                        />
                        <FormHelperText>
                            告知を有効にする場合は必須です。無効の下書きでは空欄にできます。
                            実際のメンテナンスを自動実行する設定ではありません。
                        </FormHelperText>
                        <FormErrorMessage>
                            {errors.maintenance_start_at?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl
                        isDisabled={isSubmitting}
                        isInvalid={!!errors.is_active}
                    >
                        <Box display="flex" alignItems="center">
                            <FormLabel htmlFor="is_active" mb={0}>
                                告知を有効にする
                            </FormLabel>
                            <Switch
                                id="is_active"
                                colorScheme="green"
                                {...register("is_active")}
                            />
                        </Box>
                        <FormErrorMessage>
                            {errors.is_active?.message}
                        </FormErrorMessage>
                    </FormControl>

                    {errors.root?.server && (
                        <Alert status="error">
                            <AlertIcon />
                            {errors.root.server.message}
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        colorScheme="green"
                        isLoading={isSubmitting}
                        loadingText="保存中"
                        alignSelf="flex-start"
                    >
                        保存する
                    </Button>
                </Stack>
            </form>
        </Box>
    );
});
