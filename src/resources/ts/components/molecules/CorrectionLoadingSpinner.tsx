import {
    Box,
    Center,
    CircularProgress,
    Flex,
    Text,
    VStack,
    Heading,
} from "@chakra-ui/react";
import { FC } from "react";
import { DisplayPurposeAndReviewComment } from "./DisplayPurposeAndReviewComment";

type Props = {
    purpose: string | null;
    reviewComment: string | null;
    isPurposeAndReviewCommentLoading: boolean;
};

export const CorrectionLoadingSpinner: FC<Props> = (props) => {
    const { purpose, reviewComment, isPurposeAndReviewCommentLoading } = props;

    return (
        <Box>
            <Center mt="20px">
                <Box position="relative" w="300px" h="300px">
                    <CircularProgress
                        isIndeterminate
                        color="green.200"
                        size="300px"
                        thickness="10px"
                    />
                    <Center
                        position="absolute"
                        inset="20px"
                        bg="white"
                        borderRadius="full"
                        boxShadow="lg"
                        px={8}
                        textAlign="center"
                    >
                        <VStack spacing={3}>
                            <Text fontSize="sm" color="gray.600" mb={2}>
                                採点処理中
                            </Text>
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                lineHeight="tall"
                            >
                                お疲れ様でした!
                                <br />
                                AIがあなたの答案を添削しています。
                            </Text>
                            <Text fontSize="sm" color="gray.600" mt={5}>
                                添削には通常10~30秒かかります。
                            </Text>
                        </VStack>
                    </Center>
                </Box>
            </Center>

            {/* 採点講評と出題趣旨 */}
            {!isPurposeAndReviewCommentLoading && (
                <DisplayPurposeAndReviewComment
                    purpose={purpose}
                    reviewComment={reviewComment}
                />
            )}
        </Box>
    );
};
