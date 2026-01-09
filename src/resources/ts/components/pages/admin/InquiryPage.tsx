import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, memo } from "react";

import { axiosInstance } from "../../../hooks/axiosInstance";
import { useChakraToast } from "../../../utils/toastUtils";
import { Inquiry } from "../../../types/form";

export const InquiryPage: FC = memo(() => {
    const { unexpectedServerErrorToast, toast } = useChakraToast();
    const qc = useQueryClient();

    const { data: inquiries = [] } = useQuery({
        queryKey: ["inquiries"],
        queryFn: async () => {
            const res = await axiosInstance.get("/api/admin/inquiry");
            return res.data as Inquiry[];
        },
    });

    const deleteInquiry = useMutation({
        mutationFn: async (id: number) => {
            await axiosInstance.delete(`/api/admin/inquiry/${id}`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["inquiries"] });
            toast({
                title: `お問い合わせを削除しました`,
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "bottom-right",
            });
        },
        onError: () => {
            toast(unexpectedServerErrorToast);
        },
    });

    return (
        <Box textAlign="center" p="30px" w="80%" mx="auto">
            <Heading m="30px">お問い合わせ確認</Heading>

            {inquiries.length === 0 ? (
                <Text>お問い合わせはまだありません</Text>
            ) : (
                inquiries.map((inquiry: Inquiry) => (
                    <Box textAlign="left" mb="20px" key={inquiry.id}>
                        <Flex direction="column" gap="10px">
                            <Text>
                                投稿日:
                                {new Date(inquiry.created_at).toLocaleString(
                                    "ja-JP",
                                    {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                        timeZone: "Asia/Tokyo",
                                    }
                                )}
                            </Text>
                            <Text>お名前: {inquiry.name}</Text>
                            <Text>ユーザーID: {inquiry.user_id ?? "なし"}</Text>
                            <Text>
                                メールアドレス: {inquiry.email ?? "なし"}
                            </Text>
                            <Text>お問い合わせ内容:</Text>
                            <Text>{inquiry.message}</Text>
                            <Box textAlign="center">
                                <Button
                                    colorScheme="red"
                                    w="50%"
                                    borderRadius="full"
                                    onClick={() => {
                                        deleteInquiry.mutateAsync(inquiry.id);
                                    }}
                                >
                                    削除
                                </Button>
                            </Box>
                            <Divider borderColor="black" />
                        </Flex>
                    </Box>
                ))
            )}
        </Box>
    );
});
